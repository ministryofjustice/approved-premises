import { createMock } from '@golevelup/ts-jest'
import { Response } from 'express'
import createError from 'http-errors'

import { ReferralApplicationController } from './referral-application.controller'
import { ReferralApplication } from '../forms/referral-application.form'
import { ReferralApplicationRequest } from '../forms/interfaces'
import { OutOfSequenceError, UnknownStepError } from '../forms/errors'

jest.mock('../forms/referral-application.form')
jest.mock('http-errors')

describe('ReferralApplicationController', () => {
  const request = createMock<ReferralApplicationRequest>({})
  const response = createMock<Response>({})
  const next = jest.fn()
  const mockForm = ReferralApplication as unknown as jest.Mock
  const mockCreateError = createError

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('show', () => {
    it('should render a step', () => {
      mockForm.mockImplementation(() => {
        return {
          stepName: 'some-step',
        }
      })

      ReferralApplicationController.show(request, response, next)

      expect(response.render).toHaveBeenCalledWith('referral-application/some-step')
    })

    it('should render an error if the step is out of sequence', () => {
      mockForm.mockImplementation(() => {
        throw new OutOfSequenceError()
      })

      ReferralApplicationController.show(request, response, next)

      expect(response.render).toHaveBeenCalledWith('pages/error', { message: '' })
    })

    it('should return a 404 if the step is not found', () => {
      mockForm.mockImplementation(() => {
        throw new UnknownStepError()
      })

      ReferralApplicationController.show(request, response, next)

      expect(next).toHaveBeenCalledWith(mockCreateError(404, 'Not found'))
    })
  })

  describe('update', () => {
    it('should persist the data and render the next step if valid', async () => {
      const persistDataSpy = jest.fn()

      mockForm.mockImplementation(() => {
        return {
          validForCurrentStep: async () => true,
          nextStep: () => 'next-step',
          persistData: () => persistDataSpy(),
          sectionName: 'eligibility',
        }
      })

      await ReferralApplicationController.update(request, response)

      expect(response.redirect).toHaveBeenCalledWith('/referral-application/eligibility/new/next-step')
      expect(persistDataSpy).toHaveBeenCalled()
    })

    it('should render an error page if invalid', async () => {
      const persistDataSpy = jest.fn()

      mockForm.mockImplementation(() => {
        return {
          validForCurrentStep: async () => false,
          persistData: () => persistDataSpy(),
          nextStep: () => 'next-step',
          step: {
            errors: 'SOME_ERRORS',
            dto: () => {
              return {
                foo: 'bar',
              }
            },
          },
        }
      })

      request.params = { step: 'opd-pathway', section: 'eligibility' }

      await ReferralApplicationController.update(request, response)

      expect(response.render).toHaveBeenCalledWith('referral-application/opd-pathway', {
        foo: 'bar',
        errors: 'SOME_ERRORS',
      })
    })

    it('should persist and complete the form and redirect to the tasklist if valid and there is no next step', async () => {
      const persistDataSpy = jest.fn()
      const completeSpy = jest.fn()

      mockForm.mockImplementation(() => {
        return {
          validForCurrentStep: async () => true,
          nextStep: (): undefined => undefined,
          persistData: () => persistDataSpy(),
          completeSection: () => completeSpy(),
        }
      })

      await ReferralApplicationController.update(request, response)

      expect(response.redirect).toHaveBeenCalledWith('/referral_tasklist')
      expect(persistDataSpy).toHaveBeenCalled()
      expect(completeSpy).toHaveBeenCalled()
    })
  })
})
