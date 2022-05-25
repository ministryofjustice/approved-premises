import RoomSearches from './room-searches.step'

describe('RoomSearches', () => {
  describe('valid', () => {
    it('should return true with no errors if the params are valid', async () => {
      const body = {
        items: ['radicalisation', 'hate-crime'],
        agencyRequest: 'yes',
        agency: 'some agency',
        supportingInformation: 'supporting',
      }

      const step = new RoomSearches(body, {})
      const valid = await step.valid()

      expect(valid).toEqual(true)
      expect(step.errorLength).toEqual(0)
    })

    it('should return false with errors if the params are empty', async () => {
      const body = {}
      const step = new RoomSearches(body, {})

      const valid = await step.valid()

      expect(valid).toEqual(false)
      expect(step.errorLength).toEqual(2)

      expect(step.errors.items).toEqual([
        'You must select at least one item type that Robert has a history of secreting',
      ])
      expect(step.errors.agencyRequest).toEqual([
        'You must specify if partnership agencies have requested the sharing of intelligence captured via body worn technology',
      ])
    })

    it('should return false with errors if agency request `yes` and agency is blank', async () => {
      const body = {
        items: ['radicalisation', 'hate-crime'],
        agencyRequest: 'yes',
      }

      const step = new RoomSearches(body, {})

      const valid = await step.valid()

      expect(valid).toEqual(false)
      expect(step.errorLength).toEqual(1)

      expect(step.errors.agency).toEqual([
        'You must specify which partnership agencies have requested the sharing of intelligence',
      ])
    })
  })

  describe('nextStep', () => {
    it('should return CCTV if the CCTV option was previously selected', () => {
      const step = new RoomSearches({}, { reasons: ['cctv'] })

      const nextStep = step.nextStep()

      expect(nextStep).toEqual('cctv')
    })

    it('should return CCTV if the CCTV option was not previously selected', () => {
      const step = new RoomSearches({}, {})

      const nextStep = step.nextStep()

      expect(nextStep).toEqual(undefined)
    })
  })

  describe('previousStep', () => {
    it('it should return undefined', () => {
      const step = new RoomSearches({}, {})
      const previousStep = step.previousStep()

      expect(previousStep).toEqual('esap-reasons')
    })
  })

  describe('allowedToAccess', () => {
    it('it should return true if the secreting question was previously selected', () => {
      const step = new RoomSearches({}, { reasons: ['secreting'] })
      const allowedToAccess = step.allowedToAccess()

      expect(allowedToAccess).toEqual(true)
    })

    it('it should return false if the secreting question was not previously selected', () => {
      const step = new RoomSearches({}, { reasons: ['cctv'] })
      const allowedToAccess = step.allowedToAccess()

      expect(allowedToAccess).toEqual(false)
    })

    it('it should return false if the session is blank', () => {
      const step = new RoomSearches({}, {})
      const allowedToAccess = step.allowedToAccess()

      expect(allowedToAccess).toEqual(false)
    })
  })
})
