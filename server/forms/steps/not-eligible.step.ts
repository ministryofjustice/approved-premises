import type { ReferralApplicationBody } from '../interfaces'

import Step from './step'

export default class NotEligibleStep extends Step {
  nextStep(): undefined {
    return undefined
  }

  previousStep() {
    return 'referral-reason' as const
  }

  dto(): undefined {
    return undefined
  }

  allowedToAccess(sessionData: ReferralApplicationBody): boolean {
    return sessionData.reason !== undefined
  }

  async valid() {
    return true
  }
}
