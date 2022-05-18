import { Transform } from 'class-transformer'

const convertDate = (plainDate: { year: string; month: string; day: string }) => {
  if (plainDate.year && plainDate.month && plainDate.day) {
    return new Date(`${plainDate.year}-${plainDate.month}-${plainDate.day}`)
  }
  return undefined
}

export default class FilterArgs {
  location: string

  gender: string

  requirements: string[]

  @Transform(({ value }) => convertDate(value), { toClassOnly: true })
  date_from: Date

  @Transform(({ value }) => convertDate(value), { toClassOnly: true })
  date_to: Date
}
