import Router from 'express-promise-router'

import verify from './verify'
import initVerification from './initVerification'
import deleteDomain from './delete'

export const router = Router()
export default router

router.post('/verify/:domain', verify)
router.get('/verify/:domain', initVerification)
router.delete('/:uuid', deleteDomain)
