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

type VerificationResult = [boolean, string | null];

export default async (req: Request, res: Response) => {
  const domain: string = req.params.domain;
  const token = genToken(req.user.uuid, domain);

  let verified: boolean = false,
      error: string = null;

  const errorList = [];

  // File verification
  [ verified, error ] = await verifyUrl(`http://${domain}/.well-known/nils`, token, 'HTTP');
  if (verified) {
    return processVerification(req, res, domain);
  }
  if (error) errorList.push(error);

  [ verified, error ] = await verifyUrl(`https://${domain}/.well-known/nils`, token, 'HTTPS');
  if (verified) {
    return processVerification(req, res, domain);
  }
  if (error) errorList.push(error);

  // DNS verification
  [ verified, error ] = await verifyDns(domain, token);
  if (error) errorList.push(error);

  if (verified) {
    return processVerification(req, res, domain);
  }

  return errors(res)(404, errorList || 'Unable to verify domain');
}

async function verifyUrl(url: string, token: string, type: string): Promise<VerificationResult> {
  try {
    const options: AxiosRequestConfig = {
      url,
      method: 'GET',
      timeout: 6000,
      withCredentials: false,
    };
    const response = await axios(options);
    const receivedToken = await response.data;
    if (token === receivedToken) {
      return [token === receivedToken, null ];
    } else {
      return [false, 'Found Nils file, but the token didn\'t match the expected value.' ];
    }
  } catch (e) {
    return [ false, `${type} verification failed: ${e.message}` ];
  }
}

async function verifyDns(domain: string, token: string): Promise<VerificationResult> {
  return new Promise<VerificationResult>(resolve => {
    let error: string = 'Unable to get TXT records, please verify the domain name or try again later.';
    dns.resolveTxt(domain, (err, records) => {
      if (err) {
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
          resolve([true, null]);
          return;
        } else {
          error = 'DNS Nils token was found, but didn\'t match the expected value.';
          break;
        }
      }
      console.error('Failed', error);
      resolve([false, error]);
    });
    console.error('Failed', error);
    resolve([false, error]);
  });
}
