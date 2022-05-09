import Page from './page'

export default class PlacementSearch extends Page {
  constructor() {
    super('Find a matching AP placement')
  }

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')
}
