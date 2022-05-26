import Page from './page'

export default class CCTV extends Page {
  constructor() {
    super('Enhanced CCTV provision')
  }

  public answerCctvReasons(answers: Array<string>) {
    this.completeCheckBoxes('cctvReasons', answers)
  }

  public answerCctvAgencyRequest(answer: string) {
    this.completeRadio('cctvAgencyRequest', answer)
  }
}
