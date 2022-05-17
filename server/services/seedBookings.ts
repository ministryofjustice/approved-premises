import AppDataSource from '../dataSource'
import Premises from '../entity/premises'
// import Bed from '../entity/bed'
import Booking from '../entity/booking'

const apCodes = ['NEHOL', 'NERIP', 'NESTJ', 'NECAR', 'NEALB', 'NEWES', 'NEELM', 'NEROO', 'NENOR', 'NESOU']
const baseDate = new Date(2022, 7, 1) // Aug 1st
const durationsInWeeks = [1, 6, 8, 12, 12, 18]
const bookingProcessingList: Booking[] = []

const SeedBookings = {
  randomOffset(): number {
    return Math.floor(Math.random() * 40)
  },

  randomStartTime(): Date {
    const randomStartTime = new Date(baseDate.getTime())
    randomStartTime.setDate(baseDate.getDate() + this.randomOffset())
    return randomStartTime
  },

  randomDurationInDays(): number {
    const randomWeeks = durationsInWeeks[Math.floor(Math.random() * durationsInWeeks.length)]
    return randomWeeks * 7
  },

  endTime(startTime: Date, durationInDays: number) {
    const endTime = new Date(startTime.getTime())
    endTime.setDate(startTime.getDate() + durationInDays)
    return endTime
  },

  async run() {
    console.log('Seeding Bookings...')

    await AppDataSource.manager.query(`TRUNCATE TABLE bookings;`)

    const sampleBeds = await AppDataSource.getRepository(Premises)
      .createQueryBuilder('premises')
      .select('premises.apCode', 'apCode')
      .addSelect('beds.id', 'bedId')
      .addSelect('beds.bedCode', 'bedCode')
      .innerJoin('premises.beds', 'beds')
      .where('premises.apCode IN (:...apCodes)', { apCodes })
      .orderBy('random()')
      .limit(100)
      .printSql()
      .getRawMany()

    sampleBeds.forEach(bed => {
      const startTime = this.randomStartTime()
      const duration = this.randomDurationInDays()
      const endTime = this.endTime(startTime, duration)

      const booking = new Booking()
      booking.bed = bed.bedId
      booking.start_time = startTime
      booking.end_time = endTime

      bookingProcessingList.push(booking)
    })

    const allBookings = await AppDataSource.manager.save(bookingProcessingList)
    console.log(`Seeded ${allBookings.length} bookings...`)
  },
}

export default SeedBookings
