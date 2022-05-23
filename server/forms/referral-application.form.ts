import { Step, stepList } from './steps'
import { ReferralApplicationRequest } from './interfaces'

interface ErrorMessages {
  [key: string]: Array<string>
}

export class ReferralApplication {
  errors: ErrorMessages
  step: Step

  constructor(readonly request: ReferralApplicationRequest) {
    this.step = this.getStep()
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
    const step = stepList[this.request.params.step]

    return new step(this.request.body)
  }
}
