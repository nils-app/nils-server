import { Response, Request } from 'express'

import errors from '../../lib/error';
import { transferwiseRequest } from '../../lib/transferwise';

export default async (req: Request, res: Response) => {
  const txId: string = req.params.tx_id;

  try {
    const data = await transferwiseRequest(`/v1/transfers/${txId}`, 'GET');
    res.json(data);
  } catch (e) {
    if (e.response && e.response.data) {
      console.log(e.response.data);
    }
    return errors(res)(400, e.message);
  }
}
