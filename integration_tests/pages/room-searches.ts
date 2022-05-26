import Page from './page'

export default class RoomSearches extends Page {
  constructor() {
    super('Enhanced room searches using body worn technology')
  }

  public answerItems(answers: Array<string>) {
    this.completeCheckBoxes('items', answers)
  }

  public answerAgencyRequest(answer: string) {
    this.completeRadio('agencyRequest', answer)
  }
}
