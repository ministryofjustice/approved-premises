import { AllowedStepNames, Dto } from './index'

import { validate, ValidationError } from 'class-validator'

interface ErrorMessages {
  [key: string]: Array<string>
}

export default abstract class Step {
  errors: ErrorMessages
  errorLength: number

  constructor(public readonly params: any) {}

  abstract nextStep(): AllowedStepNames
  abstract dto(): Dto

  async valid(): Promise<boolean> {
    const dto = this.dto()

    await validate(dto).then(errors => {
      this.errorLength = errors.length
      this.errors = this.convertErrors(errors)
    })

    return this.errorLength === 0
  }

  private convertErrors(errorMessages: Array<ValidationError>) {
    const errors = {}

    errorMessages.forEach((err: ValidationError) => {
      Object.keys(err.constraints).forEach(key => {
        errors[err.property] = errors[err.property] || []
        errors[err.property].push(err.constraints[key])
      })
    })

    return errors
  }
}
