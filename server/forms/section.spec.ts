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

      const section = new Section(request, 'referralApplication')

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

      const section = new Section(request, 'referralApplication')

      section.complete()

      expect(request.session.referralApplication).toEqual({
        reason: 'likely',
        sections: { eligibility: { status: 'complete' }, other: { status: 'complete' } },
      })
    })
  })
})
