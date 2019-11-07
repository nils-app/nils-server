import Router from 'express-promise-router'

import list from './list'
import addRecipient from './addRecipient'
import send from './send'
import query from './query'
import info from './info'

export const router = Router()
export default router

router.get('/', list)
router.get('/info', info)
router.put('/', addRecipient)
router.post('/', send)
router.get('/:tx_id', query)
