import { IsNotEmpty } from 'class-validator'

export default class ApType {
  @IsNotEmpty({ message: 'You must select a type of AP' })
  type: 'standard' | 'pipe' | 'esap'
}
