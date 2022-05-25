import { plainToInstance } from 'class-transformer'

import CCTV from '../dtos/cctv'

import Step from './step'

export default class CCTVStep extends Step {
  nextStep(): undefined {
    return undefined
  }

  previousStep() {
    if (this.sessionData.reasons?.includes('secreting')) {
      return 'room-searches' as const
    }
    return 'esap-reasons' as const
  }

  dto(): CCTV {
    return plainToInstance(CCTV, this.body)
  }

  allowedToAccess(): boolean {
    return this.sessionData?.reasons?.includes('cctv') || false
  }
}
