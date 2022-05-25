import { Request } from 'express'
import { createMock } from '@golevelup/ts-jest'

import { getSectionStatus } from './get-section-status'
import { ReferralApplication } from '../referral-application.form'

describe('formIsComplete', () => {
  it('returns complete when the session variable has a status value of complete', () => {
    const request = createMock<Request>({
      session: {
        referralApplication: {
          sections: {
            'confirm-need': { status: 'complete' },
          },
        },
      },
    })

    expect(getSectionStatus(request, ReferralApplication, 'confirm-need')).toEqual('complete')
  })

  it('returns the status when the session variable has a different status value', () => {
    const request = createMock<Request>({
      session: {
        referralApplication: {
          sections: {
            'confirm-need': { status: 'in_progress' },
          },
        },
      },
    })

    expect(getSectionStatus(request, ReferralApplication, 'confirm-need')).toEqual('in_progress')
  })

  it('returns not_started when the session variable has no status value', () => {
    const request = createMock<Request>({
      session: {
        referralApplication: {},
      },
    })

    expect(getSectionStatus(request, ReferralApplication, 'confirm-need')).toEqual('not_started')
  })

  it('returns not_started when there is no session variable', () => {
    const request = createMock<Request>({
      session: {},
    })

    expect(getSectionStatus(request, ReferralApplication, 'confirm-need')).toEqual('not_started')
  })
})
