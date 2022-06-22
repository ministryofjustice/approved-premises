import { createMock } from '@golevelup/ts-jest'
import { Request } from 'express'
import fsPromises from 'fs/promises'
import { pathExists, outputFile } from 'fs-extra'

import Section, { SectionData } from './section'
import Step from './step'
import { UnknownStepError } from './errors'

const sectionDataMock = {
  name: 'eligibility',
  previousSection: null,
  nextSection: 'ap-type',
  steps: ['referral-reason', 'not-eligible'],
} as unknown as SectionData

jest.mock('fs/promises', () => {
  return {
    readFile: () => JSON.stringify(sectionDataMock),
  }
})

jest.mock('fs-extra', () => {
  return {
    pathExists: jest.fn(),
    outputFile: jest.fn(),
  }
})

describe('Section', () => {
  describe('initialize', () => {
    it('returns an instance of a Section', async () => {
      jest.spyOn(fsPromises, 'readFile')

      const section = await Section.initialize('eligibility', createMock<Request>({}), 'referralApplication')

      expect(fsPromises.readFile).toHaveBeenCalledWith(`${__dirname}/sections/eligibility.json`, 'utf8')

      expect(section).toBeInstanceOf(Section)

      expect(section.name).toEqual('eligibility')
      expect(section.previousSection).toEqual(null)
      expect(section.nextSection).toEqual('ap-type')
      expect(section.steps).toEqual(['referral-reason', 'not-eligible'])
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

      const section = await Section.initialize('eligibility', request, 'referralApplication')

      section.complete()

      expect(request.session.referralApplication).toEqual({
        reason: 'likely',
        sections: { eligibility: { status: 'complete' } },
      })
    })

    it('adds a section to existing sections', async () => {
      const request = createMock<Request>({
        params: {
          step: 'referral-reason',
          section: 'eligibility',
        },
        session: {
          referralApplication: {
            reason: 'likely',
            sections: {
              other: { status: 'complete' },
            },
          },
        },
      })

      const section = await Section.initialize('eligibility', request, 'referralApplication')

      section.complete()

      expect(request.session.referralApplication).toEqual({
        reason: 'likely',
        sections: { eligibility: { status: 'complete' }, other: { status: 'complete' } },
      })
    })
  })

  describe('status', () => {
    it('returns complete when the session variable has a status value of complete', async () => {
      const request = createMock<Request>({
        session: {
          referralApplication: {
            sections: {
              eligibility: { status: 'complete' },
            },
          },
        },
      })

      const section = await Section.initialize('eligibility', request, 'referralApplication')

      expect(await section.status()).toEqual('complete')
      expect(pathExists).not.toHaveBeenCalled()
      expect(outputFile).not.toHaveBeenCalled()
    })

    it('returns the status when the session variable has a different status value', async () => {
      const request = createMock<Request>({
        session: {
          referralApplication: {
            sections: {
              eligibility: { status: 'in_progress' },
            },
          },
        },
      })

      const section = await Section.initialize('eligibility', request, 'referralApplication')

      expect(await section.status()).toEqual('in_progress')
      expect(pathExists).not.toHaveBeenCalled()
      expect(outputFile).not.toHaveBeenCalled()
    })

    it('returns not_started when the session variable has no status value', async () => {
      const request = createMock<Request>({
        session: {
          referralApplication: {},
        },
      })

      const section = await Section.initialize('eligibility', request, 'referralApplication')

      expect(await section.status()).toEqual('not_started')
      expect(pathExists).toHaveBeenCalled()
      expect(outputFile).not.toHaveBeenCalled()
    })

    it('returns not_started when there is no session variable', async () => {
      const request = createMock<Request>({
        session: {},
      })

      const section = await Section.initialize('eligibility', request, 'referralApplication')

      expect(await section.status()).toEqual('not_started')
      expect(pathExists).toHaveBeenCalled()
      expect(outputFile).not.toHaveBeenCalled()
    })

    it('returns cannot_start when the previous section has not been completed', async () => {
      sectionDataMock.previousSection = 'ap-type'

      const otherSection = {
        name: 'ap-type',
        previousSection: null,
        nextSection: 'eligibility',
      } as unknown as SectionData

      const request = createMock<Request>({
        session: {},
      })

      jest.spyOn(fsPromises, 'readFile').mockResolvedValueOnce(JSON.stringify(sectionDataMock))
      jest.spyOn(fsPromises, 'readFile').mockResolvedValueOnce(JSON.stringify(otherSection))

      const section = await Section.initialize('eligibility', request, 'referralApplication')

      expect(await section.status()).toEqual('cannot_start')
    })
  })

  describe('getStep', () => {
    let stepSpy: any

    beforeEach(() => {
      sectionDataMock.steps = ['referral-reason', 'not-eligible']
      jest.spyOn(fsPromises, 'readFile').mockResolvedValueOnce(JSON.stringify(sectionDataMock))

      stepSpy = jest.spyOn(Step, 'initialize')
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    it('should return a step object when it exists in a section', async () => {
      const request = createMock<Request>({})

      const section = await Section.initialize('eligibility', request, 'referralApplication')

      await section.getStep('referral-reason')

      expect(stepSpy).toHaveBeenCalledWith('referral-reason', request)
    })

    it('should raise an error when the section does not exist', async () => {
      const request = createMock<Request>({})

      const section = await Section.initialize('eligibility', request, 'referralApplication')

      expect(async () => section.getStep('cctv')).rejects.toThrowError(UnknownStepError)

      expect(stepSpy).not.toHaveBeenCalled()
    })
  })
})
