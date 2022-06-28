import { Request, Response, NextFunction } from 'express'

import { Section, Form } from '../forms'

export const ReferralTasklistController = {
  index: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const risks = {
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
    }

    const sections = await Promise.all([
      await Section.initialize('eligibility', req, Form.sessionVarName),
      await Section.initialize('ap-type', req, Form.sessionVarName),
      await Section.initialize('confirm-ap-need', req, Form.sessionVarName),
    ])

    const eligibilityStatus = await sections[0].status()
    const apTypeStatus = await sections[1].status()
    const confirmApNeed = await sections[1].status()

    res.render('referral_tasklist/tasklist', { risks, eligibilityStatus, apTypeStatus, confirmApNeed })
  },
}
