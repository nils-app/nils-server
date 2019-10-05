import express from "express";

import google from './google';

export const router = express.Router();
export default router;

router.use('/google', google);