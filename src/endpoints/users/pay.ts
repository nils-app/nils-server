import { Response, Request } from 'express'
import { check, validationResult } from 'express-validator';

import db from '../../db';
import errors from '../../endpoints/auth/lib/error';

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

    try {
      // get the domain id
      let data = await db.query('SELECT uuid FROM domains WHERE domain = $1', [payload.domain]);
      if (data.rows.length < 1) {
        // domain doesnt exist
        return errors(res)(404, `Domain "${payload.domain}" is not registered with Nils`);
      }

      const domainId = data.rows[0].uuid;

      // insert payment
      const params = [
        req.user.uuid,
        domainId,
        payload.amount_nils,
      ];
      data = await db.query('INSERT INTO transactions(user_id, domain_id, amount_nils) VALUES($1, $2, $3) RETURNING *', params);

      if (data.rows.length < 1) {
        return errors(res)(500, `Unable to send payment to "${payload.domain}"`);
      }

      return res.json(data.rows[0]);
    } catch (e) {
      console.error(e);
      return errors(res)(500, 'Unable to send payment');
    }
  }
]
