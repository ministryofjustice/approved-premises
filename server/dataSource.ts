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
  // entities: ['./dist/**/*.entity.js'],
  migrations: ['./server/db/migrate/*.ts'],
  // migrationsRun: true,
  // dropSchema: process.env.NODE_ENV == 'test',
  synchronize: true,
  logging: false,
})

export default AppDataSource
