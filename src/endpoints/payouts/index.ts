import Router from 'express-promise-router'

import list from './list'
import addRecipient from './addRecipient'
import send from './send'
import query from './query'

export const router = Router()
export default router

router.get('/', list)
router.get('/:tx_id', query)
router.put('/', addRecipient)
router.post('/', send)
