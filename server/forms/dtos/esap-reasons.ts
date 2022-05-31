import { IsNotEmpty } from 'class-validator'

import Dto from './dto'

export type EsapReasonOptions = 'secreting' | 'cctv'

export default class EsapReasons extends Dto {
  @IsNotEmpty({ message: 'You must select at least one reason' })
  esapReasons: Array<EsapReasonOptions>

  otherFactors: 'neurodiverse' | 'complex-personality' | 'enhanced' | 'csu' | 'unlock' | 'corrupter'
}
