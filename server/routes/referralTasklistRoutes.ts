import { Router } from 'express'

import { get } from './index'

import { ReferralApplication } from '../forms/referral-application.form'
import { formIsComplete } from '../forms/utils/form-is-complete'

export const referralTasklistUrlPrefix = '/referral_tasklist'

export default function ReferralTasklistRoutes(router: Router): Router {
  get(router, '/', async (req, res, next) => {
    const risks = {
      risks: {
        mappa: {
          level: 'CAT 2/LEVEL 1',
          isNominal: false,
          lastUpdated: '10th October 2021',
        },
        flags: ['Hate Crime'],
        roshRiskSummary: {
          overallRisk: 'VERY_HIGH',
          riskToChildren: 'LOW',
          riskToPublic: 'VERY_HIGH',
          riskToKnownAdult: 'MEDIUM',
          riskToStaff: 'HIGH',
          lastUpdated: '10th October 2021',
        },
      },
    }

    const referralApplicationIsComplete = formIsComplete(req, ReferralApplication)

    res.render('referral_tasklist/tasklist', { risks, referralApplicationIsComplete })
  })

  return router
}
