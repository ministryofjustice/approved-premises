import { createMock } from '@golevelup/ts-jest'
import { ReferralApplicationRequest } from './interfaces'

import Step from './steps/step'

import { OutOfSequenceError } from './errors'
import { ReferralApplication } from './referral-application.form'

jest.mock('./steps/index', () => {
  return {
    stepList: {
      'referral-reason': jest.fn().mockImplementation(() => {
        return createMock<Step>({
          errorLength: 2,
          errors: {
            foo: ['bar'],
          },
          valid: async () => true,
          previousStep: () => 'type-of-ap',
          nextStep: () => 'referral-reason',
          allowedToAccess: () => true,
        })
      }),
      'type-of-ap': jest.fn().mockImplementation(() => {
        return createMock<Step>({
          allowedToAccess: () => false,
        })
      }),
    },
  }
})

describe('ReferralApplicationForm', () => {
  it('returns the correct return values from the step', async () => {
    const request = createMock<ReferralApplicationRequest>({
      params: {
        step: 'referral-reason',
      },
      body: {},
    })
    const application = new ReferralApplication(request)

    const valid = await application.validForCurrentStep()
    const nextStep = application.nextStep()
    const errorLength = application.errorLength()
    const { stepName } = application

    expect(valid).toBe(true)
    expect(nextStep).toEqual('referral-reason')
    expect(errorLength).toEqual(2)
    expect(stepName).toEqual('referral-reason')

    expect(application.step.errorLength).toEqual(2)
    expect(application.step.errors).toEqual({
      foo: ['bar'],
    })
  })

  it('raises an error if the step is not allowed', () => {
    const request = createMock<ReferralApplicationRequest>({
      params: {
        step: 'type-of-ap',
      },
      body: {},
    })

    expect(() => new ReferralApplication(request)).toThrowError(OutOfSequenceError)
  })

  describe('persistData', () => {
    it('persists data in the session', () => {
      const request = createMock<ReferralApplicationRequest>({
        params: {
          step: 'referral-reason',
        },
        body: { type: 'standard' },
        session: {
          referralApplication: {
            reason: 'likely',
          },
        },
      })

      const application = new ReferralApplication(request)

      application.persistData()

      expect(application.request.session.referralApplication).toEqual({ type: 'standard', reason: 'likely' })
    })

    it('overwrites old data already persisted in the session', () => {
      const request = createMock<ReferralApplicationRequest>({
        params: {
          step: 'referral-reason',
        },
        body: { type: 'pipe' },
        session: {
          referralApplication: {
            type: 'standard',
          },
        },
      })

      const application = new ReferralApplication(request)

      application.persistData()

      expect(application.request.session.referralApplication).toEqual({ type: 'pipe' })
    })
  })

  describe('completeSection', () => {
    it('marks a section as complete in the session', () => {
      const request = createMock<ReferralApplicationRequest>({
        params: {
          step: 'referral-reason',
          section: 'confirm-need',
        },
        session: {
          referralApplication: {
            reason: 'likely',
          },
        },
      })

      const application = new ReferralApplication(request)

      application.completeSection()

      expect(application.request.session.referralApplication).toEqual({
        reason: 'likely',
        sections: { 'confirm-need': { complete: true } },
      })
    })

    it('adds a section to existing sections', () => {
      const request = createMock<ReferralApplicationRequest>({
        params: {
          step: 'referral-reason',
          section: 'confirm-need',
        },
        session: {
          referralApplication: {
            reason: 'likely',
            sections: {
              other: { complete: true },
            },
          },
        },
      })

      const application = new ReferralApplication(request)

      application.completeSection()

      expect(application.request.session.referralApplication).toEqual({
        reason: 'likely',
        sections: { 'confirm-need': { complete: true }, other: { complete: true } },
      })
    })
  })
})
