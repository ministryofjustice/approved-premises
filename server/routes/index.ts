import type { RequestHandler, Router } from 'express'
import { plainToClass } from 'class-transformer'

import Premises from '../entity/premises'
import Bed from '../entity/bed'
import Booking from '../entity/booking'
import SeedPremises from '../services/seedPremises'
import SeedGeolocations from '../services/seedGeolocations'
import SeedBookings from '../services/seedBookings'
import BookingCreator from '../services/bookingCreator'
import IndexBedAvailability from '../services/indexBedAvailability'
import PlacementFinder from '../services/placementFinder'
import PlacementMatcher from '../services/placementMatcher'
import AppDataSource from '../dataSource'
import asyncMiddleware from '../middleware/asyncMiddleware'
import FilterArgs from '../common/dto/filter-args'

export default function routes(router: Router): Router {
  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/', (_req, res, next) => {
    res.render('pages/index')
  })

  get('/premises', async (req, res, next) => {
    const premises = await AppDataSource.getRepository(Premises).find({
      order: {
        probationRegion: 'ASC',
        town: 'ASC',
        name: 'ASC',
      },
    })
    const bedCounts = await AppDataSource.getRepository(Premises)
      .createQueryBuilder('premises')
      .select('premises.apCode', 'apCode')
      .addSelect('COUNT(beds.id)', 'bedCount')
      .innerJoin('premises.beds', 'beds')
      .groupBy('premises.apCode')
      .getRawMany()

    // throws a error after adding the `location` field of type `geometry`
    // const apCount = await AppDataSource.getRepository(Premises).count()

    const apCount = premises.length
    const bedCount = await AppDataSource.getRepository(Bed).count()
    const apRows = premises.map(ap => {
      return [
        { text: ap.apCode },
        { text: ap.name },
        { text: ap.town },
        { text: ap.probationRegion },
        { text: ap.postcode },
        { text: [ap.lat, ap.lon] },
        { text: bedCounts.find(b => b.apCode === ap.apCode).bedCount },
      ]
    })
    res.render('pages/premisesIndex', { apCount, apRows, bedCount, csrfToken: req.csrfToken() })
  })

  post('/seed/premises', async (_req, res, next) => {
    await SeedPremises.run()
    res.redirect('/premises')
  })

  post('/seed/geolocations', async (_req, res, next) => {
    await SeedGeolocations.run()
    res.redirect('/premises')
  })

  post('/seed/bookings', async (_req, res, next) => {
    await SeedBookings.run()
    res.redirect('/bookings')
  })

  post('/index/bedAvailability', async (_req, res, next) => {
    await IndexBedAvailability.run()
    res.redirect('/bookings')
  })

  get('/placements', async (req, res, next) => {
    res.render('pages/placementsIndex', { csrfToken: req.csrfToken() })
  })

  get('/bookings/new', async (req, res, next) => {
    res.render('pages/bookingsNew', { csrfToken: req.csrfToken() })
  })

  post('/bookings', async (req, res, next) => {
    const durationInWeeks = req.body.booking.duration_in_weeks
    const bedCode = req.body.booking.bed_code
    const startDate = req.body.booking.start_date

    const creator = new BookingCreator(durationInWeeks, bedCode, startDate)
    const booking = await creator.run()
    req.flash('success', `Booking created for ${booking.bed.bedCode}`)

    res.redirect('/bookings')
  })

  get('/bookings', async (_req, res, next) => {
    const durationInWeeks = (startTime: Date, endTime: Date): number => {
      const millSecondsPerWeek = 1000 * 60 * 60 * 24 * 7
      const durationInMilliSeconds = endTime.getTime() - startTime.getTime()
      return Math.floor(durationInMilliSeconds / millSecondsPerWeek)
    }

    const bookings = await AppDataSource.getRepository(Booking).find({
      order: { start_time: 'ASC' },
      relations: {
        bed: {
          premises: true,
        },
      },
    })
    const bookingsCount = bookings.length
    const bookingRows = bookings.map(booking => {
      return [
        { text: booking.bed.premises.apCode },
        { text: booking.bed.premises.name },
        { text: booking.bed.bedCode },
        { text: booking.bed.premises.town },
        { text: booking.start_time.toDateString() },
        { text: booking.end_time.toDateString() },
        { text: durationInWeeks(booking.start_time, booking.end_time) },
      ]
    })
    res.render('pages/bookingsIndex', { bookingRows, bookingsCount })
  })

  post('/placement_search', async (req, res, next) => {
    const placeOrPostcode: string = req.body.placement_search.location
    const premises = await PlacementFinder.near(placeOrPostcode)
    const apRows = premises.map(ap => {
      return [
        { text: ap.apcode },
        { text: ap.name },
        { text: ap.town },
        { text: ap.localauthorityarea },
        { text: ap.postcode },
        { text: ap.distance.toFixed(2) },
      ]
    })
    res.render('pages/placementsIndex', { premises, apRows })
  })

  get('/match-placements', async (req, res, next) => {
    res.render('match-placements/index', { csrfToken: req.csrfToken() })
  })

  post('/match-placements', async (req, res, next) => {
    const filterArgs = plainToClass(FilterArgs, req.body.placement_search)
    const placementMatcher = new PlacementMatcher(filterArgs)
    const premises = await placementMatcher.results()
    const apRows = premises.map(ap => {
      return [
        { text: ap.premises_apCode },
        { text: ap.premises_name },
        { text: ap.premises_town },
        { text: ap.distance.toFixed(2) },
        { text: ap.enhanced_security },
        { text: ap.step_free_access_to_communal_areas },
        { text: ap.lift_or_stairlift },
        { text: ap.gender },
        { text: ap.bed_count || 'N/A', attributes: { 'data-bed-count': '' } },
        { text: ap.score },
      ]
    })
    res.render('match-placements/index', { premises, apRows, filterArgs })
  })

  get('/risks/summary', (req, res, next) => {
    const risks = {
      risks: {
        mappa: {
          level: 'CAT 2/LEVEL 1',
          isNominal: false,
          lastUpdated: '10th October 2021',
        },
        flags: ['Hate Crime'],
        roshRiskSummary: {
          overallRisk: 'VERY_HIGH',
          riskToChildren: 'LOW',
          riskToPublic: 'VERY_HIGH',
          riskToKnownAdult: 'MEDIUM',
          riskToStaff: 'HIGH',
          lastUpdated: '10th October 2021',
        },
      },
    }

    res.render('pages/riskSummary', risks)
  })

  get('/risks/predictors', (req, res, next) => {
    const predictorScores = {
      current: {
        date: '23 Jul 2021 at 12:00:00',
        scores: {
          RSR: {
            level: 'HIGH',
            score: 11.34,
            type: 'RSR',
          },
          OSPC: {
            level: 'MEDIUM',
            score: 8.76,
            type: 'OSP/C',
          },
          OSPI: {
            level: 'LOW',
            score: 3.45,
            type: 'OSP/I',
          },
        },
      },
      historical: [
        {
          scores: {
            RSR: {
              level: 'HIGH',
              score: 10.3,
              type: 'RSR',
            },
            OSPC: {
              level: 'MEDIUM',
              score: 7.76,
              type: 'OSP/C',
            },
            OSPI: {
              level: 'LOW',
              score: 3.45,
              type: 'OSP/I',
            },
          },
        },
        {
          scores: {
            RSR: {
              level: 'MEDIUM',
              score: 5.34,
              type: 'RSR',
            },
            OSPC: {
              level: 'MEDIUM',
              score: 6.76,
              type: 'OSP/C',
            },
            OSPI: {
              level: 'LOW',
              score: 3.45,
              type: 'OSP/I',
            },
          },
        },
      ],
    }

    res.render('pages/riskPredictors', { predictorScores })
  })

  return router
}
