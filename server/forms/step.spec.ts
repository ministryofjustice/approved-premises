import fsPromises from 'fs/promises'
import { isRegExp } from 'util/types'
import Step from './step'

jest.mock('fs/promises')

describe('Step', () => {
  describe('initialize', () => {
    it('returns an instance of a Step', async () => {
      const step = { name: 'foo', section: 'bar', title: 'title', showTitle: false }

      jest.spyOn(fsPromises, 'readFile').mockImplementation(async () => JSON.stringify(step))

      const result = await Step.initialize('step')

      expect(fsPromises.readFile).toHaveBeenCalledWith(`${__dirname}/steps/step.json`, 'utf8')

      expect(result).toBeInstanceOf(Step)

      expect(result.name).toEqual('foo')
      expect(result.section).toEqual('bar')
      expect(result.title).toEqual('title')
      expect(result.showTitle).toEqual(false)
    })
  })

  describe('nextStep', () => {
    it('returns the next step when it is a simple string', async () => {
      const step = { nextStep: 'next' }

      jest.spyOn(fsPromises, 'readFile').mockImplementation(async () => JSON.stringify(step))

      const result = await Step.initialize('step')

      expect(result.nextStep({})).toEqual('next')
    })

    it('applies rules if included', async () => {
      const step = {
        nextStep: {
          if: [
            { '===': [{ var: 'type' }, 'pipe'] },
            'opd-pathway',
            { '===': [{ var: 'type' }, 'esap'] },
            'esap-reasons',
            null,
          ],
        },
      }

      jest.spyOn(fsPromises, 'readFile').mockImplementation(async () => JSON.stringify(step))

      const result = await Step.initialize('step')

      expect(result.nextStep({ type: 'pipe' })).toEqual('opd-pathway')
      expect(result.nextStep({ type: 'esap' })).toEqual('esap-reasons')
      expect(result.nextStep({ type: 'othher' })).toEqual(null)
    })
  })

  describe('previousStep', () => {
    it('returns the previous step when it is a simple string', async () => {
      const step = { previousStep: 'prev' }

      jest.spyOn(fsPromises, 'readFile').mockImplementation(async () => JSON.stringify(step))

      const result = await Step.initialize('step')

      expect(result.previousStep({})).toEqual('prev')
    })

    it('applies rules if included', async () => {
      const step = {
        previousStep: {
          if: [
            { '===': [{ var: 'type' }, 'pipe'] },
            'opd-pathway',
            { '===': [{ var: 'type' }, 'esap'] },
            'esap-reasons',
            null,
          ],
        },
      }

      jest.spyOn(fsPromises, 'readFile').mockImplementation(async () => JSON.stringify(step))

      const result = await Step.initialize('step')

      expect(result.previousStep({ type: 'pipe' })).toEqual('opd-pathway')
      expect(result.previousStep({ type: 'esap' })).toEqual('esap-reasons')
      expect(result.previousStep({ type: 'othher' })).toEqual(null)
    })
  })

  describe('valid', () => {
    it('should validate the existence of a variable', async () => {
      const step = {
        validationRules: {
          type: [
            {
              if: [{ var: ['type'] }, true, 'You must select a type of AP'],
            },
          ],
        },
      }

      jest.spyOn(fsPromises, 'readFile').mockImplementation(async () => JSON.stringify(step))

      const result = await Step.initialize('step')

      expect(result.valid({})).toEqual(false)
      expect(result.errorMessages).toEqual({ type: 'You must select a type of AP' })

      expect(result.valid({ type: 'standard' })).toEqual(true)
      expect(result.errorMessages).toEqual({})
    })

    it('should validate if a variable is included in a list of variables', async () => {
      const step = {
        validationRules: {
          type: [
            {
              if: [{ in: [{ var: 'type' }, ['standard', 'pipe', 'esap']] }, true, 'You must select a type of AP'],
            },
          ],
        },
      }

      jest.spyOn(fsPromises, 'readFile').mockImplementation(async () => JSON.stringify(step))

      const result = await Step.initialize('step')

      expect(result.valid({ type: 'no' })).toEqual(false)
      expect(result.errorMessages).toEqual({ type: 'You must select a type of AP' })

      expect(result.valid({ type: 'standard' })).toEqual(true)
      expect(result.errorMessages).toEqual({})
    })

    it('should validate a date string', async () => {
      const step = {
        validationRules: {
          date: [
            {
              if: [{ isDateString: [{ var: 'date' }] }, true, 'You must enter a valid date'],
            },
          ],
        },
      }

      jest.spyOn(fsPromises, 'readFile').mockImplementation(async () => JSON.stringify(step))

      const result = await Step.initialize('step')

      expect(result.valid({ date: '20-20-20' })).toEqual(false)
      expect(result.errorMessages).toEqual({ date: 'You must enter a valid date' })

      expect(result.valid({ date: '2022-01-01' })).toEqual(true)
      expect(result.errorMessages).toEqual({})
    })

    it('should carry out conditional validations', async () => {
      const step = {
        validationRules: {
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
        },
      }

      jest.spyOn(fsPromises, 'readFile').mockImplementation(async () => JSON.stringify(step))

      const result = await Step.initialize('step')

      expect(result.valid({ cctvAgencyRequest: 'yes' })).toEqual(false)
      expect(result.errorMessages).toEqual({ cctvAgency: 'You must specify agencies' })

      expect(result.valid({ cctvAgencyRequest: 'yes', cctvAgency: '' })).toEqual(false)
      expect(result.errorMessages).toEqual({ cctvAgency: 'You must specify agencies' })

      expect(result.valid({ cctvAgencyRequest: 'no' })).toEqual(true)
      expect(result.errorMessages).toEqual({})
    })
  })
})
