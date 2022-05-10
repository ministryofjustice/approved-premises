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
})
