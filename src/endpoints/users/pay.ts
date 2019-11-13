import { Response, Request } from 'express'
import { check, validationResult } from 'express-validator';

import db from '../../db';
import errors from '../../lib/error';
import { MIN_NILS_PAYMENT, MIN_HOURS_DOMAIN } from '../../constants';

export const validate = [
  check('amount_nils').isFloat({ min: 0 }),
  check('domain').isLength({ min: 1 }),
];

export default [
  validate,
  async (req: Request, res: Response) => {
    const errorList = validationResult(req);
    if (!errorList.isEmpty()) {
      return errors(res)(422, ...errorList.array());
    }

    const payload = req.body;

    if (payload.amount_nils < MIN_NILS_PAYMENT) {
      payload.amount_nils = MIN_NILS_PAYMENT;
    }

    // clean up the domain


    // Using a db client to allow combining all queries in a transaction
    const client = await db.connect()
    let domainId;

    try {
      // TODO: replace domain with domain hash when column is added
      let data = await db.query('SELECT uuid FROM domains WHERE domain = $1', [payload.domain]);
      if (data.rows.length < 1) {
        // domain doesnt exist
        return errors(res)(404, `Domain "${payload.domain}" is not registered with Nils`);
      }

      domainId = data.rows[0].uuid;

      // Check that a transaction hasn't been sent within the last MIN_HOURS_DOMAIN
      data = await db.query('SELECT uuid, amount_nils, created_on FROM transactions WHERE user_id = $1 AND domain_id = $2 AND (EXTRACT(EPOCH FROM current_timestamp) - EXTRACT(EPOCH FROM created_on))/3600 < $3', [
        req.user.uuid,
        domainId,
        MIN_HOURS_DOMAIN,
      ]);

      if (data.rowCount > 0) {
        // A transaction has already been made
        return res.json({
          domain: payload.domain,
          amount_nils: payload.amount_nils,
          created_on: data.rows[0].created_on,
        });
      }

      // About to send a new transaction, check that the user has enough moneys
      if (req.user.balance - payload.amount_nils <= 0) {
        return errors(res)(422, `Your balance is too low! (${req.user.balance})`);
      }

    } catch (e) {
      console.error(e);
      await client.query('ROLLBACK');
      return errors(res)(500, 'Unable to send payment');
    }
    try {
      await client.query('BEGIN')

      // insert payment
      const params = [
        req.user.uuid,
        domainId,
        payload.amount_nils,
      ];
      let data = await db.query('INSERT INTO transactions(user_id, domain_id, amount_nils) VALUES($1, $2, $3) RETURNING *', params);

      if (data.rows.length < 1) {
        await client.query('ROLLBACK');
        return errors(res)(500, `Unable to send payment to "${payload.domain}"`);
      }

      const updatedUserBalance = await db.query('UPDATE users SET balance = balance - $1 WHERE uuid = $2 RETURNING *', [payload.amount_nils, req.user.uuid]);
      const updatedDomainBalance = await db.query('UPDATE domains SET balance = balance + $1 WHERE uuid = $2 RETURNING *', [payload.amount_nils, domainId]);

      if (updatedUserBalance.rowCount < 1 || updatedDomainBalance.rowCount < 1) {
        await client.query('ROLLBACK');
        return errors(res)(500, `Unable to send payment to "${payload.domain}"`);
      }

      await client.query('COMMIT')

      return res.json({
        domain: payload.domain,
        amount_nils: payload.amount_nils,
        created_on: data.rows[0].created_on,
      });
    } catch (e) {
      console.error(e);
      await client.query('ROLLBACK');
      return errors(res)(500, 'Unable to send payment');
    } finally {
      client.release()
    }
  }
]
