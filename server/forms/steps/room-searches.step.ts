import { plainToInstance } from 'class-transformer'

import RoomSearches from '../dtos/room-searches'

import Step from './step'

export default class RoomSearchesStep extends Step {
  nextStep() {
    if (this.sessionData.reasons?.includes('cctv')) {
      return 'cctv' as const
    }
    return undefined
  }

  previousStep() {
    return 'esap-reasons' as const
  }

  dto(): RoomSearches {
    return plainToInstance(RoomSearches, this.body)
  }

  allowedToAccess(): boolean {
    return this.sessionData?.reasons?.includes('secreting') || false
  }
}
