import NotEligibleStep from './not-eligible.step'

describe('NotEligibleSep', () => {
  describe('valid', () => {
    it('should return true', async () => {
      const step = new NotEligibleStep({})
      const valid = await step.valid()

      expect(valid).toEqual(true)
      expect(step.errorLength).toEqual(undefined)
    })
  })

  describe('nextStep', () => {
    it('should return undefined', () => {
      const step = new NotEligibleStep({})
      const nextStep = step.nextStep()

      expect(nextStep).toEqual(undefined)
    })
  })

  describe('previousStep', () => {
    it('should return `referral-reason`', () => {
      const step = new NotEligibleStep({})
      const previousStep = step.previousStep()

      expect(previousStep).toEqual('referral-reason')
    })
  })

  describe('allowedToAccess', () => {
    it('it should return false when the reason is undefined', () => {
      const step = new NotEligibleStep({})
      const allowedToAccess = step.allowedToAccess({})

      expect(allowedToAccess).toEqual(false)
    })

    it('it should return true when the reason is defined', () => {
      const step = new NotEligibleStep({})
      const allowedToAccess = step.allowedToAccess({ reason: 'likely' })

      expect(allowedToAccess).toEqual(true)
    })
  })
})
