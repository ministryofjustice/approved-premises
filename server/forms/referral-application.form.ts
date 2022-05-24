import { Step, stepList } from './steps'
import { ReferralApplicationRequest } from './interfaces'
import { OutOfSequenceError } from './errors'

interface ErrorMessages {
  [key: string]: Array<string>
}
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

  complete() {
    this.request.session.referralApplication = {
      ...this.request.session.referralApplication,
      complete: true,
    }
  }

  persistData() {
    this.request.session.referralApplication = {
      ...this.request.session.referralApplication,
      ...this.request.body,
    }
  }

  private getStep() {
    const CurrentStep = stepList[this.stepName]

    return new CurrentStep(this.request.body)
  }
}
