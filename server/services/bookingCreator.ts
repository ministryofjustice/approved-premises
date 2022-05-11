import AppDataSource from '../dataSource'
import Bed from '../entity/bed'
import Booking from '../entity/booking'

class BookingCreator {
  constructor(private durationInWeeks: string, private bedCode: string, private startDate: string) {}

  startTime() {
    return new Date(this.startDate)
  }

  endTime() {
    const durationInDays = Number(this.durationInWeeks) * 7
    const endTime = new Date(this.startTime().getTime())
    endTime.setDate(this.startTime().getDate() + durationInDays)
    return endTime
  }

  async run(): Promise<Booking> {
    const bed = await AppDataSource.getRepository(Bed).findOneBy({ bedCode: this.bedCode })
    const booking = new Booking()
    booking.bed = bed
    booking.start_time = this.startTime()
    booking.end_time = this.endTime()

    const createdBooking = await AppDataSource.manager.save(booking)
    return createdBooking
  }
}

export default BookingCreator
