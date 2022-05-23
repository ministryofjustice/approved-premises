import ApTypeStep from './ap-type.step'

describe('ApTypeStep', () => {
  describe('valid', () => {
    it('should return true with no errors if the params are valid', async () => {
      const params = {
        type: 'standard',
      }

      const step = new ApTypeStep(params)
      const valid = await step.valid()

      expect(valid).toEqual(true)
      expect(step.errorLength).toEqual(0)
    })

    it('should return false with errors if the params are empty', async () => {
      const params = {}
      const step = new ApTypeStep(params)

      const valid = await step.valid()

      expect(valid).toEqual(false)
      expect(step.errorLength).toEqual(1)
      expect(step.errors['type']).toEqual(['You must select a type of AP'])
    })
  })

  describe('nextStep', () => {
    it('should return `enhanced-risk` for a type of `standard`', () => {
      const step = new ApTypeStep({ type: 'standard' })
      const nextStep = step.nextStep()

      expect(nextStep).toEqual('enhanced-risk')
    })

    it('should return `opd-pathway` for a type of `pipe`', () => {
      const step = new ApTypeStep({ type: 'pipe' })
      const nextStep = step.nextStep()

      expect(nextStep).toEqual('opd-pathway')
    })

    it('should return `esap-reasons` for a type of `esap`', () => {
      const step = new ApTypeStep({ type: 'esap' })
      const nextStep = step.nextStep()

      expect(nextStep).toEqual('esap-reasons')
    })
  })

  describe('previousStep()', () => {
    it('should return `referral-reason`', () => {
      const step = new ApTypeStep({})
      const previousStep = step.previousStep()

      expect(previousStep).toEqual('referral-reason')
    })
  })

  describe('allowedToAccess', () => {
    it('it should return false when the reason is undefined', () => {
      const step = new ApTypeStep({})
      const allowedToAccess = step.allowedToAccess({})

      expect(allowedToAccess).toEqual(false)
    })

    it('it should return true when the reason is defined', () => {
      const step = new ApTypeStep({})
      const allowedToAccess = step.allowedToAccess({ reason: 'likely' })

      expect(allowedToAccess).toEqual(true)
    })
  })
})
