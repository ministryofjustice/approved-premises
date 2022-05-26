import { IsNotEmpty, ValidateIf } from 'class-validator'

import Dto from './dto'

export type CCTVReasonOptions =
  | 'appearance'
  | 'networks'
  | 'assualt-staff'
  | 'assualt-others'
  | 'threats-to-life'
  | 'community-threats'

export default class CCTV extends Dto {
  @IsNotEmpty({
    message: 'You must select which behaviours has Robert demonstrated that require enhanced CCTV provision to monitor',
  })
  cctvReasons: Array<CCTVReasonOptions>

  @IsNotEmpty({
    message:
      'You must specify if partnership agencies have requested the sharing of intelligence captured via enhanced CCTV',
  })
  cctvAgencyRequest: boolean

  @ValidateIf(o => o.cctvAgencyRequest === 'yes')
  @IsNotEmpty({
    message: 'You must specify which partnership agencies have requested the sharing of intelligence',
  })
  cctvAgency: string

  cctvSupportingInformation: string
}
