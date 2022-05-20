import { Request } from 'express'

import { Step, stepList, AllowedStepNames } from './steps'

interface ErrorMessages {
  [key: string]: Array<string>
}

export class ReferralApplication {
  errors: ErrorMessages
  step: Step

  constructor(private readonly stepName: AllowedStepNames, private readonly params: any, readonly request: Request) {
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
      ...this.step.params,
    }
  }

  private getStep() {
    const step = stepList[this.stepName]

    return new step(this.params)
  }
}
