import { Step, stepList } from './steps'
import { ReferralApplicationRequest } from './interfaces'

interface ErrorMessages {
  [key: string]: Array<string>
}

export class OutOfSequenceError extends Error {}

export class ReferralApplication {
  errors: ErrorMessages
  step: Step
  stepName: string

  constructor(readonly request: ReferralApplicationRequest) {
    this.stepName = this.request.params.step
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

  persistData() {
    this.request.session.referralApplication = {
      ...this.request.session.referralApplication,
      ...this.request.body,
    }
  }

  private getStep() {
    const step = stepList[this.stepName]

    return new step(this.request.body)
  }
}
