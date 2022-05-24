import { plainToInstance } from 'class-transformer'
import { ReferralApplicationBody } from '../interfaces'

import OpdPathway from '../dtos/opd-pathway'

import Step from './step'

export default class OpdPathwayStep extends Step {
  nextStep() {
    return 'import-oasys-sections' as const
  }

  previousStep() {
    return 'type-of-ap' as const
  }

  dto(): OpdPathway {
    const lastOpdDate = [
      this.params['last-opd-date-year'],
      this.params['last-opd-date-month'],
      this.params['last-opd-date-day'],
    ].join('-')

    return plainToInstance(OpdPathway, { lastOpdDate, ...this.params })
  }

  allowedToAccess(sessionData: ReferralApplicationBody): boolean {
    return sessionData.type === 'pipe'
  }
}
