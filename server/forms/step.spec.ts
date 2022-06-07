import fsPromises from 'fs/promises'

import Step from './step'
import Question from './question'

import { StepDefinition } from './interfaces'

const stepMock = {
  name: 'foo',
  section: 'bar',
  title: 'title',
  nextStep: '',
  showTitle: false,
  questions: [] as Array<string>,
} as unknown as StepDefinition

jest.mock('fs/promises', () => {
  return {
    readFile: () => JSON.stringify(stepMock),
  }
})

describe('Step', () => {
  let step: Step

  describe('initialize', () => {
    it('returns an instance of a Step', async () => {
      jest.spyOn(fsPromises, 'readFile')

      step = await Step.initialize('step', {})

      expect(fsPromises.readFile).toHaveBeenCalledWith(`${__dirname}/steps/step.json`, 'utf8')

      expect(step).toBeInstanceOf(Step)

      expect(step.name).toEqual('foo')
      expect(step.section).toEqual('bar')
      expect(step.title).toEqual('title')
      expect(step.showTitle).toEqual(false)
    })
  })

  describe('nextStep', () => {
    it('returns the next step when it is a simple string', async () => {
      stepMock.nextStep = 'next'

      step = await Step.initialize('step', {})

      expect(step.nextStep({})).toEqual('next')
    })

    it('applies rules if included', async () => {
      stepMock.nextStep = {
        if: [
          { '===': [{ var: 'type' }, 'pipe'] },
          'opd-pathway',
          { '===': [{ var: 'type' }, 'esap'] },
          'esap-reasons',
          null,
        ],
      }

      step = await Step.initialize('step', { type: 'pipe' })

      expect(step.nextStep({ type: 'pipe' })).toEqual('opd-pathway')
      expect(step.nextStep({ type: 'esap' })).toEqual('esap-reasons')
      expect(step.nextStep({ type: 'other' })).toEqual(null)
    })
  })

  describe('previousStep', () => {
    it('returns the previous step when it is a simple string', async () => {
      stepMock.previousStep = 'prev'

      const result = await Step.initialize('step', {})

      expect(result.previousStep({})).toEqual('prev')
    })

    it('applies rules if included', async () => {
      stepMock.previousStep = {
        if: [
          { '===': [{ var: 'type' }, 'pipe'] },
          'opd-pathway',
          { '===': [{ var: 'type' }, 'esap'] },
          'esap-reasons',
          null,
        ],
      }

      step = await Step.initialize('step', { type: 'pipe' })

      expect(step.previousStep({ type: 'pipe' })).toEqual('opd-pathway')
      expect(step.previousStep({ type: 'esap' })).toEqual('esap-reasons')
      expect(step.previousStep({ type: 'othher' })).toEqual(null)
    })
  })

  describe('valid', () => {
    it('should validate the existence of a variable', async () => {
      stepMock.validationRules = {
        type: [
          {
            if: [{ var: ['type'] }, true, 'You must select a type of AP'],
          },
        ],
      }

      step = await Step.initialize('step', {})

      expect(step.valid()).toEqual(false)
      expect(step.errorMessages).toEqual({ type: ['You must select a type of AP'] })

      step = await Step.initialize('step', { type: 'standard' })

      expect(step.valid()).toEqual(true)
      expect(step.errorMessages).toEqual({})
    })

    it('should validate if a variable is included in a list of variables', async () => {
      stepMock.validationRules = {
        type: [
          {
            if: [{ in: [{ var: 'type' }, ['standard', 'pipe', 'esap']] }, true, 'You must select a type of AP'],
          },
        ],
      }

      step = await Step.initialize('step', {})

      expect(step.valid()).toEqual(false)
      expect(step.errorMessages).toEqual({ type: ['You must select a type of AP'] })

      step = await Step.initialize('step', { type: 'standard' })

      expect(step.valid()).toEqual(true)
      expect(step.errorMessages).toEqual({})
    })

    it('should validate a date string', async () => {
      stepMock.validationRules = {
        date: [
          {
            if: [{ isDateString: [{ var: 'date' }] }, true, 'You must enter a valid date'],
          },
        ],
      }

      step = await Step.initialize('step', { date: '20-20-20' })

      expect(step.valid()).toEqual(false)
      expect(step.errorMessages).toEqual({ date: ['You must enter a valid date'] })

      step = await Step.initialize('step', { date: '2022-01-01' })

      expect(step.valid()).toEqual(true)
      expect(step.errorMessages).toEqual({})
    })

    it('should carry out conditional validations', async () => {
      stepMock.validationRules = {
        cctvAgency: [
          {
            if: [
              {
                and: [
                  {
                    missing: 'cctvAgency',
                  },
                  {
                    '===': [
                      {
                        var: 'cctvAgencyRequest',
                      },
                      'yes',
                    ],
                  },
                ],
              },
              'You must specify agencies',
              true,
            ],
          },
        ],
      }

      step = await Step.initialize('step', { cctvAgencyRequest: 'yes' })

      expect(step.valid()).toEqual(false)
      expect(step.errorMessages).toEqual({ cctvAgency: ['You must specify agencies'] })

      step = await Step.initialize('step', { cctvAgencyRequest: 'yes', cctvAgency: '' })

      expect(step.valid()).toEqual(false)
      expect(step.errorMessages).toEqual({ cctvAgency: ['You must specify agencies'] })

      step = await Step.initialize('step', { cctvAgencyRequest: 'no' })

      expect(step.valid()).toEqual(true)
      expect(step.errorMessages).toEqual({})
    })
  })

  describe('allowedToAccess', () => {
    it('should return the boolean value if specified', async () => {
      stepMock.allowedToAccess = true

      step = await Step.initialize('step', {})

      expect(step.allowedToAccess({})).toEqual(true)
    })

    it('should apply a rule', async () => {
      stepMock.allowedToAccess = { if: [{ var: 'type' }, true, false] }

      step = await Step.initialize('step', {})

      expect(step.allowedToAccess({})).toEqual(false)
      expect(step.allowedToAccess({ type: 'foo' })).toEqual(true)
    })
  })

  describe('questions', () => {
    it('should return an array of questions', async () => {
      stepMock.questions = ['question1', 'question2']

      step = await Step.initialize('step', {})

      expect(step.questions.length).toEqual(2)

      expect(step.questions[0]).toBeInstanceOf(Question)
      expect(step.questions[1]).toBeInstanceOf(Question)
    })
  })
})
