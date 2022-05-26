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
    page.checkStatus('eligibility', 'Completed')
  })

  const checkEligibility = (page: ReferralApplicationTasklist) => {
    page.startSection('Check if the person is eligible')

    const checkEligibilityPage = Page.verifyOnPage(ReferralReason)

    checkEligibilityPage.answerReason('likely')
    checkEligibilityPage.saveAndContinue()
  }
})
