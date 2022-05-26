import { Step, stepList } from './steps'
import { ReferralApplicationRequest } from './interfaces'
import { OutOfSequenceError, UnknownStepError } from './errors'

interface ErrorMessages {
  [key: string]: Array<string>
}

export const sessionVarName = 'referralApplication'

export class ReferralApplication {
  static sessionVarName = sessionVarName

  errors: ErrorMessages

  step: Step

  stepName: string

  sectionName: string

  sessionData = this.request.session[ReferralApplication.sessionVarName]

  constructor(readonly request: ReferralApplicationRequest) {
    this.stepName = this.request.params.step
    this.sectionName = this.request.params.section
    this.step = this.getStep()

    if (this.step.allowedToAccess() === false) {
      throw new OutOfSequenceError()
    }

    if (this.step.section !== this.sectionName) {
      throw new UnknownStepError()
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
    this.setSectionStatus('complete')
  }

  persistData() {
    this.request.session[ReferralApplication.sessionVarName] = {
      ...this.request.session[ReferralApplication.sessionVarName],
      ...this.request.body,
    }
  }

  private getStep() {
    try {
      const CurrentStep = stepList[this.stepName]

      return new CurrentStep(this)
    } catch (err) {
      throw new UnknownStepError()
    }
  }

  private setSectionStatus(status: string) {
    let sections = this.request.session[ReferralApplication.sessionVarName].sections || {}

    sections = {
      ...sections,
      [this.request.params.section]: { status },
    }

    this.request.session[ReferralApplication.sessionVarName] = {
      ...this.request.session[ReferralApplication.sessionVarName],
      sections,
    }
  }
}
