import { createMock } from '@golevelup/ts-jest'

import Question from './question'
import type Step from './step'

describe('Question', () => {
  describe('with radio buttons', () => {
    it('renders a group of radio buttons', async () => {
      const step = createMock<Step>()

      const question = await Question.initialize(step, 'type')

      const html = await question.present()

      expect(html).toContain('What type of AP does Robert Smith require?')
    })

    it('prepopulates an option if already selected', async () => {
      const step = createMock<Step>()

      step.body.type = 'standard'

      const question = await Question.initialize(step, 'type')

      const html = await question.present()

      expect(html).toContain(
        '<input class="govuk-radios__input" id="type" name="type" type="radio" value="standard" checked>'
      )
    })

    it('adds the error messages to the group', async () => {
      const step = createMock<Step>()

      step.errorMessages = {
        type: ['You must specify a type'],
      }

      const question = await Question.initialize(step, 'type')

      const html = await question.present()
      expect(html).toContain('<span class="govuk-visually-hidden">Error:</span> You must specify a type')
    })

    describe('when there are conditional questions', () => {
      it('adds a conditional question', async () => {
        const step = createMock<Step>()

        const question = await Question.initialize(step, 'is-opd-pathway-screened')

        const html = await question.present()

        expect(html).toContain('Has Robert Brown been screened into the OPD pathway?')
        expect(html).toContain('govuk-radios__conditional govuk-radios__conditional--hidden')
        expect(html).toContain('When was Robert Brown&#39;s last consultation or formulation?')
      })
    })
  })

  describe('with checkboxes', () => {
    it('renders a group of checkboxes', async () => {
      const step = createMock<Step>()

      const question = await Question.initialize(step, 'cctv-reasons')

      const html = await question.present()

      expect(html).toContain(
        'Which behaviours has Robert demonstrated that require enhanced CCTV provision to monitor?'
      )
    })

    it('prepopulates an option if already selected', async () => {
      const step = createMock<Step>()

      step.body.cctvReasons = ['appearance', 'networks', 'community-threats']

      const question = await Question.initialize(step, 'cctv-reasons')

      const html = await question.present()

      expect(html).toContain(
        '<input class="govuk-checkboxes__input" id="cctvReasons" name="cctvReasons[]" type="checkbox" value="appearance" checked>'
      )

      expect(html).toContain(
        '<input class="govuk-checkboxes__input" id="cctvReasons-2" name="cctvReasons[]" type="checkbox" value="networks" checked>'
      )

      expect(html).toContain(
        '<input class="govuk-checkboxes__input" id="cctvReasons-6" name="cctvReasons[]" type="checkbox" value="community-threats" checked>'
      )
    })

    it('adds the error messages to the group', async () => {
      const step = createMock<Step>()

      step.errorMessages = {
        cctvReasons: ['You must specify a reason'],
      }

      const question = await Question.initialize(step, 'cctv-reasons')

      const html = await question.present()
      expect(html).toContain('<span class="govuk-visually-hidden">Error:</span> You must specify a reason')
    })
  })

  describe('with a textarea', () => {
    it('returns a textarea', async () => {
      const step = createMock<Step>()

      const question = await Question.initialize(step, 'cctv-supporting-information')

      const html = await question.present()

      expect(html).toContain('Provide any supporting information about why Robert requires enhanced CCTV provision.')
    })

    it('prepopulates the question', async () => {
      const step = createMock<Step>()

      step.body.cctvSupportingInformation = 'text goes here'

      const question = await Question.initialize(step, 'cctv-supporting-information')

      const html = await question.present()

      expect(html).toContain('text goes here')
    })
  })
})
