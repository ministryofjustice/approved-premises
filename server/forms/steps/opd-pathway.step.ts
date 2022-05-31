import { plainToInstance } from 'class-transformer'

import OpdPathway from '../dtos/opd-pathway'
import Question from '../question'

import Step from './step'

export default class OpdPathwayStep extends Step {
  section = 'ap-type' as const

  title = 'Has Robert Brown been screened into the OPD pathway?'

  nextStep(): undefined {
    return undefined
  }

  previousStep() {
    return 'type-of-ap' as const
  }

  dto(): OpdPathway {
    const lastOpdDate = [
      this.body['lastOpdDate-year'],
      this.body['lastOpdDate-month'],
      this.body['lastOpdDate-day'],
    ].join('-')

    return plainToInstance(OpdPathway, { lastOpdDate, ...this.body })
  }

  allowedToAccess(): boolean {
    return this.sessionData.type === 'pipe'
  }

  questions(): Array<Question> {
    return [new Question(this, 'is-opd-pathway-screened'), new Question(this, 'pipe-additional-detail')]
  }
}
