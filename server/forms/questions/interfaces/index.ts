export type RadioOptions = {
  idPrefix?: string
  name: string
  hint?: { html: string } | { text: string }
  fieldset?: FieldSetOptions
  errorMessage?: ErrorMessage
  items?: Array<InputItem | Divider>
}

export type TextAreaOptions = {
  name: string
  id: string
  value?: string
  errorMessage?: ErrorMessage
  label: Label
}

export type CheckBoxOptions = RadioOptions

export interface Label {
  text: string
  classes?: string
}

export interface ErrorMessage {
  text: string
}

export interface FieldSetOptions {
  legend: LegendOptions
}

export interface LegendOptions {
  text?: string
  isPageHeading?: boolean
  classes?: string
}

export interface InputItem {
  value: string
  text: string
  checked?: boolean
  conditional?: { html: string } | { text: string }
  conditionalQuestion?: string
}

export interface Divider {
  divider: string
}
