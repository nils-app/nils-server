import Router from 'express-promise-router'

import list from './list'
import addRecipient from './addRecipient'

export const router = Router()
export default router

router.get('/', list)
router.post('/', addRecipient)
