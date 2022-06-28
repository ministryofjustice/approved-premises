import { Request } from 'express'

import { RulesLogic } from 'json-logic-js'

export type AllowedSectionNames = 'eligibility' | 'ap-type' | 'confirm-ap-need'

export type AllowedStepNames =
  | 'referral-reason'
  | 'type-of-ap'
  | 'enhanced-risk'
  | 'esap-reasons'
  | 'not-eligible'
  | 'opd-pathway'
  | 'import-oasys-sections'
  | 'room-searches'
  | 'cctv'

export type ReferralApplicationParams = {
  step: AllowedStepNames
  section: AllowedSectionNames
}

export interface ReferralApplicationBody {
  [propName: string]: string | Array<string>
}

export type ReferralApplicationRequest = Request<
  ReferralApplicationParams,
  Record<string, unknown>,
  Record<string, unknown>
>

export interface StepDefinition {
  name: string
  section: AllowedSectionNames
  title: string
  showTitle: boolean
  nextStep: RulesLogic
  previousStep: RulesLogic
  validationRules: { [key: string]: Array<RulesLogic> }
  allowedToAccess: RulesLogic
  questions: Array<string>
  partial?: string
}

export interface ErrorMessages {
  [key: string]: Array<string>
}

export type RadioOrCheckBoxItems = Array<InputItem | Divider>

export type RadioOptions = {
  idPrefix?: string
  name: string
  hint?: { html: string } | { text: string }
  fieldset?: FieldSetOptions
  errorMessage?: ErrorMessage
  items?: RadioOrCheckBoxItems
}

export type TextAreaOptions = {
  name: string
  id: string
  value?: string
  errorMessage?: ErrorMessage
  label: Label
}

export type CheckBoxOptions = RadioOptions

export type DateInputItems = Array<DateInputItem>

export type DateInputOptions = {
  idPrefix?: string
  name: string
  hint?: { html: string } | { text: string }
  fieldset?: FieldSetOptions
  errorMessage?: ErrorMessage
  items?: DateInputItems
}

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

export interface DateInputItem {
  classes?: string
  name: string
  value?: string
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

export type SummaryListActionItem = {
  href: string
  text: string
  visuallyHiddenText: string
}

export type SummaryListItem = {
  key: { text: string } | { html: string }
  value: { text: string } | { html: string }
  actions?: { items: Array<SummaryListActionItem> }
}

export type SummaryList = {
  classes?: string
  attributes?: any
  rows: Array<SummaryListItem>
}
