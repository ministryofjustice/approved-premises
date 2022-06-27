import nunjucks from 'nunjucks'
import moment from 'moment'
import { readFile } from 'fs/promises'

import type { ErrorMessages } from './interfaces'
import type Step from './step'
import {
  RadioOptions,
  CheckBoxOptions,
  ErrorMessage,
  TextAreaOptions,
  DateInputOptions,
  DateInputItems,
  RadioOrCheckBoxItems,
} from './interfaces'

type QuestionWidget = 'govukRadios' | 'govukCheckboxes' | 'govukTextarea' | 'govukDateInput'
type QuestionArgs = RadioOptions | CheckBoxOptions | TextAreaOptions | DateInputOptions
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
    let args
    const errorMessage = this.errorMessage(this.fieldName)

    if (this.widget === 'govukRadios' || this.widget === 'govukCheckboxes') {
      args = await this.setCheckBoxOrRadioGroupValues()
    } else if (this.widget === 'govukTextarea') {
      args = this.setTextAreaValue()
    } else if (this.widget === 'govukDateInput') {
      args = this.setDateInputValues(errorMessage)
    }

    if (errorMessage) {
      args.errorMessage = errorMessage
    }

    return nunjucks.renderString(
      `
      ${this.imports()}

      {{
        ${this.widget}(args)
      }}
    `,
      {
        args,
      }
    )
  }

  public key(): string {
    if ('label' in this.args) {
      return this.args.label.text
    }

    return this.args.fieldset.legend.text
  }

  public value(): string {
    if (this.widget === 'govukRadios' || this.widget === 'govukCheckboxes') {
      return this.getCheckBoxOrRadioButtonAnswers()
    }
    if (this.widget === 'govukDateInput') {
      return this.getDateInputAnswer()
    }

    return this.body[this.fieldName]
  }

  private getDateInputAnswer(): string {
    const [day, month, year] = [
      this.body[`${this.fieldName}-day`],
      this.body[`${this.fieldName}-month`],
      this.body[`${this.fieldName}-year`],
    ] as Array<number>

    if (day && month && year) {
      const date = new Date(year, month - 1, day)

      return moment(date).format('D MMMM YYYY')
    }

    return undefined
  }

  private getCheckBoxOrRadioButtonAnswers() {
    const fieldValue = this.body[this.fieldName]

    const args = this.widget === 'govukRadios' ? (this.args as RadioOptions) : (this.args as CheckBoxOptions)
    const items = args.items as RadioOrCheckBoxItems

    return Array.isArray(fieldValue)
      ? this.getCheckBoxAnswers(items, fieldValue)
      : this.getRadioButtonAnswer(items, fieldValue)
  }

  private getCheckBoxAnswers(items: RadioOrCheckBoxItems, fieldValues: Array<string>): string {
    const selectedItems = items.filter(i => 'value' in i && fieldValues.includes(i.value))
    return selectedItems.map(i => 'text' in i && i.text).join('<br>')
  }

  private getRadioButtonAnswer(items: RadioOrCheckBoxItems, fieldValue: string): string {
    const selectedItem = items.find(i => 'value' in i && i.value === fieldValue)
    return selectedItem && 'text' in selectedItem ? selectedItem.text : undefined
  }

  private async setCheckBoxOrRadioGroupValues(): Promise<RadioOptions | CheckBoxOptions> {
    const args = this.widget === 'govukRadios' ? (this.args as RadioOptions) : (this.args as CheckBoxOptions)

    args.items = (await Promise.all(
      args.items.map(async i => {
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
    )) as RadioOrCheckBoxItems

    return args
  }

  private setTextAreaValue(): TextAreaOptions {
    const args = this.args as TextAreaOptions
    args.value = this.body[this.fieldName]

    return args
  }

  private setDateInputValues(errorMessage: ErrorMessage): DateInputOptions {
    const args = this.args as DateInputOptions

    const [day, month, year] = [
      this.body[`${this.fieldName}-day`],
      this.body[`${this.fieldName}-month`],
      this.body[`${this.fieldName}-year`],
    ]

    const errorClass = errorMessage ? 'govuk-input--error' : ''

    args.items = [
      {
        classes: `govuk-input--width-2 ${errorClass}`,
        name: 'day',
        value: day,
      },
      {
        classes: `govuk-input--width-2 ${errorClass}`,
        name: 'month',
        value: month,
      },
      {
        classes: `govuk-input--width-4 ${errorClass}`,
        name: 'year',
        value: year,
      },
    ] as DateInputItems

    return args
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
