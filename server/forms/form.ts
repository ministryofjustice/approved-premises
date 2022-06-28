import { Request } from 'express'

import Step from './step'
import Section from './section'

import { ErrorMessages, AllowedSectionNames, AllowedStepNames } from './interfaces'
import { OutOfSequenceError } from './errors'
import { retrieveSavedSession } from './helpers/retrieveSavedSession'
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
  }

  public static async initialize(request: Request): Promise<Form> {
    const requestWithSavedSession = Object.keys(request.body).length
      ? request
      : ((await retrieveSavedSession(request, sessionVarName)) as Request)

    const section = await Section.initialize(
      request.params.section as AllowedSectionNames,
      requestWithSavedSession,
      Form.sessionVarName
    )
    const step = await section.getStep(request.params.step as AllowedStepNames)

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
