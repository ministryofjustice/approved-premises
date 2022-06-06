import { readFile } from 'fs/promises'
import jsonLogic from 'json-logic-js'

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
    if (typeof this.step.nextStep === 'object') {
      return jsonLogic.apply(this.step.nextStep, data)
    }
    return this.step.nextStep as string
  }

  private static async readJson(name: string): Promise<StepDefinition> {
    const file = await readFile(`${__dirname}/steps/${name}.json`, 'utf8')
    return JSON.parse(file)
  }
}
