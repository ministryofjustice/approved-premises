import { plainToInstance } from 'class-transformer'

import OpdPathway from '../dtos/opd-pathway'

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
      this.body['last-opd-date-year'],
      this.body['last-opd-date-month'],
      this.body['last-opd-date-day'],
    ].join('-')

    return plainToInstance(OpdPathway, { lastOpdDate, ...this.body })
  }

  allowedToAccess(): boolean {
    return this.sessionData.type === 'pipe'
  }
}
