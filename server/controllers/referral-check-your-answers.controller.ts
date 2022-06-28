import { Response, NextFunction, Request } from 'express'
import { Form, Section } from '../forms'
import type { AllowedSectionNames } from '../forms/interfaces'

export const ReferralCheckYourAnswersController = {
  show: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const section = await Section.initialize(req.params.section as AllowedSectionNames, req, Form.sessionVarName)
    const steps = (
      await Promise.all(
        (
          await section.allSteps()
        ).map(async step => {
          return {
            title: step.title,
            rows: await step.answers(),
          }
        })
      )
    ).filter(step => step.rows.length)

    res.render('referral-application/check-answers/show', { ...section, steps })
  },

  update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const form = await Form.initialize(req)

    form.completeSection()
    res.redirect('/referral_tasklist')
  },
}
