import { Router } from 'express'

import { get, post } from './index'
import Booking from '../entity/booking'
import BookingCreator from '../services/bookingCreator'
import AppDataSource from '../dataSource'

export default function BookingRoutes(router: Router): Router {
  get(router, '/bookings/new', async (req, res, next) => {
    res.render('pages/bookingsNew')
  })

  post(router, '/bookings', async (req, res, next) => {
    const durationInWeeks = req.body.booking.duration_in_weeks
    const bedCode = req.body.booking.bed_code
    const startDate = req.body.booking.start_date

    const creator = new BookingCreator(durationInWeeks, bedCode, startDate)
    const booking = await creator.run()
    req.flash('success', `Booking created for ${booking.bed.bedCode}`)

    res.redirect('/bookings')
  })

  get(router, '/bookings', async (_req, res, next) => {
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

  return router
}
