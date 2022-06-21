import Page from './page'

export default class OasysImportRisks extends Page {
  constructor() {
    super('Which of the following sections of OASys do you want to import?')
  }

  public toggleAllSections() {
    this.completeCheckBoxes('oasysSection', [
      'drug-misuse',
      'alcohol-misuse',
      'thinking-and-behaviour',
      'attitudes',
      'accomodation',
      'relationships',
      'emotional-well-being',
      'ete',
      'lifestyle-and-associates',
      'health',
    ])
  }
}
