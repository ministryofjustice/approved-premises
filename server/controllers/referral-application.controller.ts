import { Response, NextFunction } from 'express'
import createError from 'http-errors'

import { OutOfSequenceError, UnknownStepError } from '../forms/errors'
import { ReferralApplication } from '../forms/referral-application.form'
import { ReferralApplicationRequest } from '../forms/interfaces'

export const ReferralApplicationController = {
  show: (req: ReferralApplicationRequest, res: Response, next: NextFunction): void => {
    try {
      const form = new ReferralApplication(req)
      res.render(`referral-application/${form.stepName}`)
    } catch (err) {
      if (err instanceof OutOfSequenceError) {
        res.status(400)
        res.render('pages/error', { message: err.message })
      } else if (err instanceof UnknownStepError) {
        next(createError(404, 'Not found'))
      } else {
        throw err
      }
    }
  },

  update: async (req: ReferralApplicationRequest, res: Response): Promise<void> => {
    const form = new ReferralApplication(req)
    const valid = await form.validForCurrentStep()
    const nextStep = form.nextStep()

    if (valid) {
      form.persistData()
      if (nextStep) {
        res.redirect(`/referral-application/${form.sectionName}/new/${nextStep}`)
      } else {
        form.completeSection()
        res.redirect('/referral_tasklist')
      }
    } else {
      res.render(`referral-application/${req.params.step}`, { ...form.step.dto(), errors: form.step.errors })
    }
  },
}
