import Step from './step'

export default class NotEligibleStep extends Step {
  section = 'eligibility' as const

  title = 'Robert Brown is not eligible for an AP placement'

  showTitle = true

  nextStep(): undefined {
    return undefined
  }

  previousStep() {
    return 'referral-reason' as const
  }

  dto(): undefined {
    return undefined
  }

  allowedToAccess(): boolean {
    return this.sessionData.reason !== undefined
  }

  async valid() {
    return true
  }
}
