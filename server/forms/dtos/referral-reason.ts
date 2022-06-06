import { ValidateIf, IsNotEmpty } from 'class-validator'

import Dto from './dto'

export default class ReferralReason extends Dto {
  @IsNotEmpty({ message: 'You must select a reason' })
  referralReason: 'likely' | 'condition' | 'exception' | 'other' | 'no-reason'

  @ValidateIf(o => o.referralReason === 'other')
  @IsNotEmpty({ message: 'You must specify what your other reason is' })
  other: string
}
