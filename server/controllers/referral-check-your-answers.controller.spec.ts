import { createMock } from '@golevelup/ts-jest'
import { Response, Request } from 'express'

import { ReferralCheckYourAnswersController } from './referral-check-your-answers.controller'

import { Section, Form, Step } from '../forms'
import { SummaryListItem } from '../forms/interfaces'

jest.mock('../forms/form')
jest.mock('../forms/section')

describe('ReferralCheckYourAnswersController', () => {
  describe('show', () => {
    it('renders the template with section data and all steps', async () => {
      const request = createMock<Request>({
        params: { section: 'section' },
      })
      const response = createMock<Response>()

      const step1Answers = [createMock<SummaryListItem>()]
      const step2Answers = [createMock<SummaryListItem>(), createMock<SummaryListItem>()]

      const mockSteps = [
        createMock<Step>({ title: 'Step 1', answers: async () => step1Answers }),
        createMock<Step>({
          title: 'Step 2',
          answers: async () => step2Answers,
        }),
        createMock<Step>({ title: 'Step 3', answers: async () => [] }),
      ]
      const mockSection = createMock<Section>({ allSteps: async () => mockSteps })
      const next = jest.fn()

      jest.spyOn(Section, 'initialize').mockResolvedValue(mockSection)

      await ReferralCheckYourAnswersController.show(request, response, next)

      const expectedSteps = [
        {
          title: mockSteps[0].title,
          rows: step1Answers,
        },
        {
          title: mockSteps[1].title,
          rows: step2Answers,
        },
      ]

      expect(Section.initialize).toHaveBeenCalledWith('section', request, Form.sessionVarName)
      expect(response.render).toHaveBeenCalledWith(`referral-application/check-answers/show`, {
        ...mockSection,
        steps: expectedSteps,
      })
    })
  })

  describe('update', () => {
    it('marks the section as complete and redirects to the tasklist', async () => {
      const request = createMock<Request>()
      const response = createMock<Response>()
      const next = jest.fn()

      const mockForm = createMock<Form>()
      jest.spyOn(Form, 'initialize').mockResolvedValue(mockForm)

      await ReferralCheckYourAnswersController.update(request, response, next)

      expect(Form.initialize).toHaveBeenCalledWith(request)
      expect(mockForm.completeSection).toHaveBeenCalled()

      expect(response.redirect).toHaveBeenCalledWith('/referral_tasklist')
    })
  })
})
