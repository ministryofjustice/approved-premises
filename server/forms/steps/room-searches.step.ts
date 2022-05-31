import { plainToInstance } from 'class-transformer'

import RoomSearches from '../dtos/room-searches'

import Step from './step'
import Question from '../questions/question'

export default class RoomSearchesStep extends Step {
  section = 'ap-type' as const

  showTitle = true

  title = 'Enhanced room searches using body worn technology'

  nextStep() {
    if (this.sessionData.esapReasons?.includes('cctv')) {
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
    return this.sessionData?.esapReasons?.includes('secreting') || false
  }

  questions(): Array<Question> {
    return [new Question(this, 'items'), new Question(this, 'room-searches-agency-request')]
  }
}
