import { Router } from 'express'
import { ReferralApplicationParams, ReferralApplicationBody } from '../forms/interfaces'

import { ReferralApplicationController } from '../controllers/referral-application.controller'

export const referralApplicationPrefix = '/referral-application'

export function ReferralApplicationRoutes(router: Router): Router {
  router.get<ReferralApplicationParams>('/:section/new/:step', ReferralApplicationController.show)
  router.post<ReferralApplicationParams, Record<string, unknown>, ReferralApplicationBody>(
    '/:section/:step',
    ReferralApplicationController.update
  )

  return router
}
