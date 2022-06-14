import { mapOasysSectionsToTableRows } from './mapOasysSectionsToTableRows'

describe('mapOasysSectionsToTableRows', () => {
  it('returns OasysSections mapped to the expected format', () => {
    const actual = mapOasysSectionsToTableRows(
      [
        {
          number: 1,
          name: 'Test',
          id: 'test',
          linkedToRosh: true,
          linkedToOffending: false,
          score: 'high',
          checked: true,
        },
        {
          number: 2,
          name: 'Test Number Two',
          id: 'test-number-two',
          linkedToRosh: false,
          linkedToOffending: true,
          score: 'low',
          checked: false,
        },
      ],
      'oasysSection[]'
    )

    expect(actual[0][0].html).toBe(`
        <div class='govuk-checkboxes__item moj-multi-select__checkbox'>
          <input type='checkbox' class='govuk-checkboxes__input' id='test' name='oasysSection[]' value='test'  checked>
        <label class='govuk-label govuk-checkboxes__label' for='test'>
          <span class='govuk-visually-hidden'>1. Test</span>
        </label>
        </div>`)
    expect(actual[0][1].text).toBe(`1. Test`)
    expect(actual[0][2].text).toEqual(`Yes`)
    expect(actual[0][3].text).toEqual(`No`)
    expect(actual[0][4].html).toBe(`<strong class='govuk-tag govuk-tag--red'>high</strong>`)

    expect(actual[1][0].html).toBe(`
        <div class='govuk-checkboxes__item moj-multi-select__checkbox'>
          <input type='checkbox' class='govuk-checkboxes__input' id='test-number-two' name='oasysSection[]' value='test-number-two'  >
        <label class='govuk-label govuk-checkboxes__label' for='test-number-two'>
          <span class='govuk-visually-hidden'>2. Test Number Two</span>
        </label>
        </div>`)
    expect(actual[1][1].text).toBe(`2. Test Number Two`)
    expect(actual[1][2].text).toEqual(`No`)
    expect(actual[1][3].text).toEqual(`Yes`)
    expect(actual[1][4].html).toBe(`<strong class='govuk-tag govuk-tag--green'>low</strong>`)
  })
})
