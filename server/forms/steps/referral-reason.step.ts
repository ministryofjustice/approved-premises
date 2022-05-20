import { plainToInstance } from 'class-transformer'

import ReferralReason from '../dtos/referral-reason'

import Step from './step'

export default class ReferralReasonStep extends Step {
  nextStep() {
    return this.params.reason === 'no-reason' ? 'not-eligible' : 'type-of-ap'
  }

  dto(): ReferralReason {
    return plainToInstance(ReferralReason, this.params)
  }
}
