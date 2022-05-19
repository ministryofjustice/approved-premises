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
  })
})
