import { Request } from 'express'
import { readFile } from 'fs/promises'

import type { AllowedSectionNames } from './interfaces'

export interface SectionData {
  name: string
  previousSection: AllowedSectionNames
  nextSection: AllowedSectionNames
}

export default class Section {
  name: string = this.sectionData.name

  previousSection: AllowedSectionNames = this.sectionData.previousSection

  nextSection: AllowedSectionNames = this.sectionData.nextSection

  private constructor(
    readonly sectionData: SectionData,
    private readonly request: Request,
    private readonly sessionVarName: string
  ) {}

  static async initialize(name: AllowedSectionNames, request: Request, sessionVarName: string): Promise<Section> {
    const json = await Section.readJson(name)

    return new Section(json, request, sessionVarName)
  }

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

  private static async readJson(section: string): Promise<SectionData> {
    const file = await readFile(`${__dirname}/sections/${section}.json`, 'utf8')
    return JSON.parse(file)
  }
}
