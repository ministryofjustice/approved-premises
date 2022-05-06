import 'reflect-metadata'
import { DataSource } from 'typeorm'
import config from './config'
import Bed from './entity/bed'
import Booking from './entity/booking'
import Premises from './entity/premises'

const AppDataSource = new DataSource({
  type: 'postgres',
  url: config.database.url,
  username: 'postgres',
  entities: [Premises, Bed, Booking],
  // dropSchema: process.env.NODE_ENV == 'test',
  migrations: ['./dist/db/migrate/*.js'],
  migrationsRun: true,
  synchronize: true,
  logging: false,
})

export default AppDataSource
