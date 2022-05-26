import Page from './page'

export default class ReferralReason extends Page {
  constructor() {
    super('What is the reason for the referral?')
  }

  public answerReason(answer: string) {
    this.completeRadio('reason', answer)
  }
}
