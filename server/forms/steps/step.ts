import { validate, ValidationError } from 'class-validator'

import type { ReferralApplicationBody } from '../interfaces'
import type { AllowedStepNames, AllowedSectionNames, Dto } from './index'
import type { ReferralApplication } from '../referral-application.form'

interface ErrorMessages {
  [key: string]: Array<string>
}

export default abstract class Step {
  errors: ErrorMessages

  errorLength: number

  sessionData: ReferralApplicationBody

  body: any

  constructor(public readonly form: ReferralApplication) {
    this.sessionData = form.sessionData
    this.body = form.request.body
  }

  abstract section: AllowedSectionNames

  abstract nextStep(): AllowedStepNames | undefined

  abstract previousStep(): AllowedStepNames

  abstract dto(): Dto

  abstract allowedToAccess(): boolean

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
