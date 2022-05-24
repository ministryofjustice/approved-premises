import { Step, stepList } from './steps'
import { ReferralApplicationRequest } from './interfaces'
import { OutOfSequenceError } from './errors'

interface ErrorMessages {
  [key: string]: Array<string>
}
export class ReferralApplication {
  static sessionVarName = 'referralApplication'

  errors: ErrorMessages

  step: Step

  stepName: string

  sectionName: string

  constructor(readonly request: ReferralApplicationRequest) {
    this.stepName = this.request.params.step
    this.sectionName = this.request.params.section
    this.step = this.getStep()

    if (this.step.allowedToAccess(this.request.session.referralApplication || {}) === false) {
      throw new OutOfSequenceError()
    }
  }

  async validForCurrentStep(): Promise<boolean> {
    return this.step.valid()
  }

  errorLength(): number {
    return this.step.errorLength
  }

  nextStep() {
    return this.step.nextStep()
  }

  completeSection() {
    let sections = this.request.session[ReferralApplication.sessionVarName].sections || {}

    sections = {
      ...sections,
      [this.request.params.section]: { complete: true },
    }

    this.request.session[ReferralApplication.sessionVarName] = {
      ...this.request.session[ReferralApplication.sessionVarName],
      sections,
    }
  }

  persistData() {
    this.request.session[ReferralApplication.sessionVarName] = {
      ...this.request.session[ReferralApplication.sessionVarName],
      ...this.request.body,
    }
  }

  private getStep() {
    const CurrentStep = stepList[this.stepName]

    return new CurrentStep(this.request.body)
  }
}
