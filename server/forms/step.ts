import { readFile } from 'fs/promises'
import jsonLogic, { RulesLogic } from 'json-logic-js'
import moment from 'moment'

import { StepDefinition, ErrorMessages } from './interfaces'
import Question from './question'

const isDateString = (value: any): boolean => {
  return moment(value, moment.ISO_8601).isValid()
}

jsonLogic.add_operation('isDateString', isDateString)

export default class Step {
  name: string = this.step.name

  section: string = this.step.section

  title: string = this.step.title

  showTitle: boolean = this.step.showTitle

  questions: Array<Question> = this.step.questions.map(question => new Question(this, question))

  errorMessages: ErrorMessages

  private constructor(private readonly step: StepDefinition, readonly body: any) {}

  public static async initialize(name: string, body: any): Promise<Step> {
    const json = await Step.readJson(name)

    return new Step(json, body)
  }

  public nextStep(data: any): string {
    return this.applyRule(this.step.nextStep, data)
  }

  public previousStep(data: any): string {
    return this.applyRule(this.step.previousStep, data)
  }

  public valid(): boolean {
    this.validate()

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

  private validate(): void {
    const errors = {}

    Object.keys(this.step.validationRules).forEach(key => {
      const rules = this.step.validationRules[key]
      rules.forEach(rule => {
        const result = this.applyRule(rule)
        if (typeof result === 'string') {
          errors[key] = errors[key] || []
          errors[key].push(result)
        }
      })
    })

    this.errorMessages = errors
  }

  private applyRule(rule: RulesLogic | string, data: any = this.body) {
    if (typeof rule === 'string') {
      return rule
    }
    return jsonLogic.apply(rule, data)
  }

  private static async readJson(name: string): Promise<StepDefinition> {
    const file = await readFile(`${__dirname}/steps/${name}.json`, 'utf8')
    return JSON.parse(file)
  }
}
