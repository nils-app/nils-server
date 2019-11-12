import { Response, Request } from 'express'
import axios, { AxiosRequestConfig } from 'axios';
import dns from 'dns';

import db from '../../../db';
import { genToken } from './util/token';
import errors from '../../../lib/error';

async function processVerification(req: Request, res: Response, domain: string) {
  const user_id = req.user.uuid;
  const data = await db.query('INSERT INTO domains(user_id, domain) VALUES($1, $2) RETURNING *', [user_id, domain]);
  if (data.rows.length > 0) {
    return res.send(data.rows[0]);
  }
  return errors(res)(500, 'The domain was verified successfully but we were unable to add it to your account. Please try again later.');
}

export default async (req: Request, res: Response) => {
  const domain: string = req.params.domain;
  const token = genToken(req.user.uuid, domain);

  let verified: boolean = false;

  // File verification
  verified = await verifyUrl(`http://${domain}/.well-known/nils`, token);
  if (verified) {
    return processVerification(req, res, domain);
  }

  verified = await verifyUrl(`https://${domain}/.well-known/nils`, token);
  if (verified) {
    return processVerification(req, res, domain);
  }

  // DNS verification
  verified = await verifyDns(domain, token);

  if (verified) {
    return processVerification(req, res, domain);
  }

  return errors(res)(404, 'Unable to verify domain');
}

async function verifyUrl(url: string, token: string): Promise<boolean> {
  try {
    const options: AxiosRequestConfig = {
      url,
      method: 'GET',
      timeout: 6000,
      withCredentials: false,
    };
    const response = await axios(options);
    const receivedToken = await response.data;
    return token === receivedToken;
  } catch (e) {
    return false;
  }
}

async function verifyDns(domain: string, token: string): Promise<boolean> {
  return new Promise<boolean>(resolve => {
    dns.resolveTxt(domain, (err, records) => {
      if (err) {
        console.error('Unable to get TXT records');
        return;
      }
      for (let i = 0; i < records.length; i++) {
        const record = records[i][0];
        if (record.indexOf('=') < 0) {
          continue;
        }
        const parts = record.split('=');
        if (parts.length > 2 || parts[0] !== 'nils') {
          continue;
        }
        if (parts[1] === token) {
          resolve(true);
          return;
        }
      }
      resolve(false);
    });
  });
}
