import { loadValidationRule, loadRule, applyRule } from '../testutils/step.utils'

import cctv from './cctv.json'

describe('cctv.json', () => {
  describe('previousStep', () => {
    const rule = loadRule(cctv, 'previousStep')

    it('returns room-searches if esapReasons is secreting', () => {
      const result = applyRule(rule, { esapReasons: 'secreting' })

      expect(result).toEqual('room-searches')
    })

    it('returns esap-reasons if esapReasons is not secreting', () => {
      const result = applyRule(rule, { esapReasons: 'something-else' })

      expect(result).toEqual('esap-reasons')
    })
  })

  describe('validationRules', () => {
    describe('cctvReasons', () => {
      const rule = loadValidationRule(cctv, 'cctvReasons')

      it('returns true if the reason is present', () => {
        const result = applyRule(rule, { cctvReasons: 'someReason' })

        expect(result).toEqual(true)
      })

      it('returns an error if the reason is not present', () => {
        const result = applyRule(rule, {})

        expect(result).toEqual(
          'You must select which behaviours has Robert demonstrated that require enhanced CCTV provision to monitor'
        )
      })
    })

    describe('cctvAgencyRequest', () => {
      const rule = loadValidationRule(cctv, 'cctvAgencyRequest')

      it('returns true if cctvAgencyRequest is present', () => {
        const result = applyRule(rule, { cctvAgencyRequest: 'cctvAgencyRequest' })

        expect(result).toEqual(true)
      })

      it('returns an error if the cctvAgencyRequest is not present', () => {
        const result = applyRule(rule, {})

        expect(result).toEqual(
          'You must specify if partnership agencies have requested the sharing of intelligence captured via enhanced CCTV'
        )
      })
    })

    describe('cctvAgency', () => {
      const rule = loadValidationRule(cctv, 'cctvAgency')

      it('returns true if cctvAgencyRequest is set to no', () => {
        const result = applyRule(rule, { cctvAgencyRequest: 'no' })

        expect(result).toEqual(true)
      })

      it('returns an error if cctvAgencyRequest is set to yes and cctvAgency is not present', () => {
        const result = applyRule(rule, { cctvAgencyRequest: 'yes' })

        expect(result).toEqual('You must specify which partnership agencies have requested the sharing of intelligence')
      })

      it('returns true if cctvAgencyRequest is set to no and cctvAgency is present', () => {
        const result = applyRule(rule, { cctvAgencyRequest: 'no', cctvAgency: 'some agency' })

        expect(result).toEqual(true)
      })
    })
  })

  describe('allowedToAccess', () => {
    const rule = loadRule(cctv, 'allowedToAccess')

    it('returns true if esapReasons has cctv', () => {
      const result = applyRule(rule, { esapReasons: ['cctv'] })

      expect(result).toEqual(true)
    })

    it('returns false if esapReasons does not have cctv', () => {
      const result = applyRule(rule, { esapReasons: ['something-else'] })

      expect(result).toEqual(false)
    })
  })
})
