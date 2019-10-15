import Router from 'express-promise-router'

import balance from './balance'
import block from './block'
import pay from './pay'
import unblock from './unblock'
import current from './current'

export const router = Router()
export default router

router.get('/balance', balance)
router.put('/block', block)
router.post('/pay', pay)
router.put('/unblock', unblock)
router.get('/current', current)
