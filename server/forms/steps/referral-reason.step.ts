import { plainToInstance } from 'class-transformer'

import ReferralReason from '../dtos/referral-reason'

import Step from './step'

export default class ReferralReasonStep extends Step {
  nextStep(): 'not-eligible' | undefined {
    return this.params.reason === 'no-reason' ? 'not-eligible' : undefined
  }

  previousStep(): undefined {
    return undefined
  }

  dto(): ReferralReason {
    return plainToInstance(ReferralReason, this.params)
  }

  allowedToAccess(): boolean {
    return true
  }
}
