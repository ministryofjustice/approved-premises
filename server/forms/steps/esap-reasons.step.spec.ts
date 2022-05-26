import EsapReasonsStep from './esap-reasons.step'

describe('ApTypeStep', () => {
  describe('valid', () => {
    it('should return true with no errors if the body are valid', async () => {
      const body = {
        reasons: ['secreting'],
      }

      const step = new EsapReasonsStep(body, {})
      const valid = await step.valid()

      expect(valid).toEqual(true)
      expect(step.errorLength).toEqual(0)
    })

    it('should return true with no errors if the body are invalid', async () => {
      const body = {
        reasons: [] as Array<string>,
      }

      const step = new EsapReasonsStep(body, {})
      const valid = await step.valid()

      expect(valid).toEqual(true)
      expect(step.errorLength).toEqual(0)
    })

    it('should return false with errors if the body are empty', async () => {
      const body = {}
      const step = new EsapReasonsStep(body, {})

      const valid = await step.valid()

      expect(valid).toEqual(false)
      expect(step.errorLength).toEqual(1)
      expect(step.errors.reasons).toEqual(['You must select at least one reason'])
    })
  })

  describe('nextStep', () => {
    it('should return `room-searches` when `secreting` is in the reasons', () => {
      const body = {
        reasons: ['secreting'],
      }

      const step = new EsapReasonsStep(body, {})
      const nextStep = step.nextStep()

      expect(nextStep).toEqual('room-searches')
    })

    it('should return `cctv` when `cctv` is in the reasons, but not `secreting`', () => {
      const body = {
        reasons: ['cctv'],
      }

      const step = new EsapReasonsStep(body, {})
      const nextStep = step.nextStep()

      expect(nextStep).toEqual('cctv')
    })

    it('should return `room-searches` when `cctv` and `secreting` are in the reasons', () => {
      const body = {
        reasons: ['cctv', 'secreting'],
      }

      const step = new EsapReasonsStep(body, {})
      const nextStep = step.nextStep()

      expect(nextStep).toEqual('room-searches')
    })
  })

  describe('previousStep', () => {
    it('should return `type-of-ap`', () => {
      const step = new EsapReasonsStep({}, {})
      const previousStep = step.previousStep()

      expect(previousStep).toEqual('type-of-ap')
    })
  })

  describe('allowedToAccess', () => {
    it('it should return false when the type is undefined', () => {
      const step = new EsapReasonsStep({}, {})
      const allowedToAccess = step.allowedToAccess()

      expect(allowedToAccess).toEqual(false)
    })

    it('it should return true when the type is esap', () => {
      const step = new EsapReasonsStep({}, { type: 'esap' })
      const allowedToAccess = step.allowedToAccess()

      expect(allowedToAccess).toEqual(true)
    })

    it('it should return false when the type is standard', () => {
      const step = new EsapReasonsStep({}, { type: 'standard' })
      const allowedToAccess = step.allowedToAccess()

      expect(allowedToAccess).toEqual(false)
    })
  })
})