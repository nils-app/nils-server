import jwt from 'jsonwebtoken';

import { JWT_SECRET } from "../../../constants";

export const genToken = (domain: string): string => jwt.sign(JSON.stringify(domain), JWT_SECRET);
