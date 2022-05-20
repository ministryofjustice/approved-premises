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
    const application = new ReferralApplication('referral-reason', {})

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
})
