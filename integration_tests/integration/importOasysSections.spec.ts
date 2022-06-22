import Page from '../pages/page'
import OasysImportRisks from '../pages/importOasysSections'

context('SignIn', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
  })

  it('checkboxes can be toggled', () => {
    cy.signIn()

    // Given I am on the Oasys risks import page
    cy.visit('/risks/summary')
    const ImportOasysRisksPage = Page.verifyOnPage(OasysImportRisks)

    // When I toggle all the checkboxes
    ImportOasysRisksPage.toggleAllSections()

    // Then I can click save and continue
    ImportOasysRisksPage.saveAndContinue()
  })
})
