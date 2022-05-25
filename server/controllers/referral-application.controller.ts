import { Response } from 'express'
import { OutOfSequenceError } from '../forms/errors'
import { ReferralApplication } from '../forms/referral-application.form'
import { ReferralApplicationRequest } from '../forms/interfaces'

export const ReferralApplicationController = {
  show: (req: ReferralApplicationRequest, res: Response): void => {
    try {
      const form = new ReferralApplication(req)
      res.render(`referral-application/${form.stepName}`)
    } catch (err) {
      if (err instanceof OutOfSequenceError) {
        res.status(400)
        res.render('pages/error', { message: err.message })
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
        res.redirect(`/referral-application/new/${nextStep}`)
    } else {
      res.render(`referral-application/${req.params.step}`, { ...form.step.dto(), errors: form.step.errors })
    }
  },
}
