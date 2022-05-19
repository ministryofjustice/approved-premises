import { ValidateIf, IsNotEmpty } from 'class-validator'

export default class ReferralReason {
  @IsNotEmpty({ message: 'You must select a reason' })
  reason: 'likely' | 'condition' | 'exception' | 'other' | 'no-reason'

  @ValidateIf(o => o.reason === 'other')
  @IsNotEmpty({ message: 'You must specify what your other reason is' })
  other: string
}
