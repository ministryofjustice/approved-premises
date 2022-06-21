export type PageElement = Cypress.Chainable<JQuery>

export default abstract class Page {
  static verifyOnPage<T>(constructor: new () => T): T {
    return new constructor()
  }

  constructor(private readonly title: string) {
    this.checkOnPage()
  }

  checkOnPage(): void {
    cy.get('h1').contains(this.title)
  }

  saveAndContinue(): void {
    cy.get('button').contains('Save and continue').click()
  }

  signOut = (): PageElement => cy.get('[data-qa=signOut]')

  manageDetails = (): PageElement => cy.get('[data-qa=manageDetails]')

  completeCheckBoxes(name: string, answers: Array<string>): void {
    answers.forEach(answer => {
      cy.get(`input[name="${name}[]"][value=${answer}]`).click()
    })
  }

  completeRadio(name: string, answer: string): void {
    cy.get(`input[name="${name}"][value=${answer}]`).click()
  }

  checkInputsChecked(name: string, value: string): void {
    cy.get(`input[name="${name}"][value=${value}]`).should('be.checked')
  }
}
