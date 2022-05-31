import nunjucks from 'nunjucks'
import { readFile } from 'fs/promises'

import type { ErrorMessages } from '../interfaces'
import type { Step } from '../steps'
import { RadioOptions, CheckBoxOptions, ErrorMessage, TextAreaOptions } from './interfaces'

interface QuestionData {
  widget: 'govukRadios' | 'govukCheckboxes' | 'govukTextarea'
  args: RadioOptions | CheckBoxOptions | TextAreaOptions
}

export default class Question {
  widget: 'govukRadios' | 'govukCheckboxes' | 'govukTextarea'

  body: any

  errors: ErrorMessages

  constructor(private readonly step: Step, private readonly question: string) {
    this.body = step.body
    this.errors = step.errors

    nunjucks.configure([
      'node_modules/govuk-frontend/',
      'node_modules/govuk-frontend/components/',
      'node_modules/@ministryofjustice/frontend/',
      'node_modules/@ministryofjustice/frontend/moj/components/',
    ])
  }

  async present(): Promise<string> {
    const { widget, args } = (await this.readQuestionData(this.question)) as QuestionData

    let fieldName: string

    if ('idPrefix' in args) {
      fieldName = args.idPrefix
    } else if ('id' in args) {
      fieldName = args.id
    }

    args.errorMessage = this.errorMessage(fieldName)

    if ('items' in args) {
      args.items = await Promise.all(
        args.items.map(async i => {
          let item = i

          if ('value' in i) {
            item = {
              ...item,
              checked: this.isChecked(fieldName, i.value),
            }
          }

          if ('conditionalQuestion' in i) {
            const question = new Question(this.step, i.conditionalQuestion)
            item = {
              ...item,
              conditional: {
                html: await question.present(),
              },
            }
          }
          return item
        })
      )
    }

    if ('id' in args) {
      args.value = this.body[fieldName]
    }

    return nunjucks.renderString(
      `
      ${this.imports()}

      {{
        ${widget}(args)
      }}
    `,
      {
        args,
      }
    )
  }

  private isChecked(key: string, value: string): boolean {
    const fieldValue = this.body[key]

    if (Array.isArray(fieldValue)) {
      return this.body[key] && this.body[key].indexOf(value) >= 0
    }
    return fieldValue === value
  }

  private errorMessage(key: string): ErrorMessage {
    return this.errors?.[key]?.length > 0 ? { text: this.errors[key].join(',') } : undefined
  }

  private async readQuestionData(question: string): Promise<QuestionData> {
    const file = await readFile(`${__dirname}/${question}.json`, 'utf8')
    return JSON.parse(file)
  }

  private imports(): string {
    return `
      {% from "govuk/components/radios/macro.njk" import govukRadios %}
      {% from "govuk/components/input/macro.njk" import govukInput %}
      {% from "govuk/components/textarea/macro.njk" import govukTextarea %}
      {% from "govuk/components/checkboxes/macro.njk" import govukCheckboxes %}
      {% from "govuk/components/date-input/macro.njk" import govukDateInput %}
    `
  }
}
