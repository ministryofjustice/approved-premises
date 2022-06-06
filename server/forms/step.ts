import { readFile } from 'fs/promises'
import jsonLogic, { RulesLogic } from 'json-logic-js'

import { StepDefinition } from './interfaces'

export default class Step {
  name: string = this.step.name

  section: string = this.step.section

  title: string = this.step.title

  showTitle: boolean = this.step.showTitle

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
