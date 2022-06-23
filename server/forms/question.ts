import nunjucks from 'nunjucks'
import { readFile } from 'fs/promises'

import type { ErrorMessages } from './interfaces'
import type Step from './step'
import { RadioOptions, CheckBoxOptions, ErrorMessage, TextAreaOptions } from './interfaces'

type QuestionWidget = 'govukRadios' | 'govukCheckboxes' | 'govukTextarea'
type QuestionArgs = RadioOptions | CheckBoxOptions | TextAreaOptions
interface QuestionData {
  widget: QuestionWidget
  args: QuestionArgs
}

export default class Question {
  body: any

  errors: ErrorMessages

  fieldName: string

  private constructor(
    private readonly step: Step,
    private readonly widget: QuestionWidget,
    private readonly args: QuestionArgs
  ) {
    this.body = step.body
    this.errors = step.errorMessages

    if ('idPrefix' in this.args) {
      this.fieldName = this.args.idPrefix
    } else if ('id' in this.args) {
      this.fieldName = this.args.id
    }

    nunjucks.configure([
      'node_modules/govuk-frontend/',
      'node_modules/govuk-frontend/components/',
      'node_modules/@ministryofjustice/frontend/',
      'node_modules/@ministryofjustice/frontend/moj/components/',
    ])
  }

  static async initialize(step: Step, question: string): Promise<Question> {
    const { widget, args } = (await Question.readQuestionData(question)) as QuestionData

    return new Question(step, widget, args)
  }

  async present(): Promise<string> {
    this.args.errorMessage = this.errorMessage(this.fieldName)

    if ('items' in this.args) {
      this.args.items = await Promise.all(
        this.args.items.map(async i => {
          let item = i

          if ('value' in i) {
            item = {
              ...item,
              checked: this.isChecked(this.fieldName, i.value),
            }
          }

          if ('conditionalQuestion' in i) {
            const question = await Question.initialize(this.step, i.conditionalQuestion)
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

    if ('id' in this.args) {
      this.args.value = this.body[this.fieldName]
    }

    return nunjucks.renderString(
      `
      ${this.imports()}

      {{
        ${this.widget}(args)
      }}
    `,
      {
        args: this.args,
      }
    )
  }

  public value(): string {
    const fieldValue = this.body[this.fieldName]

    if ('items' in this.args) {
      // If this question is a checkbox group with multiple answers
      if (Array.isArray(fieldValue)) {
        const items = this.args.items.filter(i => 'value' in i && fieldValue.includes(i.value))
        return items.map(i => 'text' in i && i.text).join('<br>')
      }

      // If this question is a group of radio buttons
      const item = this.args.items.find(i => 'value' in i && i.value === fieldValue)
      if (item && 'text' in item) {
        return item.text
      }
    }

    return fieldValue
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

  private static async readQuestionData(question: string): Promise<QuestionData> {
    const file = await readFile(`${__dirname}/questions/${question}.json`, 'utf8')
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
