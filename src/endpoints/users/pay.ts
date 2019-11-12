import { Response, Request } from 'express'
import { check, validationResult } from 'express-validator';

import db from '../../db';
import errors from '../../lib/error';
import { MIN_NILS_PAYMENT } from '../../constants';

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

    // Using a db client to allow combining all queries in a transaction
    const client = await db.connect()

    try {
      // get the domain id
      let data = await db.query('SELECT uuid FROM domains WHERE domain = $1', [payload.domain]);
      if (data.rows.length < 1) {
        // domain doesnt exist
        return errors(res)(404, `Domain "${payload.domain}" is not registered with Nils`);
      }

      const domainId = data.rows[0].uuid;

      await client.query('BEGIN')

      // insert payment
      const params = [
        req.user.uuid,
        domainId,
        payload.amount_nils,
      ];
      data = await db.query('INSERT INTO transactions(user_id, domain_id, amount_nils) VALUES($1, $2, $3) RETURNING *', params);

      if (data.rows.length < 1) {
        await client.query('ROLLBACK');
        return errors(res)(500, `Unable to send payment to "${payload.domain}"`);
      }

      const updated = await db.query('UPDATE users SET balance = balance - $1 WHERE uuid = $2 RETURNING *', [payload.amount_nils, req.user.uuid]);

      if (updated.rowCount < 1) {
        await client.query('ROLLBACK');
        return errors(res)(500, `Unable to send payment to "${payload.domain}"`);
      }

      await client.query('COMMIT')

      return res.json(data.rows[0]);
    } catch (e) {
      console.error(e);
      await client.query('ROLLBACK');
      return errors(res)(500, 'Unable to send payment');
    } finally {
      client.release()
    }
  }
]
