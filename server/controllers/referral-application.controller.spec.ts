import { createMock } from '@golevelup/ts-jest'
import { Response } from 'express'

import { ReferralApplicationController } from './referral-application.controller'
import { ReferralApplication } from '../forms/referral-application.form'
import { ReferralApplicationRequest } from '../forms/interfaces'
import { OutOfSequenceError } from '../forms/errors'

jest.mock('../forms/referral-application.form')

describe('ReferralApplicationController', () => {
  const request = createMock<ReferralApplicationRequest>({})
  const response = createMock<Response>({})
  const mockForm = ReferralApplication as jest.Mock

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

      ReferralApplicationController.show(request, response)

      expect(response.render).toHaveBeenCalledWith('referral-application/some-step')
    })

    it('should render an error if the step is out of sequence', () => {
      mockForm.mockImplementation(() => {
        throw new OutOfSequenceError()
      })

      ReferralApplicationController.show(request, response)

      expect(response.render).toHaveBeenCalledWith('pages/error', { message: '' })
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
        }
      })

      await ReferralApplicationController.update(request, response)

      expect(response.redirect).toHaveBeenCalledWith('/referral-application/new/next-step')
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

      request.params = { step: 'opd-pathway' }

      await ReferralApplicationController.update(request, response)

      expect(response.render).toHaveBeenCalledWith('referral-application/opd-pathway', {
        foo: 'bar',
        errors: 'SOME_ERRORS',
      })
    })

})