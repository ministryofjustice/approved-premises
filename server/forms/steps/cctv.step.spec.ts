import CCTVStep from './cctv.step'

describe('CCTVStep', () => {
  describe('valid', () => {
    it('should return true with no errors if the params are valid', async () => {
      const body = {
        cctvReasons: ['appearance', 'networks'],
        cctvAgencyRequest: 'yes',
        cctvAgency: 'some agency',
        cctvSupportingInformation: 'supporting',
      }

      const step = new CCTVStep(body, {})
      const valid = await step.valid()

      expect(valid).toEqual(true)
      expect(step.errorLength).toEqual(0)
    })

    it('should return false with errors if the params are empty', async () => {
      const body = {}
      const step = new CCTVStep(body, {})

      const valid = await step.valid()

      expect(valid).toEqual(false)
      expect(step.errorLength).toEqual(2)

      expect(step.errors.cctvReasons).toEqual([
        'You must select which behaviours has Robert demonstrated that require enhanced CCTV provision to monitor',
      ])
      expect(step.errors.cctvAgencyRequest).toEqual([
        'You must specify if partnership agencies have requested the sharing of intelligence captured via enhanced CCTV',
      ])
    })

    it('should return false with errors if agency request `yes` and agency is blank', async () => {
      const body = {
        cctvReasons: ['appearance', 'networks'],
        cctvAgencyRequest: 'yes',
      }

      const step = new CCTVStep(body, {})

      const valid = await step.valid()

      expect(valid).toEqual(false)
      expect(step.errorLength).toEqual(1)

      expect(step.errors.cctvAgency).toEqual([
        'You must specify which partnership agencies have requested the sharing of intelligence',
      ])
    })
  })

  describe('nextStep', () => {
    it('should return undefined', () => {
      const step = new CCTVStep({}, {})

      const nextStep = step.nextStep()

      expect(nextStep).toEqual(undefined)
    })
  })

  describe('previousStep', () => {
    it('should return `room-searches` if the reasons for an esap included `secreting`', () => {
      const step = new CCTVStep({}, { reasons: ['secreting'] })

      const previousStep = step.previousStep()

      expect(previousStep).toEqual('room-searches')
    })

    it('should return `room-searches` if the reasons for an esap did not include `secreting`', () => {
      const step = new CCTVStep({}, { reasons: ['cctv'] })

      const previousStep = step.previousStep()

      expect(previousStep).toEqual('esap-reasons')
    })
  })

  describe('allowedToAccess', () => {
    it('it should return true if the cctv question was previously selected', () => {
      const step = new CCTVStep({}, { reasons: ['cctv'] })
      const allowedToAccess = step.allowedToAccess()

      expect(allowedToAccess).toEqual(true)
    })

    it('it should return false if the cctv question was not previously selected', () => {
      const step = new CCTVStep({}, { reasons: ['secreting'] })
      const allowedToAccess = step.allowedToAccess()

      expect(allowedToAccess).toEqual(false)
    })

    it('it should return false if the session is blank', () => {
      const step = new CCTVStep({}, {})
      const allowedToAccess = step.allowedToAccess()

      expect(allowedToAccess).toEqual(false)
    })
  })
})
