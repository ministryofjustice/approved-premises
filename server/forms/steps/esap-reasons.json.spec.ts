import { loadRule, applyRule, loadValidationRule } from '../testutils/step.utils'

import esapReasons from './esap-reasons.json'

describe('esap-reasons.json', () => {
  describe('nextStep', () => {
    const rule = loadRule(esapReasons, 'nextStep')

    it('returns room-searches if esapReasons includes secreting', () => {
      const result = applyRule(rule, { esapReasons: ['secreting'] })

      expect(result).toEqual('room-searches')
    })

    it('returns cctv if esapReasons includes cctv', () => {
      const result = applyRule(rule, { esapReasons: ['cctv'] })

      expect(result).toEqual('cctv')
    })

    it('returns room-searches if esapReasons includes secreting and cctv', () => {
      const result = applyRule(rule, { esapReasons: ['secreting', 'cctv'] })

      expect(result).toEqual('room-searches')
    })
  })

  describe('validationRules', () => {
    describe('cctvReasons', () => {
      const rule = loadValidationRule(esapReasons, 'esapReasons')

      it('returns true if the esapReasons is present', () => {
        const result = applyRule(rule, { esapReasons: 'someReason' })

        expect(result).toEqual(true)
      })

      it('returns an error if esapReasons is not present', () => {
        const result = applyRule(rule, {})

        expect(result).toEqual('You must select at least one reason')
      })
    })
  })

  describe('allowedToAccess', () => {
    const rule = loadRule(esapReasons, 'allowedToAccess')

    it('returns true if the type is esap', () => {
      const result = applyRule(rule, { type: 'esap' })

      expect(result).toEqual(true)
    })

    it('returns false if the type is esap', () => {
      const result = applyRule(rule, { type: 'something-else' })

      expect(result).toEqual(false)
    })
  })
})
