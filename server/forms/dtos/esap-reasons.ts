import { IsNotEmpty } from 'class-validator'

import Dto from './dto'

export default class EsapReasons extends Dto {
  @IsNotEmpty({ message: 'You must select at least one reason' })
  reasons: Array<'secreting' | 'cctv'>

  otherFactors: 'neurodiverse' | 'complex-personality' | 'enhanced' | 'csu' | 'unlock' | 'corrupter'
}
