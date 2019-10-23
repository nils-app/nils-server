import { Response } from 'express';

const errors = (res: Response) => (status: number, ...errors : any[]) => {
  return res.status(status).send({
    errors,
  });
}

export default errors;
