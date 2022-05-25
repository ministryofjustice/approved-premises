import { plainToInstance } from 'class-transformer'
import type { ReferralApplicationBody } from '../interfaces'

import EsapReasons from '../dtos/esap-reasons'

import Step from './step'

export default class EsapReasonsStep extends Step {
  nextStep() {
    if (this.params.reasons?.includes('secreting')) {
      return 'room-searches'
    }
    if (this.params.reasons?.includes('cctv')) {
      return 'cctv'
    }
    return undefined
  }

  previousStep() {
    return 'type-of-ap' as const
  }

  dto(): EsapReasons {
    return plainToInstance(EsapReasons, this.params)
  }

  allowedToAccess(sessionData: ReferralApplicationBody): boolean {
    return sessionData.type !== undefined && sessionData.type === 'esap'
  }
}
