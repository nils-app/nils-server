import request from 'supertest'
import jwt from 'jsonwebtoken';

import app from '../../../src/app'
import db from '../../../src/db'
import { JWT_PAYLOAD } from '../../../src/middleware/auth';
import { JWT_EXPIRATION_MS, JWT_SECRET } from '../../../src/constants';

const agent = request.agent(app);

describe('POST /users/pay', () => {
  it('Fails with no auth cookie', () => {
    return agent
      .post('/users/pay')
      .expect(401)
  })
  
  // TODO Find a way to test without requiring a DB
  // it('Fails with no CSRF cookie', async () => {
  //   // get a user for testing
  //   const data = await db.query('SELECT uuid FROM users LIMIT 1');
  //   const uuid = data.rows[0].uuid;

  //   const payload: JWT_PAYLOAD = {
  //     uuid,
  //     expires: Date.now() + parseInt(JWT_EXPIRATION_MS, 10),
  //   };
  
  //   const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
    
  //   return agent
  //     .post('/users/pay')
  //     .set('Cookie', [`jwt="${token}";`])
  //     .send()
  //     .expect(401)
  // })
})
