import { plainToClass } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'

import ReferralReason from '../common/dto/referral-reason'
import ApType from '../common/dto/ap-type'

type ALLOWED_STEPS = 'referral-reason' | 'type-of-ap'
type ALLOWED_DTOS = ReferralReason | ApType

interface ErrorMessages {
  [key: string]: Array<string>
}

export class ReferralApplication {
  errors: ErrorMessages
  steps: {}

  constructor(private readonly step: ALLOWED_STEPS, private readonly params: any) {}

  async validForCurrentStep(): Promise<boolean> {
    const dto = this.dtoForStep()

    await validate(dto).then(errors => {
      this.errors = this.convertErrors(errors)
    })

    return this.errorLength() === 0
  }

  errorLength(): number {
    return Object.keys(this.errors).length
  }

  nextStep(): ALLOWED_STEPS {
    return {
      'referral-reason': () => (this.params.reason === 'no-reason' ? 'not-eligible' : 'type-of-ap'),
    }[this.step]()
  }

  private dtoForStep(): ALLOWED_DTOS {
    return {
      'referral-reason': plainToClass(ReferralReason, this.params),
      'type-of-ap': plainToClass(ApType, this.params),
    }[this.step]
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
