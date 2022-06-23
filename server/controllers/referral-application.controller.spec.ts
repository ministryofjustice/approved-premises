import { createMock } from '@golevelup/ts-jest'
import { Response } from 'express'
import createError from 'http-errors'

import { ReferralApplicationController } from './referral-application.controller'
import { ReferralApplicationRequest } from '../forms/interfaces'
import { OutOfSequenceError, UnknownStepError } from '../forms/errors'

import { Form, Question, Step } from '../forms'

jest.mock('../forms/form')
jest.mock('http-errors')

describe('ReferralApplicationController', () => {
  const request = createMock<ReferralApplicationRequest>({})
  const response = createMock<Response>({})
  const next = jest.fn()
  const mockCreateError = createError

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('show', () => {
    it('should render a step', async () => {
      const questions = createMock<Question>({
        present: async () => 'QUESTION_HTML',
      })
      const form = createMock<Form>({
        step: createMock<Step>({
          questions: async () => [questions],
        }),
      })

      jest.spyOn(Form, 'initialize').mockResolvedValue(form)

      await ReferralApplicationController.show(request, response, next)

      expect(response.render).toHaveBeenCalledWith('referral-application/show', {
        questions: ['QUESTION_HTML'],
        ...form,
      })
    })

    it('should render an error if the step is out of sequence', async () => {
      jest.spyOn(Form, 'initialize').mockImplementation(() => {
        throw new OutOfSequenceError()
      })

      await ReferralApplicationController.show(request, response, next)

      expect(response.render).toHaveBeenCalledWith('pages/error', { message: '' })
    })

    it('should return a 404 if the step is not found', async () => {
      jest.spyOn(Form, 'initialize').mockImplementation(() => {
        throw new UnknownStepError()
      })

      await ReferralApplicationController.show(request, response, next)

      expect(next).toHaveBeenCalledWith(mockCreateError(404, 'Not found'))
    })
  })

  describe('update', () => {
    it('should persist the data and render the next step if valid', async () => {
      const persistDataSpy = jest.fn()

      jest.spyOn(Form, 'initialize').mockResolvedValue(
        createMock<Form>({
          validForCurrentStep: () => true,
          nextStep: () => 'next-step',
          persistData: () => persistDataSpy(),
          step: createMock<Step>({
            section: 'eligibility',
          }),
        })
      )

      await ReferralApplicationController.update(request, response)

      expect(response.redirect).toHaveBeenCalledWith('/referral-application/eligibility/new/next-step')
      expect(persistDataSpy).toHaveBeenCalled()
    })

    it('should render an error page if invalid', async () => {
      const persistDataSpy = jest.fn()
      const questions = createMock<Question>({
        present: async () => 'QUESTION_HTML',
      })
      const form = createMock<Form>({
        validForCurrentStep: () => false,
        persistData: () => persistDataSpy(),
        nextStep: () => 'next-step',
        step: {
          errorMessages: 'SOME_ERRORS' as any,
          questions: () => [questions],
        },
      })

      jest.spyOn(Form, 'initialize').mockResolvedValue(form)

      request.params = { step: 'opd-pathway', section: 'eligibility' }

      await ReferralApplicationController.update(request, response)

      expect(response.render).toHaveBeenCalledWith('referral-application/show', {
        ...form,
        questions: ['QUESTION_HTML'],
      })
    })

    it('should persist and complete the form and redirect to the tasklist if valid and there is no next step', async () => {
      const persistDataSpy = jest.fn()
      const completeSpy = jest.fn()

      const form = createMock<Form>({
        validForCurrentStep: () => true,
        nextStep: (): undefined => undefined,
        persistData: () => persistDataSpy(),
        completeSection: () => completeSpy(),
      })

      jest.spyOn(Form, 'initialize').mockResolvedValue(form)

      await ReferralApplicationController.update(request, response)

      expect(response.redirect).toHaveBeenCalledWith('/referral_tasklist')
      expect(persistDataSpy).toHaveBeenCalled()
      expect(completeSpy).toHaveBeenCalled()
    })
  })
})
