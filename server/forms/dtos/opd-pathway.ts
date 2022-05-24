import { IsNotEmpty, ValidateIf, IsDateString } from 'class-validator'

import Dto from './dto'

export default class OpdPathway extends Dto {
  @IsNotEmpty({ message: 'You must indicate whether the person has been screened into the OPD pathway' })
  is_opd_pathway_screened: true | false

  @ValidateIf(o => o.is_opd_pathway_screened === 'yes')
  @IsDateString({}, { message: 'You must provide the date of the last consultation or formulation' })
  lastOpdDate: string
}
