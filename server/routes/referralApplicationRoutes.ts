import { Router } from 'express'

import { get } from './index'

export const referralApplicationUrlPrefix = '/referral_application'

export default function ReferralApplicationRoutes(router: Router): Router {
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
    res.render('referral_application/tasklist', risks)
  })

  return router
}
