import express from 'express'

import google from './google'
import github from './github'

export const router = express.Router()
export default router

router.use('/google', google)
router.use('/github', github)
