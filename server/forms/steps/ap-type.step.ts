import { plainToInstance } from 'class-transformer'

import ApType from '../dtos/ap-type'

import Step from './step'

export default class ApTypeStep extends Step {
  nextStep() {
    return {
      standard: undefined,
      pipe: 'opd-pathway' as const,
      esap: 'esap-reasons' as const,
    }[this.body.type]
  }

  previousStep() {
    return 'referral-reason' as const
  }

  dto(): ApType {
    return plainToInstance(ApType, this.body)
  }

  allowedToAccess(): boolean {
    return this.sessionData.reason !== undefined
  }
}
