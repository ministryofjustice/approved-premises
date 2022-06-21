import Page from '../pages/page'

import ReferralApplicationTasklist from '../pages/referral-application-tasklist'
import ReferralReason from '../pages/referral-reason'
import TypeOfAP from '../pages/type-of-ap'
import EsapReasons from '../pages/esap-reasons'
import RoomSearches from '../pages/room-searches'
import CCTV from '../pages/cctv'

context('SignIn', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.signIn()
  })

  it('allows me to check eligibility', () => {
    // Given I am on the referral tasklist
    const page = ReferralApplicationTasklist.visit()

    // And I check the person's eligibility
    checkEligibility(page)

    // Then I should be returned to the tasklist
    Page.verifyOnPage(ReferralApplicationTasklist)

    // And my task should be marked as completed
    page.checkStatus('eligibility', 'Completed')
  })

  it('does not allow me to choose an AP type before I have checked eligibility', () => {
    // Given I am on the referral tasklist
    const page = ReferralApplicationTasklist.visit()

    // And I have not checked the person's eligibility
    // Then the AP type task should be marked as cannot start yet
    page.checkStatus('ap-type', 'Cannot start yet')

    // And I should not be able to click on the link to start the task
    page.linkForSectionShouldNotExist('ap-type')
  })

  it('allows me to select a type of AP', () => {
    // Given I have checked the person's eligiblity
    const page = ReferralApplicationTasklist.visit()
    checkEligibility(page)

    // And I visit the type of AP section
    page.startSection('Select the type of AP Required')

    // And I choose an ESAP AP
    const typeOfAp = Page.verifyOnPage(TypeOfAP)
    typeOfAp.answerType('esap')
    typeOfAp.saveAndContinue()

    // Then I should be asked the appropriate questions
    const esapReasons = Page.verifyOnPage(EsapReasons)

    esapReasons.chooseReasons(['secreting', 'cctv'])
    esapReasons.saveAndContinue()

    const roomSearches = Page.verifyOnPage(RoomSearches)

    roomSearches.answerItems(['weapons', 'drugs'])
    roomSearches.answerAgencyRequest('no')
    roomSearches.saveAndContinue()

    const cctv = Page.verifyOnPage(CCTV)

    cctv.answerCctvReasons(['assualt-staff'])
    cctv.answerCctvAgencyRequest('no')
    cctv.saveAndContinue()

    // And I should be returned to the tasklist
    Page.verifyOnPage(ReferralApplicationTasklist)

    // And my task should be marked as completed
    page.checkStatus('ap-type', 'Completed')
  })

  it('Answers are saved in the session ', () => {
    // Given I complete the questionaire
    const page = ReferralApplicationTasklist.visit()
    checkEligibility(page)
    page.startSection('Select the type of AP Required')
    const typeOfAp = Page.verifyOnPage(TypeOfAP)
    typeOfAp.answerType('esap')
    typeOfAp.saveAndContinue()
    const esapReasons = Page.verifyOnPage(EsapReasons)
    esapReasons.chooseReasons(['secreting', 'cctv'])
    esapReasons.saveAndContinue()
    const roomSearches = Page.verifyOnPage(RoomSearches)
    roomSearches.answerItems(['weapons', 'drugs'])
    roomSearches.answerAgencyRequest('no')
    roomSearches.saveAndContinue()
    const cctv = Page.verifyOnPage(CCTV)
    cctv.answerCctvReasons(['assualt-staff'])
    cctv.answerCctvAgencyRequest('no')
    cctv.saveAndContinue()

    Page.verifyOnPage(ReferralApplicationTasklist)

    // When the session is cleared
    page.signOut().click()
    cy.signIn()

    // When I go back to the tasklist and the previously answered section
    // Then my previous answers aren't visible
    ReferralApplicationTasklist.visit()
    page.checkStatus('ap-type', 'Cannot start yet')
    page.startSection('Check if the person is eligible')
    cy.get(`input[name="referralReason"][value=likely]`).should('not.be.checked')
  })
})

const checkEligibility = (page: ReferralApplicationTasklist) => {
  page.startSection('Check if the person is eligible')

  const checkEligibilityPage = Page.verifyOnPage(ReferralReason)

  checkEligibilityPage.answerReason('likely')
  checkEligibilityPage.saveAndContinue()
}
