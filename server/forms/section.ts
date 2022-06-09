import { Request } from 'express'

export default class Section {
  name: string = this.request.params.section

  constructor(readonly request: Request, private readonly sessionVarName: string) {}

  public complete(): void {
    this.setSectionStatus('complete')
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
