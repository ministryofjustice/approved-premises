import { Step, stepList, AllowedStepNames } from './steps'

interface ErrorMessages {
  [key: string]: Array<string>
}

export class ReferralApplication {
  errors: ErrorMessages
  step: Step

  constructor(private readonly stepName: AllowedStepNames, private readonly params: any) {
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

  private getStep() {
    const step = stepList[this.stepName]

    return new step(this.params)
  }
}
