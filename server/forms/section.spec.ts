import { createMock } from '@golevelup/ts-jest'
import { Request } from 'express'

import Section from './section'

describe('Section', () => {
  beforeEach(() => {
    jest.resetAllMocks()
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

      const section = new Section('eligibility', request, 'referralApplication')

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

      const section = new Section('eligibility', request, 'referralApplication')

      section.complete()

      expect(request.session.referralApplication).toEqual({
        reason: 'likely',
        sections: { eligibility: { status: 'complete' }, other: { status: 'complete' } },
      })
    })
  })

  describe('status', () => {
    it('returns complete when the session variable has a status value of complete', () => {
      const request = createMock<Request>({
        session: {
          referralApplication: {
            sections: {
              eligibility: { status: 'complete' },
            },
          },
        },
      })

      const section = new Section('eligibility', request, 'referralApplication')

      expect(section.status()).toEqual('complete')
    })

    it('returns the status when the session variable has a different status value', () => {
      const request = createMock<Request>({
        session: {
          referralApplication: {
            sections: {
              eligibility: { status: 'in_progress' },
            },
          },
        },
      })

      const section = new Section('eligibility', request, 'referralApplication')

      expect(section.status()).toEqual('in_progress')
    })

    it('returns not_started when the session variable has no status value', () => {
      const request = createMock<Request>({
        session: {
          referralApplication: {},
        },
      })

      const section = new Section('eligibility', request, 'referralApplication')

      expect(section.status()).toEqual('not_started')
    })

    it('returns not_started when there is no session variable', () => {
      const request = createMock<Request>({
        session: {},
      })

      const section = new Section('eligibility', request, 'referralApplication')

      expect(section.status()).toEqual('not_started')
    })
  })
})
