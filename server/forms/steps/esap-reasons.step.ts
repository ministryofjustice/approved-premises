import { plainToInstance } from 'class-transformer'

import EsapReasons from '../dtos/esap-reasons'

import Step from './step'
import Question from '../question'

export default class EsapReasonsStep extends Step {
  section = 'ap-type' as const

  title = 'Reasons Robert requires an enhanced security (ESAP) placement'

  showTitle = true

  nextStep() {
    if (this.body.esapReasons?.includes('secreting')) {
      return 'room-searches'
    }
    if (this.body.esapReasons?.includes('cctv')) {
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

  questions(): Array<Question> {
    return [new Question(this, 'esap-reasons'), new Question(this, 'other-factors')]
  }
}
