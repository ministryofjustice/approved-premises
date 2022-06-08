import jsonLogic, { RulesLogic } from 'json-logic-js'
import moment from 'moment'

const isDateString = (value: any): boolean => {
  return moment(value, moment.ISO_8601).isValid()
}

const join = (values: Array<any>, seperator: string): string => {
  return values.join(seperator)
}

jsonLogic.add_operation('isDateString', isDateString)
jsonLogic.add_operation('join', join)

export { jsonLogic, RulesLogic }
