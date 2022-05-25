import { ValidateIf, IsNotEmpty } from 'class-validator'

import Dto from './dto'

type RoomSearchItems =
  | 'radicalisation'
  | 'hate-crime'
  | 'child-sexual-abuse'
  | 'drugs'
  | 'weapons'
  | 'fire'
  | 'electronics'

export default class RoomSearches extends Dto {
  @IsNotEmpty({ message: 'You must select at least one item type that Robert has a history of secreting' })
  items: Array<RoomSearchItems>

  @IsNotEmpty({
    message:
      'You must specify if partnership agencies have requested the sharing of intelligence captured via body worn technology',
  })
  agencyRequest: boolean

  @ValidateIf(o => o.agencyRequest === 'yes')
  @IsNotEmpty({
    message: 'You must specify which partnership agencies have requested the sharing of intelligence',
  })
  agency: string

  supportingInformation: string
}
