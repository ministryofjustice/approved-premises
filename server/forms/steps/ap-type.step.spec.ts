import { createMock, DeepMocked } from '@golevelup/ts-jest'

import { ReferralApplication } from '../referral-application.form'
import ApTypeStep from './ap-type.step'

describe('ApTypeStep', () => {
  let form: DeepMocked<ReferralApplication>

  beforeEach(() => {
    form = createMock<ReferralApplication>()
  })

  describe('valid', () => {
    it('should return true with no errors if the body are valid', async () => {
      form.request.body = {
        type: 'standard',
      }

      const step = new ApTypeStep(form)
      const valid = await step.valid()

      expect(valid).toEqual(true)
      expect(step.errorLength).toEqual(0)
    })

    it('should return false with errors if the body are empty', async () => {
      form.request.body = {}
      const step = new ApTypeStep(form)

      const valid = await step.valid()

      expect(valid).toEqual(false)
      expect(step.errorLength).toEqual(1)
      expect(step.errors.type).toEqual(['You must select a type of AP'])
    })
  })

  describe('nextStep', () => {
    it('should return undefined for a type of `standard`', () => {
      form.request.body = { type: 'standard' }

      const step = new ApTypeStep(form)
      const nextStep = step.nextStep()

      expect(nextStep).toEqual(undefined)
    })

    it('should return `opd-pathway` for a type of `pipe`', () => {
      form.request.body = { type: 'pipe' }

      const step = new ApTypeStep(form)
      const nextStep = step.nextStep()

      expect(nextStep).toEqual('opd-pathway')
    })

    it('should return `esap-reasons` for a type of `esap`', () => {
      form.request.body = { type: 'esap' }

      const step = new ApTypeStep(form)
      const nextStep = step.nextStep()

      expect(nextStep).toEqual('esap-reasons')
    })
  })

  describe('previousStep()', () => {
    it('should return `referral-reason`', () => {
      const step = new ApTypeStep(form)
      const previousStep = step.previousStep()

      expect(previousStep).toEqual('referral-reason')
    })
  })

  describe('allowedToAccess', () => {
    it('it should return false when the reason is undefined', () => {
      const step = new ApTypeStep(form)
      const allowedToAccess = step.allowedToAccess()

      expect(allowedToAccess).toEqual(false)
    })

    it('it should return true when the reason is defined', () => {
      form.sessionData = { referralReason: 'likely' }

      const step = new ApTypeStep(form)
      const allowedToAccess = step.allowedToAccess()

      expect(allowedToAccess).toEqual(true)
    })
  })
})
