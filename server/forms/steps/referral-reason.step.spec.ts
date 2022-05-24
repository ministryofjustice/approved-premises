import ReferralReason from './referral-reason.step'

describe('ReferralReason', () => {
  describe('valid', () => {
    it('should return true with no errors if the params are valid', async () => {
      const params = {
        reason: 'likely',
      }

      const step = new ReferralReason(params)
      const valid = await step.valid()

      expect(valid).toEqual(true)
      expect(step.errorLength).toEqual(0)
    })

    it('should return false with errors if the params are empty', async () => {
      const params = {}
      const step = new ReferralReason(params)

      const valid = await step.valid()

      expect(valid).toEqual(false)
      expect(step.errorLength).toEqual(1)
      expect(step.errors.reason).toEqual(['You must select a reason'])
    })

    it('should validate for the presence of `other` if the reason is `other`', async () => {
      const params = {
        reason: 'other',
      }

      const step = new ReferralReason(params)

      const valid = await step.valid()

      expect(valid).toEqual(false)
      expect(step.errorLength).toEqual(1)
      expect(step.errors.other).toEqual(['You must specify what your other reason is'])
    })
  })

  describe('nextStep', () => {
    describe('with a referral reason', () => {
      it('it should return `type-of-ap` when there is not `no-reason`', () => {
        const step = new ReferralReason({ reason: 'likely' })
        const nextStep = step.nextStep()

        expect(nextStep).toEqual('type-of-ap')
      })

      it('it should return `not-eligible` when there is `no-reason`', () => {
        const step = new ReferralReason({ reason: 'no-reason' })
        const nextStep = step.nextStep()

        expect(nextStep).toEqual('not-eligible')
      })
    })
  })

  describe('previousStep', () => {
    it('it should return undefined', () => {
      const step = new ReferralReason({ reason: 'no-reason' })
      const previousStep = step.previousStep()

      expect(previousStep).toEqual(undefined)
    })
  })

  describe('allowedToAccess', () => {
    it('it should return true', () => {
      const step = new ReferralReason({ reason: 'no-reason' })
      const allowedToAccess = step.allowedToAccess()

      expect(allowedToAccess).toEqual(true)
    })
  })
})
