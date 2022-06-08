import { Request } from 'express'

import { RulesLogic } from 'json-logic-js'

export type AllowedSectionNames = 'eligibility' | 'ap-type'

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

export type ReferralApplicationBody = Partial<ApType & ReferralReason & OpdPathway & EsapReasons>

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
  nextStep: RulesLogic | string
  previousStep: RulesLogic | string
  validationRules: { [key: string]: Array<RulesLogic> }
  allowedToAccess: RulesLogic | boolean
  questions: Array<string>
  partial?: string
}

export interface ErrorMessages {
  [key: string]: Array<string>
}

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
