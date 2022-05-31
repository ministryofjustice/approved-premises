import { createMock, DeepMocked } from '@golevelup/ts-jest'

import { ReferralApplication } from '../referral-application.form'
import EsapReasonsStep from './esap-reasons.step'

describe('ApTypeStep', () => {
  let form: DeepMocked<ReferralApplication>

  beforeEach(() => {
    form = createMock<ReferralApplication>()
  })

  describe('valid', () => {
    it('should return true with no errors if the body are valid', async () => {
      form.request.body = {
        esapReasons: ['secreting'],
      }

      const step = new EsapReasonsStep(form)
      const valid = await step.valid()

      expect(valid).toEqual(true)
      expect(step.errorLength).toEqual(0)
    })

    it('should return true with no errors if the body are invalid', async () => {
      form.request.body = {
        esapReasons: [] as Array<string>,
      }

      const step = new EsapReasonsStep(form)
      const valid = await step.valid()

      expect(valid).toEqual(true)
      expect(step.errorLength).toEqual(0)
    })

    it('should return false with errors if the body are empty', async () => {
      form.request.body = {}
      const step = new EsapReasonsStep(form)

      const valid = await step.valid()

      expect(valid).toEqual(false)
      expect(step.errorLength).toEqual(1)
      expect(step.errors.esapReasons).toEqual(['You must select at least one reason'])
    })
  })

  describe('nextStep', () => {
    it('should return `room-searches` when `secreting` is in the reasons', () => {
      form.request.body = {
        esapReasons: ['secreting'],
      }

      const step = new EsapReasonsStep(form)
      const nextStep = step.nextStep()

      expect(nextStep).toEqual('room-searches')
    })

    it('should return `cctv` when `cctv` is in the reasons, but not `secreting`', () => {
      form.request.body = {
        esapReasons: ['cctv'],
      }

      const step = new EsapReasonsStep(form)
      const nextStep = step.nextStep()

      expect(nextStep).toEqual('cctv')
    })

    it('should return `room-searches` when `cctv` and `secreting` are in the reasons', () => {
      form.request.body = {
        esapReasons: ['cctv', 'secreting'],
      }

      const step = new EsapReasonsStep(form)
      const nextStep = step.nextStep()

      expect(nextStep).toEqual('room-searches')
    })
  })

  describe('previousStep', () => {
    it('should return `type-of-ap`', () => {
      const step = new EsapReasonsStep(form)
      const previousStep = step.previousStep()

      expect(previousStep).toEqual('type-of-ap')
    })
  })

  describe('allowedToAccess', () => {
    it('it should return false when the type is undefined', () => {
      const step = new EsapReasonsStep(form)
      const allowedToAccess = step.allowedToAccess()

      expect(allowedToAccess).toEqual(false)
    })

    it('it should return true when the type is esap', () => {
      form.sessionData = { type: 'esap' }

      const step = new EsapReasonsStep(form)
      const allowedToAccess = step.allowedToAccess()

      expect(allowedToAccess).toEqual(true)
    })

    it('it should return false when the type is standard', () => {
      form.sessionData = { type: 'standard' }

      const step = new EsapReasonsStep(form)
      const allowedToAccess = step.allowedToAccess()

      expect(allowedToAccess).toEqual(false)
    })
  })
})
