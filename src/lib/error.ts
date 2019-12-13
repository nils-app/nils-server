import { Response } from 'express';

const errors = (res: Response) => (status: number, ...errors : any[]) => {
  let returnErrors = errors;
  if (errors.length === 1 && Array.isArray(errors[0])) {
    returnErrors = errors[0];
  }
  return res.status(status).send({
    errors: returnErrors,
  });
}

export default errors;
