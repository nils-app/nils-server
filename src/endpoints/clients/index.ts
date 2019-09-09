import express from "express";

import login from './login';

export const router = express.Router();
export default router;

router.post('/login', login);