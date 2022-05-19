import { ReferralApplication } from './referral-application.form'

describe('ReferralApplicationForm', () => {
  describe('validForCurrentStep', () => {
    describe('with a referral reason', () => {
      it('should return true with no errors if the params are valid', async () => {
        const params = {
          reason: 'likely',
        }

        const application = new ReferralApplication('referral-reason', params)
        const valid = await application.validForCurrentStep()

        expect(valid).toEqual(true)
        expect(application.errorLength()).toEqual(0)
      })

      it('should return false with errors if the params are empty', async () => {
        const params = {}
        const application = new ReferralApplication('referral-reason', params)

        const valid = await application.validForCurrentStep()

        expect(valid).toEqual(false)
        expect(application.errorLength()).toEqual(1)
        expect(application.errors['reason']).toEqual(['You must select a reason'])
      })

      it('should validate for the presence of `other` if the reason is `other`', async () => {
        const params = {
          reason: 'other',
        }

        const application = new ReferralApplication('referral-reason', params)

        const valid = await application.validForCurrentStep()

        expect(valid).toEqual(false)
        expect(application.errorLength()).toEqual(1)
        expect(application.errors['other']).toEqual(['You must specify what your other reason is'])
      })
    })

    describe('with an AP type', () => {
      it('should return true with no errors if the params are valid', async () => {
        const params = {
          type: 'standard',
        }

        const application = new ReferralApplication('type-of-ap', params)
        const valid = await application.validForCurrentStep()

        expect(valid).toEqual(true)
        expect(application.errorLength()).toEqual(0)
      })

      it('should return false with errors if the params are empty', async () => {
        const params = {}
        const application = new ReferralApplication('type-of-ap', params)

        const valid = await application.validForCurrentStep()

        expect(valid).toEqual(false)
        expect(application.errorLength()).toEqual(1)
        expect(application.errors['type']).toEqual(['You must select a type of AP'])
      })
    })
  })

  describe('nextStep', () => {
    describe('with a referral reason', () => {
      it('it should return `type-of-ap` when there is not `no-reason`', () => {
        const application = new ReferralApplication('referral-reason', { reason: 'likely' })
        const nextStep = application.nextStep()

        expect(nextStep).toEqual('type-of-ap')
      })

      it('it should return `not-eligible` when there is `no-reason`', () => {
        const application = new ReferralApplication('referral-reason', { reason: 'no-reason' })
        const nextStep = application.nextStep()

        expect(nextStep).toEqual('not-eligible')
      })
    })
  })

  describe('with an AP type', () => {
    it('should return `enhanced-risk` for a type of `standard`', () => {
      const application = new ReferralApplication('type-of-ap', { type: 'standard' })
      const nextStep = application.nextStep()

      expect(nextStep).toEqual('enhanced-risk')
    })

    it('should return `opd-pathway` for a type of `pipe`', () => {
      const application = new ReferralApplication('type-of-ap', { type: 'pipe' })
      const nextStep = application.nextStep()

      expect(nextStep).toEqual('opd-pathway')
    })

    it('should return `esap-reasons` for a type of `esap`', () => {
      const application = new ReferralApplication('type-of-ap', { type: 'esap' })
      const nextStep = application.nextStep()

      expect(nextStep).toEqual('esap-reasons')
    })
  })
})
