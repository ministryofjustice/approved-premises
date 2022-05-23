import { plainToInstance } from 'class-transformer'
import { ReferralApplicationBody } from '../interfaces'

import ApType from '../dtos/ap-type'

import Step from './step'

export default class ApTypeStep extends Step {
  nextStep() {
    switch (this.params.type) {
      case 'standard':
        return 'enhanced-risk'
      case 'pipe':
        return 'opd-pathway'
      case 'esap':
        return 'esap-reasons'
    }
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
