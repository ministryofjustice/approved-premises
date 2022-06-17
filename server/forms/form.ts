import { Request } from 'express'
import path from 'path'

import Step from './step'
import Section from './section'

import { ErrorMessages, AllowedSectionNames } from './interfaces'
import { OutOfSequenceError, UnknownStepError } from './errors'
import { saveSession } from './helpers/saveSession'

const sessionVarName = 'referralApplication'

export default class Form {
  static sessionVarName = sessionVarName

  errors: ErrorMessages

  sessionData = this.request.session[Form.sessionVarName]

  private constructor(readonly step: Step, readonly section: Section, readonly request: Request) {
    if (this.step.allowedToAccess(this.sessionData) === false) {
      throw new OutOfSequenceError()
    }

    if (this.step.section !== this.section.name) {
      throw new UnknownStepError()
    }
  }

  public static async initialize(request: Request): Promise<Form> {
    const step = await Step.initialize(request.params.step, request.body)
    const section = await Section.initialize(
      request.params.section as AllowedSectionNames,
      request,
      Form.sessionVarName
    )

    return new Form(step, section, request)
  }

  async completeSection() {
    this.section.complete()
    await this.persistData()
  }

  async persistData() {
    this.request.session[Form.sessionVarName] = {
      ...this.request.session[Form.sessionVarName],
      ...this.request.body,
    }

    await saveSession(this.request.user.username, this.request.session[Form.sessionVarName])
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
}
