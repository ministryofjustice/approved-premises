import { Response, NextFunction, Request } from 'express'
import createError from 'http-errors'

import { OutOfSequenceError, UnknownStepError } from '../forms/errors'
import Form from '../forms/form'

const getQuestions = async (form: Form): Promise<Array<string>> => {
  return Promise.all(form.step.questions().map(question => question.present()))
}

export const ReferralApplicationController = {
  show: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const form = await Form.initialize(req)
      const questions = await getQuestions(form)
      res.render(`referral-application/show`, { ...form, questions })
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

  update: async (req: Request, res: Response): Promise<void> => {
    const form = await Form.initialize(req)

    const valid = form.validForCurrentStep()

    if (valid) {
      form.persistData()
      const nextStep = form.nextStep()

      if (nextStep) {
        res.redirect(`/referral-application/${form.step.section}/new/${nextStep}`)
      } else {
        form.completeSection()
        res.redirect('/referral_tasklist')
      }
    } else {
      const questions = await getQuestions(form)

      res.render(`referral-application/show`, { ...form, questions })
    }
  },
}
