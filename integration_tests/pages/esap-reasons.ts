import Page from './page'

export default class EsapReasons extends Page {
  constructor() {
    super('Reasons Robert requires an enhanced security (ESAP) placement')
  }

  public chooseReasons(answers: Array<string>) {
    this.completeCheckBoxes('esapReasons', answers)
  }

  public chooseFactors(answers: Array<string>) {
    this.completeCheckBoxes('otherFactors', answers)
  }
}
