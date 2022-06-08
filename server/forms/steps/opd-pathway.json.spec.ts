import { applyRule, loadValidationRule } from '../testutils/step.utils'

import opdPathway from './opd-pathway.json'

describe('opd-pathway.json', () => {
  describe('validationRules', () => {
    describe('is_opd_pathway_screened', () => {
      const rule = loadValidationRule(opdPathway, 'is_opd_pathway_screened')

      it('returns true if is_opd_pathway_screened is selected', () => {
        const result = applyRule(rule, { is_opd_pathway_screened: 'yes' })

        expect(result).toEqual(true)
      })

      it('returns an error if is_opd_pathway_screened is not selected', () => {
        const result = applyRule(rule, {})

        expect(result).toEqual('You must indicate whether the person has been screened into the OPD pathway')
      })
    })

    describe('lastOpdDate', () => {
      const rule = loadValidationRule(opdPathway, 'lastOpdDate')

      it('returns true if is_opd_pathway_screened is set to no', () => {
        const result = applyRule(rule, { is_opd_pathway_screened: 'no' })

        expect(result).toEqual(true)
      })

      it('returns an error if is_opd_pathway_screened is set to yes and the date is missing', () => {
        const result = applyRule(rule, { is_opd_pathway_screened: 'yes' })

        expect(result).toEqual('You must provide the date of the last consultation or formulation')
      })

      it('returns an error if is_opd_pathway_screened is set to yes and the date is invalid', () => {
        const result = applyRule(rule, {
          is_opd_pathway_screened: 'yes',
          'lastOpdDate-year': 99,
          'lastOpdDate-month': 99,
          'lastOpdDate-day': 99,
        })

        expect(result).toEqual('You must provide the date of the last consultation or formulation')
      })

      it('returns true if is_opd_pathway_screened is set to yes and the date is valid', () => {
        const result = applyRule(rule, {
          is_opd_pathway_screened: 'yes',
          'lastOpdDate-year': 2020,
          'lastOpdDate-month': 11,
          'lastOpdDate-day': 11,
        })

        expect(result).toEqual(true)
      })
    })
  })
})
