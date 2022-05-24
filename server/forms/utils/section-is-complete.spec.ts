import { Request } from 'express'
import { createMock } from '@golevelup/ts-jest'

import { sectionIsComplete } from './section-is-complete'
import { ReferralApplication } from '../referral-application.form'

describe('formIsComplete', () => {
  it('returns true when the session variable has a complete value of true', () => {
    const request = createMock<Request>({
      session: {
        referralApplication: {
          sections: {
            'confirm-need': { complete: true },
          },
        },
      },
    })

    expect(sectionIsComplete(request, ReferralApplication, 'confirm-need')).toBe(true)
  })

  it('returns false when the session variable has no complete value', () => {
    const request = createMock<Request>({
      session: {
        referralApplication: {},
      },
    })

    expect(sectionIsComplete(request, ReferralApplication, 'confirm-need')).toBe(false)
  })

  it('returns false when there is not session variable', () => {
    const request = createMock<Request>({
      session: {},
    })

    expect(sectionIsComplete(request, ReferralApplication, 'confirm-need')).toBe(false)
  })
})
