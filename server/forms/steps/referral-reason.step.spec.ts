import { createMock, DeepMocked } from '@golevelup/ts-jest'

import ReferralReason from './referral-reason.step'
import { ReferralApplication } from '../referral-application.form'

describe('ReferralReason', () => {
  let form: DeepMocked<ReferralApplication>

  beforeEach(() => {
    form = createMock<ReferralApplication>()
  })

  describe('valid', () => {
    it('should return true with no errors if the params are valid', async () => {
      form.request.body = {
        referralReason: 'likely' as const,
      }

      const step = new ReferralReason(form)
      const valid = await step.valid()

      expect(valid).toEqual(true)
      expect(step.errorLength).toEqual(0)
    })

    it('should return false with errors if the params are empty', async () => {
      form.request.body = {}
      const step = new ReferralReason(form)

      const valid = await step.valid()

      expect(valid).toEqual(false)
      expect(step.errorLength).toEqual(1)
      expect(step.errors.referralReason).toEqual(['You must select a reason'])
    })

    it('should validate for the presence of `other` if the reason is `other`', async () => {
      form.request.body = {
        referralReason: 'other' as const,
      }

      const step = new ReferralReason(form)

      const valid = await step.valid()

      expect(valid).toEqual(false)
      expect(step.errorLength).toEqual(1)
      expect(step.errors.other).toEqual(['You must specify what your other reason is'])
    })
  })

  describe('nextStep', () => {
    describe('with a referral reason', () => {
      it('it should return undefined when there is not `no-reason`', () => {
        form.request.body = { referralReason: 'likely' }

        const step = new ReferralReason(form)
        const nextStep = step.nextStep()

        expect(nextStep).toEqual(undefined)
      })

      it('it should return `not-eligible` when there is `no-reason`', () => {
        form.request.body = { referralReason: 'no-reason' }

        const step = new ReferralReason(form)
        const nextStep = step.nextStep()

        expect(nextStep).toEqual('not-eligible')
      })
    })
  })

  describe('previousStep', () => {
    it('it should return undefined', () => {
      const step = new ReferralReason(form)
      const previousStep = step.previousStep()

      expect(previousStep).toEqual(undefined)
    })
  })

  describe('allowedToAccess', () => {
    it('it should return true', () => {
      const step = new ReferralReason(form)
      const allowedToAccess = step.allowedToAccess()

      expect(allowedToAccess).toEqual(true)
    })
  })
})
