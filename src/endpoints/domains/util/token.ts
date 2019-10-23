import jwt from 'jsonwebtoken';

import { JWT_SECRET } from "../../../constants";

export const genToken = (uuid: string, domain: string): string => {
  const payload = {
    uuid,
    domain,
  };
  return jwt.sign(JSON.stringify(payload), JWT_SECRET)
};
