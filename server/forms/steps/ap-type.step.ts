import { plainToInstance } from 'class-transformer'
import type { ReferralApplicationBody } from '../interfaces'

import ApType from '../dtos/ap-type'

import Step from './step'

export default class ApTypeStep extends Step {
  nextStep() {
    return {
      standard: 'enhanced-risk',
      pipe: 'opd-pathway',
      esap: 'esap-reasons',
    }[this.params.type]
  }

  previousStep() {
    return 'referral-reason' as const
  }

  dto(): ApType {
    return plainToInstance(ApType, this.params)
  }

  allowedToAccess(sessionData: ReferralApplicationBody): boolean {
    return sessionData.reason !== undefined
  }
}
