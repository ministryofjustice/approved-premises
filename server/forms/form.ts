import { Request } from 'express'

import Step from './step'

import { ErrorMessages } from './interfaces'
import { OutOfSequenceError, UnknownStepError } from './errors'

const sessionVarName = 'referralApplication'

export default class Form {
  static sessionVarName = sessionVarName

  errors: ErrorMessages

  nextStep: string

  sessionData = this.request.session[Form.sessionVarName]

  requestData = this.request.body

  private constructor(readonly step: Step, readonly request: Request) {
    if (this.step.allowedToAccess(this.sessionData) === false) {
      throw new OutOfSequenceError()
    }

    if (this.step.section !== this.request.params.section) {
      throw new UnknownStepError()
    }

    this.validForCurrentStep = this.step.valid(this.requestData)
    this.errors = this.step.errorMessages
    this.nextStep = this.step.nextStep(this.requestData)
  }

  public static async initialize(request: Request): Promise<Form> {
    const step = await Step.initialize(request.params.section)

    return new Form(step, request)
  }

  completeSection() {
    this.setSectionStatus('complete')
  }

  persistData() {
    this.request.session[Form.sessionVarName] = {
      ...this.request.session[Form.sessionVarName],
      ...this.request.body,
    }
  }

  validForCurrentStep(): boolean {
    const valid = this.step.valid()
    if (valid) {
      this.nextStep = this.step.nextStep()
    } else {
      this.errors = this.step.errorMessages
    }
    return valid
  }

  private setSectionStatus(status: string) {
    let sections = this.request.session[Form.sessionVarName].sections || {}

    sections = {
      ...sections,
      [this.request.params.section]: { status },
    }

    this.request.session[Form.sessionVarName] = {
      ...this.request.session[Form.sessionVarName],
      sections,
    }
  }
}
