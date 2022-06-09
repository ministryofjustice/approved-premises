import { Router } from 'express'

import { get } from './index'

import { ReferralTasklistController } from '../controllers/referral-tasklist.controller'

export const referralTasklistUrlPrefix = '/referral_tasklist'

export default function ReferralTasklistRoutes(router: Router): Router {
  get(router, '/', ReferralTasklistController.index)

  return router
}
