import { createMock } from '@golevelup/ts-jest'
import { ReferralApplicationRequest } from './interfaces'

import Dto from './dtos/dto'
import Step from './steps/step'

class MockStep extends Step {
  constructor(public readonly params: any) {
    super(params)
    this.errorLength = 2
    this.errors = {
      foo: ['bar'],
    }
  }

  async valid() {
    return true
  }

  previousStep() {
    return 'type-of-ap' as const
  }

  nextStep() {
    return 'referral-reason' as const
  }

  dto() {
    return Dto
  }
}

jest.mock('./steps/index', () => {
  return {
    stepList: {
      'referral-reason': MockStep,
    },
  }
})

import { ReferralApplication } from './referral-application.form'

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

    expect(valid).toBe(true)
    expect(nextStep).toEqual('referral-reason')
    expect(errorLength).toEqual(2)

    expect(application.step.errorLength).toEqual(2)
    expect(application.step.errors).toEqual({
      foo: ['bar'],
    })
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
})
