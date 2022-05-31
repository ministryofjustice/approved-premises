import { createMock } from '@golevelup/ts-jest'

import Question from './question'
import type ApTypeStep from '../steps/ap-type.step'

describe('Question', () => {
  describe('with radio buttons', () => {
    it('renders a group of radio buttons', async () => {
      const step = createMock<ApTypeStep>()

      const question = new Question(step, 'type')

      const html = await question.present()

      expect(html).toContain('What type of AP does Robert Smith require?')
    })

    it('prepopulates an option if already selected', async () => {
      const step = createMock<ApTypeStep>()

      step.body.type = 'standard'

      const question = new Question(step, 'type')

      const html = await question.present()

      expect(html).toContain(
        '<input class="govuk-radios__input" id="type" name="type" type="radio" value="standard" checked>'
      )
    })

    it('adds the error messages to the group', async () => {
      const step = createMock<ApTypeStep>()

      step.errors = {
        type: ['You must specify a type'],
      }

      const question = new Question(step, 'type')

      const html = await question.present()
      expect(html).toContain('<span class="govuk-visually-hidden">Error:</span> You must specify a type')
    })
  })
})
