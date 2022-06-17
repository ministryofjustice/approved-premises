import { createMock, DeepMocked } from '@golevelup/ts-jest'
import { Request } from 'express'

import { OutOfSequenceError, UnknownStepError } from './errors'

import Form from './form'
import Section from './section'
import Step from './step'

jest.mock('./step')
jest.mock('./section')

describe('Form', () => {
  let mockStep: DeepMocked<Step>
  let mockSection: DeepMocked<Section>

  beforeEach(() => {
    jest.resetAllMocks()

    mockStep = createMock<Step>({
      section: 'eligibility',
      allowedToAccess: jest.fn(),
      valid: jest.fn(),
      nextStep: jest.fn(),
      errorMessages: {
        foo: ['bar'],
      },
    })

    mockSection = createMock<Section>({
      name: 'eligibility',
    })

    jest.spyOn(Step, 'initialize').mockResolvedValue(mockStep)
    jest.spyOn(Section, 'initialize').mockResolvedValue(mockSection)
  })

  describe('initialize', () => {
    it('raises an error if the step is not allowed', async () => {
      const request = createMock<Request>({})
      mockStep.allowedToAccess.mockImplementation(() => false)

      expect(async () => Form.initialize(request)).rejects.toThrowError(OutOfSequenceError)
    })

    it('raises an error if the section does not match the step', async () => {
      const request = createMock<Request>({})
      mockSection.name = 'ap-type'

      expect(async () => Form.initialize(request)).rejects.toThrowError(UnknownStepError)
    })
  })
  describe('validForCurrentStep', () => {
    it('returns false and sets errors if the step is invalid', async () => {
      mockStep.valid.mockReturnValue(false)
      mockStep.errorMessages = {
        foo: ['bar'],
      }

      const request = createMock<Request>({
        params: {
          section: 'eligibility',
          step: 'referral-reason',
        },
        body: {},
      })

      const form = await Form.initialize(request)

      const valid = form.validForCurrentStep()

      const { errors } = form

      expect(valid).toBe(false)
      expect(errors).toEqual(mockStep.errorMessages)
    })

    it('returns true and sets no errors if the step is valid', async () => {
      mockStep.valid.mockReturnValue(true)

      const request = createMock<Request>({
        params: {
          section: 'eligibility',
          step: 'referral-reason',
        },
        body: {},
      })

      const form = await Form.initialize(request)

      const valid = form.validForCurrentStep()

      const { errors } = form

      expect(valid).toBe(true)
      expect(errors).toEqual(undefined)
    })
  })

  describe('nextStep', () => {
    it('returns the next step from the session', async () => {
      mockStep.nextStep.mockReturnValue('some-step')

      const request = createMock<Request>({
        params: {
          section: 'eligibility',
          step: 'referral-reason',
        },
        body: {},
      })

      const form = await Form.initialize(request)

      expect(form.nextStep()).toEqual('some-step')

      expect(mockStep.nextStep).toHaveBeenCalledWith(request.session[Form.sessionVarName])
    })
  })

  describe('persistData', () => {
    it('persists data in the session', async () => {
      const request = createMock<Request>({
        params: {
          section: 'eligibility',
          step: 'referral-reason',
        },
        body: { type: 'standard' } as any,
        session: {
          referralApplication: {
            reason: 'likely',
          },
        },
      })

      const form = await Form.initialize(request)

      form.persistData()

      expect(form.request.session.referralApplication).toEqual({ type: 'standard', reason: 'likely' })
    })

    it('overwrites old data already persisted in the session', async () => {
      const request = createMock<Request>({
        params: {
          section: 'eligibility',
          step: 'referral-reason',
        },
        body: { type: 'pipe' } as any,
        session: {
          referralApplication: {
            type: 'standard',
          },
        },
      })

      const form = await Form.initialize(request)

      form.persistData()

      expect(form.request.session.referralApplication).toEqual({ type: 'pipe' })
    })
  })

  describe('completeSection', () => {
    it('marks a section as complete in the session', async () => {
      const request = createMock<Request>({
        params: {
          step: 'referral-reason',
          section: 'eligibility',
        },
        session: {
          referralApplication: {
            reason: 'likely',
          },
        },
      })

      const form = await Form.initialize(request)

      form.completeSection()

      expect(mockSection.complete).toHaveBeenCalled()
    })
  })
})
