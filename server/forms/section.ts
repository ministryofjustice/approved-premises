import { Request } from 'express'

import type { AllowedSectionNames } from './interfaces'

export default class Section {
  constructor(
    readonly name: AllowedSectionNames,
    private readonly request: Request,
    private readonly sessionVarName: string
  ) {}

  public complete(): void {
    this.setSectionStatus('complete')
  }

  public status(): string {
    const sessionVar = this.request.session?.[this.sessionVarName]?.sections?.[this.name]

    return sessionVar?.status === undefined ? 'not_started' : sessionVar.status
  }

  private setSectionStatus(status: string): void {
    let sections = this.request.session[this.sessionVarName].sections || {}

    sections = {
      ...sections,
      [this.name]: { status },
    }

    this.request.session[this.sessionVarName] = {
      ...this.request.session[this.sessionVarName],
      sections,
    }
  }
}
