import { Response, Request } from 'express'
import { check, validationResult } from 'express-validator';

import errors from '../../lib/error';
import { transferwiseRequest, PROFILE_ID } from '../../lib/transferwise';
import db from '../../db';

export const validate = [
  check('accountHolderName').isLength({ min: 1 }),
  check('currency').isLength({ min: 1 }),
  check('email').isEmail(),
];

export default async (req: Request, res: Response) => {
  const errorList = validationResult(req);
  if (!errorList.isEmpty()) {
    return errors(res)(422, ...errorList.array());
  }

  const payload = { 
    profile: PROFILE_ID, 
    accountHolderName: req.body.accountHolderName,
    currency: req.body.currency, 
    type: "email", 
     details: { 
        email: req.body.email
     } 
   };

   console.log('TW Request payload', payload);

  try {
    const data = await transferwiseRequest('/v1/accounts', 'POST', payload);
    const recipientId = data.id;

    db.query('UPDATE users SET transferwise_id = $1, currency = $2 WHERE uuid = $3', [recipientId, req.body.currency, req.user.uuid]);

    res.json({
      recipient: recipientId,
    })
  } catch (e) {
    if (e.response && e.response.data) {
      console.log(e.response.data);
    }
    return errors(res)(400, e.message);
  }
}

const getTransferWiseProfile = async () => {

};
