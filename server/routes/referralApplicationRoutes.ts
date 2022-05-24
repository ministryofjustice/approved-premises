import { Router } from 'express'
import { OutOfSequenceError } from '../forms/errors'
import { ReferralApplication } from '../forms/referral-application.form'
import { ReferralApplicationParams, ReferralApplicationBody } from '../forms/interfaces'

export const referralApplicationPrefix = '/referral-application'

export function ReferralApplicationRoutes(router: Router): Router {
  router.get<ReferralApplicationParams>('/new/:step', (req, res, next) => {
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
  })

  router.post<ReferralApplicationParams, Record<string, unknown>, ReferralApplicationBody>(
    '/:step',
    async (req, res, next) => {
      const form = new ReferralApplication(req)
      const valid = await form.validForCurrentStep()

      if (valid) {
        form.persistData()
        res.redirect(`${referralApplicationPrefix}/new/${form.nextStep()}`)
      } else {
        res.render(`referral-application/${req.params.step}`, { ...form.step.dto(), errors: form.step.errors })
      }
    }
  )

  return router
}
