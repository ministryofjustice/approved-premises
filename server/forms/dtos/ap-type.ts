import { IsNotEmpty } from 'class-validator'

import Dto from './dto'

export default class ApType extends Dto {
  @IsNotEmpty({ message: 'You must select a type of AP' })
  type: 'standard' | 'pipe' | 'esap'
}
