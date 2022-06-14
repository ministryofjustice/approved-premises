export interface OasysSection {
  number: number
  name: string
  id: string
  linkedToRosh: boolean
  linkedToOffending: boolean
  score: 'high' | 'medium' | 'low'
  checked?: boolean
}

export type OasysSectionTableRow = Array<
  [
    { html: string },
    { text: string },
    { text: string; classes: string },
    { text: string; classes: string },
    { html: string }
  ]
>

export const mapOasysSectionsToTableRows = (
  sections: Array<OasysSection>,
  sectionName: 'oasysSection[]'
): OasysSectionTableRow => {
  const scores = {
    high: "<strong class='govuk-tag govuk-tag--red'>high</strong>",
    medium: "<strong class='govuk-tag govuk-tag--orange'>medium</strong>",
    low: "<strong class='govuk-tag govuk-tag--green'>low</strong>",
  }
  return sections.map(({ number, name, id, linkedToRosh, linkedToOffending, score, checked }) => {
    return [
      {
        html: `
        <div class='govuk-checkboxes__item moj-multi-select__checkbox'>
          <input type='checkbox' class='govuk-checkboxes__input' id='${id}' name='${sectionName}' value='${id}'  ${
          checked ? 'checked' : ''
        }>
        <label class='govuk-label govuk-checkboxes__label' for='${id}'>
          <span class='govuk-visually-hidden'>${number}. ${name}</span>
        </label>
        </div>`,
      },
      { text: `${number}. ${name}` },
      { text: linkedToRosh ? 'Yes' : 'No', classes: 'govuk-!-font-weight-bold' },
      { text: linkedToOffending ? 'Yes' : 'No', classes: 'govuk-! -font-weight-bold' },
      { html: scores[score] },
    ]
  })
}
