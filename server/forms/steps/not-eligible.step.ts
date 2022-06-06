import Step from './step'
import Question from '../question'

export default class NotEligibleStep extends Step {
  section = 'eligibility' as const

  title = 'Robert Brown is not eligible for an AP placement'

  partial = 'not-eligible'

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
    return this.sessionData.referralReason !== undefined
  }

  async valid() {
    return true
  }

  questions() {
    return [] as Array<Question>
  }
}
