import AppDataSource from '../dataSource'
import Bed from '../entity/bed'
import Booking from '../entity/booking'

const BookingCreator = {
  endTime(startTime: Date, durationInDays: number) {
    const endTime = new Date(startTime.getTime())
    endTime.setDate(startTime.getDate() + durationInDays)
    return endTime
  },

  async run(params: { durationInWeeks: string; startDate: string; bedCode: string }): Promise<Booking> {
    const startTime = new Date(params.startDate)
    const durationInDays = Number(params.durationInWeeks) * 7
    const endTime = this.endTime(startTime, durationInDays)
    const bed = await AppDataSource.getRepository(Bed).findOneBy({ bedCode: params.bedCode })

    const booking = new Booking()
    booking.bed = bed
    booking.start_time = startTime
    booking.end_time = endTime

    const createdBooking = await AppDataSource.manager.save(booking)
    return createdBooking
  },
}

export default BookingCreator
