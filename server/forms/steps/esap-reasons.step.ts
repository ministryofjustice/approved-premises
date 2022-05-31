import { plainToInstance } from 'class-transformer'

import EsapReasons from '../dtos/esap-reasons'

import Step from './step'

export default class EsapReasonsStep extends Step {
  section = 'ap-type' as const

  title = 'Reasons Robert requires an enhanced security (ESAP) placement'

  showTitle = true

  nextStep() {
    if (this.body.reasons?.includes('secreting')) {
      return 'room-searches'
    }
    if (this.body.reasons?.includes('cctv')) {
      return 'cctv'
    }
    return undefined
  }

  previousStep() {
    return 'type-of-ap' as const
  }

  dto(): EsapReasons {
    return plainToInstance(EsapReasons, this.body)
  }

  allowedToAccess(): boolean {
    return this.sessionData.type !== undefined && this.sessionData.type === 'esap'
  }
}
