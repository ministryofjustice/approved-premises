import { Request } from 'express'
import { createMock } from '@golevelup/ts-jest'

import { getSectionStatus } from './get-section-status'
import Form from '../form'

describe('formIsComplete', () => {
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

    expect(getSectionStatus(request, Form, 'eligibility')).toEqual('complete')
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

    expect(getSectionStatus(request, Form, 'eligibility')).toEqual('in_progress')
  })

  it('returns not_started when the session variable has no status value', () => {
    const request = createMock<Request>({
      session: {
        referralApplication: {},
      },
    })

    expect(getSectionStatus(request, Form, 'eligibility')).toEqual('not_started')
  })

  it('returns not_started when there is no session variable', () => {
    const request = createMock<Request>({
      session: {},
    })

    expect(getSectionStatus(request, Form, 'eligibility')).toEqual('not_started')
  })
})
