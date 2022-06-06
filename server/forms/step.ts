import { readFile } from 'fs/promises'
import jsonLogic, { RulesLogic } from 'json-logic-js'
import moment from 'moment'

import { StepDefinition, ErrorMessages } from './interfaces'

const isDateString = (value: any): boolean => {
  return moment(value, moment.ISO_8601).isValid()
}

jsonLogic.add_operation('isDateString', isDateString)

export default class Step {
  name: string = this.step.name

  section: string = this.step.section

  title: string = this.step.title

  showTitle: boolean = this.step.showTitle

  errorMessages: ErrorMessages

  private constructor(private readonly step: StepDefinition) {}

  public static async initialize(name: string): Promise<Step> {
    const json = await Step.readJson(name)

    return new Step(json)
  }

  public nextStep(data: any): string {
    return this.applyRule(this.step.nextStep, data)
  }

  public previousStep(data: any): string {
    return this.applyRule(this.step.previousStep, data)
  }

  public valid(data: any): boolean {
    this.validate(data)

    return Object.keys(this.errorMessages).length === 0
  }

  public questions(): Array<Question> {
    return this.step.questions.map(question => new Question(this, question))
  }

  public allowedToAccess(data: any) {
    const rule = this.step.allowedToAccess

    if (typeof rule === 'object') {
      return jsonLogic.apply(rule, data)
    }

    return rule
  }

  private validate(data: any): void {
    const errors = {}

    Object.keys(this.step.validationRules).forEach(key => {
      const rules = this.step.validationRules[key]
      rules.forEach(rule => {
        const result = this.applyRule(rule, data)
        if (typeof result === 'string') {
          errors[key] = errors[key] || []
          errors[key].push(result)
        }
      })
    })

    this.errorMessages = errors
  }

  private applyRule(rule: RulesLogic | string, data: any) {
    if (typeof rule === 'object') {
      return jsonLogic.apply(rule, data)
    }
    return rule as string
  }

  private static async readJson(name: string): Promise<StepDefinition> {
    const file = await readFile(`${__dirname}/steps/${name}.json`, 'utf8')
    return JSON.parse(file)
  }
}
