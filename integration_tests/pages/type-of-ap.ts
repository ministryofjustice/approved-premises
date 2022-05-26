import Page from './page'

export default class TypeOfAP extends Page {
  constructor() {
    super('What type of AP does Robert Smith require?')
  }

  public answerType(answer: string) {
    this.completeRadio('type', answer)
  }
}
