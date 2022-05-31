import { plainToInstance } from 'class-transformer'

import ReferralReason from '../dtos/referral-reason'

import Step from './step'

export default class ReferralReasonStep extends Step {
  section = 'eligibility' as const

  title = 'What is the reason for the referral?'

  nextStep(): 'not-eligible' | undefined {
    return this.body.reason === 'no-reason' ? 'not-eligible' : undefined
  }

  previousStep(): undefined {
    return undefined
  }

  dto(): ReferralReason {
    return plainToInstance(ReferralReason, this.body)
  }

  allowedToAccess(): boolean {
    return true
  }
}
