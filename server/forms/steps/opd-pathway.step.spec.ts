import OpdPathwayStep from './opd-pathway.step'

describe('OpdPathwayStep', () => {
  describe('valid', () => {
    it('should return true if the screening has NOT taken place', async () => {
      const body = {
        is_opd_pathway_screened: 'no',
      }

      const step = new OpdPathwayStep(body, {})
      const valid = await step.valid()

      expect(valid).toEqual(true)
      expect(step.errorLength).toEqual(0)
    })

    it('should return true if the screening HAS taken place and a date is supplied', async () => {
      const body = {
        is_opd_pathway_screened: 'yes',
        lastOpdDate: '2021-11-17',
      }

      const step = new OpdPathwayStep(body, {})
      const valid = await step.valid()

      expect(valid).toEqual(true)
      expect(step.errorLength).toEqual(0)
    })

    it('should return false if the screening HAS taken place and a date is NOT supplied', async () => {
      const body = {
        is_opd_pathway_screened: 'yes',
        lastOpdDate: '--',
      }

      const step = new OpdPathwayStep(body, {})
      const valid = await step.valid()

      expect(valid).toEqual(false)
      expect(step.errorLength).toEqual(1)
      expect(step.errors.lastOpdDate).toEqual(['You must provide the date of the last consultation or formulation'])
    })

    it('should return false if the screening HAS taken place and a date is invalid', async () => {
      const body = {
        is_opd_pathway_screened: 'yes',
        lastOpdDate: '33-23-2022',
      }

      const step = new OpdPathwayStep(body, {})
      const valid = await step.valid()

      expect(valid).toEqual(false)
      expect(step.errorLength).toEqual(1)
      expect(step.errors.lastOpdDate).toEqual(['You must provide the date of the last consultation or formulation'])
    })

    it('should return false with errors if the body are empty', async () => {
      const body = {}
      const step = new OpdPathwayStep(body, {})

      const valid = await step.valid()

      expect(valid).toEqual(false)
      expect(step.errorLength).toEqual(1)
      expect(step.errors.is_opd_pathway_screened).toEqual([
        'You must indicate whether the person has been screened into the OPD pathway',
      ])
    })
  })

  describe('nextStep', () => {
    it('should return undefined', () => {
      const step = new OpdPathwayStep({ is_opd_pathway_screened: 'yes' }, {})
      const nextStep = step.nextStep()

      expect(nextStep).toEqual(undefined)
    })
  })

  describe('previousStep()', () => {
    it('should return `type-of-ap`', () => {
      const step = new OpdPathwayStep({}, {})
      const previousStep = step.previousStep()

      expect(previousStep).toEqual('type-of-ap')
    })
  })

  describe('allowedToAccess', () => {
    it('it should return false when the type-of-ap is undefined', () => {
      const step = new OpdPathwayStep({}, {})
      const allowedToAccess = step.allowedToAccess()

      expect(allowedToAccess).toEqual(false)
    })

    it('it should return false when the type-of-ap is not "pipe"', () => {
      const step = new OpdPathwayStep({}, { type: 'esap' })
      const allowedToAccess = step.allowedToAccess()

      expect(allowedToAccess).toEqual(false)
    })

    it('it should return true when the type-of-ap is defined', () => {
      const step = new OpdPathwayStep({}, { type: 'pipe' })
      const allowedToAccess = step.allowedToAccess()

      expect(allowedToAccess).toEqual(true)
    })
  })
})
