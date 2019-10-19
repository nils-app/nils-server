import Router from 'express-promise-router'

import verify from './verify'
import initVerification from './initVerification'

export const router = Router()
export default router

router.post('/verify/:domain', verify)
router.get('/verify/:domain', initVerification)
