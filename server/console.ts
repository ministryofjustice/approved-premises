import SeedPremises from './services/seedPremises'
import SeedGeolocations from './services/seedGeolocations'
import SeedBookings from './services/seedBookings'
import IndexBedAvailability from './services/indexBedAvailability'
import AppDataSource from './dataSource'

async function bootstrap() {
  const command = process.argv[2]

  await AppDataSource.initialize()

  switch (command) {
    case 'seed:premises':
      await SeedPremises.run()
      await SeedGeolocations.run()

      break

    case 'seed:bookings':
      await SeedBookings.run()

      break

    case 'index:bed-availability':
      await IndexBedAvailability.run()

      break

    default:
      console.log('Command not found')
      process.exit(1)
  }

  console.log('Closing connection....')

  await AppDataSource.destroy()
  process.exit(0)
}

bootstrap()
