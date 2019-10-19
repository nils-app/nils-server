import { Response, Request } from 'express'
import axios, { AxiosRequestConfig } from 'axios';
import dns from 'dns';

import { genToken } from './util/token';
import errors from '../auth/lib/error';

export default async (req: Request, res: Response) => {
  const domain: string = req.params.domain;
  const token = genToken(domain);

  let verified: boolean = false;

  // File verification
  verified = await verifyUrl(`http://${domain}/nils.html`, token);
  if (verified) {
    return res.status(204).send();
  }

  verified = await verifyUrl(`https://${domain}/nils.html`, token);
  if (verified) {
    return res.status(204).send();
  }

  // DNS verification
  verified = await verifyDns(domain, token);
  if (verified) {
    return res.status(204).send();
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
