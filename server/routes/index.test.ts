import type { Express } from 'express'
import { JSDOM } from 'jsdom'
import { Repository } from 'typeorm'

import request from 'supertest'
import appWithAllRoutes from './testutils/appSetup'

import AppDataSource from '../dataSource'
import Premises from '../entity/premises'
import Bed from '../entity/bed'
import IndexBedAvailability from '../services/indexBedAvailability'

import bedFactory from './testutils/factories/bed'
import premisesFactory from './testutils/factories/premises'
import bookingFactory from './testutils/factories/booking'

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({})
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /', () => {
  it('should render index page', () => {
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Apply for an Approved Premises')
      })
  })
})

describe('POST /match-placements', () => {
  let premisesRepository: Repository<Premises>
  let bedRepository: Repository<Bed>

  beforeEach(async () => {
    await AppDataSource.initialize()

    premisesRepository = AppDataSource.getRepository(Premises)
    bedRepository = AppDataSource.getRepository(Bed)
  })

  afterEach(async () => {
    await AppDataSource.destroy()
  })

  it('should priotise premises within a 50 mile radius', async () => {
    const closePremises = premisesFactory.build({ name: 'Close Premises', lat: 53.75397, lon: -2.70342 })
    const farAwayPremises = premisesFactory.build({
      name: 'Far Away Premises',
      lat: 51.4082158,
      lon: -0.034447838,
    })

    const closeBed = bedFactory.build({ premises: closePremises })
    const farAwayBed = bedFactory.build({ premises: farAwayPremises })

    await premisesRepository.save([closePremises, farAwayPremises])
    await bedRepository.save([closeBed, farAwayBed])

    await IndexBedAvailability.run()

    return request(app)
      .post('/match-placements')
      .send({ placement_search: { location: 'Some location' } })
      .expect('Content-Type', /html/)
      .expect(res => {
        const dom = new JSDOM(res.text)

        const results = dom.window.document.querySelectorAll('table tbody tr')

        expect(results[0].textContent).toContain('Close Premises')
        expect(results[1].textContent).toContain('Far Away Premises')
      })
  })

  it('should prioritise premised with the correct facilities', async () => {
    const closeBed = bedFactory.build({ lift_or_stairlift: true })
    const closerBed = bedFactory.build({ lift_or_stairlift: false })

    const closePremisesWithFacility = premisesFactory.build({
      name: 'Close Premises',
      lat: 53.75397,
      lon: -2.70342,
      beds: [closeBed],
    })
    const closerPremisesWithoutFacility = premisesFactory.build({
      name: 'Closer Premises',
      lat: 53.7901124,
      lon: -1.560001909,
      beds: [closerBed],
    })

    await premisesRepository.save([closePremisesWithFacility, closerPremisesWithoutFacility])

    await IndexBedAvailability.run()

    return request(app)
      .post('/match-placements')
      .send({ placement_search: { location: 'Some location', requirements: ['bed.lift_or_stairlift'] } })
      .expect('Content-Type', /html/)
      .expect(res => {
        const dom = new JSDOM(res.text)

        expect(res.text).not.toContain('Closer Premises')

        const results = dom.window.document.querySelectorAll('table tbody tr')

        expect(results[0].textContent).toContain('Close Premises')
      })
  })

  it('should prioritise premises with available beds for a given period', async () => {
    const booking1 = bookingFactory.build({ start_time: new Date('2022-07-01'), end_time: new Date('2022-08-01') })
    const booking2 = bookingFactory.build({ start_time: new Date('2022-08-01'), end_time: new Date('2022-11-01') })

    const bed1 = bedFactory.build({ bookings: [booking1] })
    const bed2 = bedFactory.build({ bookings: [booking2] })

    // Has space but is further away
    const premisesWithAvailableSpace = premisesFactory.build({
      name: 'Premises with available space',
      beds: [bed1],
      lat: 53.75397,
      lon: -2.70342,
    })

    // Does not have space, but is closer
    const premisesWithoutAvailableSpace = premisesFactory.build({
      name: 'Premises without available space',
      beds: [bed2],
      lat: 53.7901124,
      lon: -1.560001909,
    })

    await premisesRepository.save([premisesWithAvailableSpace, premisesWithoutAvailableSpace])

    await IndexBedAvailability.run()

    return request(app)
      .post('/match-placements')
      .send({
        placement_search: {
          location: 'Some location',
          date_from: { day: 1, month: 9, year: 2022 },
          date_to: { day: 1, month: 10, year: 2022 },
        },
      })
      .expect('Content-Type', /html/)
      .expect(res => {
        const dom = new JSDOM(res.text)

        const results = dom.window.document.querySelectorAll('table tbody tr')

        expect(results.length).toEqual(2)

        expect(results[0].textContent).toContain('Premises with available space')
        expect(results[1].textContent).toContain('Premises without available space')
      })
  })
})
