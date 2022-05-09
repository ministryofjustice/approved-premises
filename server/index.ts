import promClient from 'prom-client'
import config from './config'
import { createMetricsApp } from './monitoring/metricsApp'
import { createRedisClient } from './data/redisClient'
import createApp from './app'
import HmppsAuthClient from './data/hmppsAuthClient'
import TokenStore from './data/tokenStore'
import UserService from './services/userService'
import AppDataSource from './dataSource'

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!')
    console.log(config.database.url)
  })
  .catch(error => console.log('Error during Data Source initialization: ', error))

promClient.collectDefaultMetrics()

const hmppsAuthClient = new HmppsAuthClient(new TokenStore(createRedisClient()))
const userService = new UserService(hmppsAuthClient)

const app = createApp(userService)
const metricsApp = createMetricsApp()

export { app, metricsApp }
