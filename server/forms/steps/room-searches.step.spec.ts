import { createMock, DeepMocked } from '@golevelup/ts-jest'

import RoomSearches from './room-searches.step'
import { ReferralApplication } from '../referral-application.form'

describe('RoomSearches', () => {
  let form: DeepMocked<ReferralApplication>

  beforeEach(() => {
    form = createMock<ReferralApplication>()
  })

  describe('valid', () => {
    it('should return true with no errors if the params are valid', async () => {
      form.request.body = {
        items: ['radicalisation', 'hate-crime'],
        agencyRequest: 'yes',
        agency: 'some agency',
        supportingInformation: 'supporting',
      }

      const step = new RoomSearches(form)
      const valid = await step.valid()

      expect(valid).toEqual(true)
      expect(step.errorLength).toEqual(0)
    })

    it('should return false with errors if the params are empty', async () => {
      form.request.body = {}
      const step = new RoomSearches(form)

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
      form.request.body = {
        items: ['radicalisation', 'hate-crime'],
        agencyRequest: 'yes',
      }

      const step = new RoomSearches(form)

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
      form.sessionData = { reasons: ['cctv'] }

      const step = new RoomSearches(form)

      const nextStep = step.nextStep()

      expect(nextStep).toEqual('cctv')
    })

    it('should return CCTV if the CCTV option was not previously selected', () => {
      form.sessionData = {}

      const step = new RoomSearches(form)

      const nextStep = step.nextStep()

      expect(nextStep).toEqual(undefined)
    })
  })

  describe('previousStep', () => {
    it('it should return undefined', () => {
      form.sessionData = {}

      const step = new RoomSearches(form)

      const previousStep = step.previousStep()

      expect(previousStep).toEqual('esap-reasons')
    })
  })

  describe('allowedToAccess', () => {
    it('it should return true if the secreting question was previously selected', () => {
      form.sessionData = { reasons: ['secreting'] }

      const step = new RoomSearches(form)
      const allowedToAccess = step.allowedToAccess()

      expect(allowedToAccess).toEqual(true)
    })

    it('it should return false if the secreting question was not previously selected', () => {
      form.sessionData = { reasons: ['cctv'] }

      const step = new RoomSearches(form)
      const allowedToAccess = step.allowedToAccess()

      expect(allowedToAccess).toEqual(false)
    })

    it('it should return false if the session is blank', () => {
      form.sessionData = {}

      const step = new RoomSearches(form)
      const allowedToAccess = step.allowedToAccess()

      expect(allowedToAccess).toEqual(false)
    })
  })
})
