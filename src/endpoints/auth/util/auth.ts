import express from "express";
import passport from "passport";

import db from '../../../db'
import { storeSession } from "./middleware";

/**
 * Check if a user exists in our db with a provider and an email
 * and creates the user if not
 * Returns the user id
 */
export const authWithProvider = async (provider: string, token: string, email: string): Promise<string> => {
  if (token === null) {
    throw new Error('Unable to login user, missing authentication token');
  }

  const hasEmail = email && email.length > 0;

  try {
    let params = [
      provider,
      token,
    ];
    let data = await db.query('SELECT user_id FROM user_logins WHERE auth_provider = $1 AND token = $2', params);
    if (data.rows.length > 0) {
      console.log('found user in logins table', data.rows);
      return data.rows[0].user_id;
    }
  
    // no login exists for this user, check by email
    if (hasEmail) {
      params = [email];
      data = await db.query('SELECT user_id FROM user_email WHERE email = $1', params);
      if (data.rows.length > 0) {
        console.log('found user in emails table', data.rows);
        const user_id = data.rows[0].user_id;
        // Insert a new entry in the logins table for this provider
        params = [
          user_id,
          provider,
          token,
        ];
        await db.query('INSERT INTO user_logins(user_id, auth_provider, token) VALUES ($1, $2, $3)', params);
        return user_id;
      }
    }
  
    console.log('user not found in any table, adding to all');
  
    // user does not exist, insert in all three places
    data = await db.query('INSERT INTO users(balance) VALUES(0) RETURNING *');
    const user_id = data.rows[0].uuid;
  
    params = [
      user_id,
      provider,
      token,
    ];
    await db.query('INSERT INTO user_logins(user_id, auth_provider, token) VALUES ($1, $2, $3)', params);
  
    if (hasEmail) {
      params = [
        user_id,
        email,
      ];
      await db.query('INSERT INTO user_email(user_id, email) VALUES ($1, $2)', params);
    }
  
    return user_id;
  } catch (e) {
    console.error('Unable to check login status for user', e);
    throw new Error('Unable to login user');
  }
}

export const demoAuth = async () => {
  const demoProvider = 'demo';
  const demoToken = 'demo';
  const params = [demoProvider, demoToken];

  let data = await db.query('SELECT user_id FROM user_logins WHERE auth_provider = $1 AND token = $2', params);

  if (data.rows.length > 0) {
    console.log('found demo user in logins table', data.rows);
    return data.rows[0].user_id;
  }

  // Create demo user
  data = await db.query('INSERT INTO users(balance) VALUES(0) RETURNING *');
  const user_id = data.rows[0].uuid;

  const createParams = [
    user_id,
    demoProvider,
    demoToken,
  ];
  await db.query('INSERT INTO user_logins(user_id, auth_provider, token) VALUES ($1, $2, $3)', createParams);

  console.log('Created new demo user', user_id);
  return user_id;
};

export const setupRoutes = (router: express.Router, provider: string, scope: string[]) => {
  router.get('/', (req, res, next) => {
    const { returnTo } = req.query
    const state = returnTo
      ? Buffer.from(JSON.stringify({ returnTo })).toString('base64')
      : undefined

    passport.authenticate(provider, { scope, state })(req, res, next)
  })
  
  router.get(
    "/callback",
    passport.authenticate(provider, { failureRedirect: "/" }),
    storeSession,
  );
};
