import { Request } from 'express'

import Step from './step'

import { ErrorMessages } from './interfaces'
import { OutOfSequenceError, UnknownStepError } from './errors'

const sessionVarName = 'referralApplication'

export default class Form {
  static sessionVarName = sessionVarName

  errors: ErrorMessages

  sessionData = this.request.session[Form.sessionVarName]

  private constructor(readonly step: Step, readonly request: Request) {
    if (this.step.allowedToAccess(this.sessionData) === false) {
      throw new OutOfSequenceError()
    }

    if (this.step.section !== this.request.params.section) {
      throw new UnknownStepError()
    }
  }

  public static async initialize(request: Request): Promise<Form> {
    const step = await Step.initialize(request.params.step, request.body)

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

  nextStep(): string {
    return this.step.nextStep(this.request.session[Form.sessionVarName])
  }

  validForCurrentStep(): boolean {
    const valid = this.step.valid()
    if (!valid) {
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
