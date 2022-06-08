import { jsonLogic, RulesLogic } from '../utils/jsonlogic'

export const loadValidationRule = (json: any, rule: string, index = 0): RulesLogic => {
  return json.validationRules[rule][index] as RulesLogic
}

export const loadRule = (json: any, rule: string): RulesLogic => {
  return json[rule] as RulesLogic
}

export const applyRule = (rule: RulesLogic, data: any) => {
  return jsonLogic.apply(rule, data)
}
