import { Response, Request } from 'express'

import errors from '../../lib/error';
import { transferwiseRequest } from '../../lib/transferwise';

export default async (req: Request, res: Response) => {
  const accountId = req.user.transferwise_id;

  if (!accountId) {
    return errors(res)(404, 'Account not setup');
  }

  try {
    const data = await transferwiseRequest(`/v1/accounts/${accountId}`, 'GET');
    res.json(data);
  } catch (e) {
    if (e.response && e.response.data) {
      console.log(e.response.data);
    }
    return errors(res)(400, e.message);
  }
}
