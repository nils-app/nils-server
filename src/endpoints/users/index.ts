import Router from 'express-promise-router'

import balance from './balance'
import block from './block'
import pay from './pay'
import unblock from './unblock'
import current from './current'
import logout from './logout'
import transactions from './transactions'
import topup from './topup'

export const router = Router()
export default router

router.get('/balance', balance)
router.put('/block', block)
router.post('/pay', ...pay)
router.put('/unblock', unblock)
router.get('/current', current)
router.get('/transactions', transactions)
router.get('/topup', topup)
router.get('/logout', logout)
