import config from './config'
import promClient from 'prom-client'
import { createMetricsApp } from './monitoring/metricsApp'
import { createRedisClient } from './data/redisClient'
import createApp from './app'
import HmppsAuthClient from './data/hmppsAuthClient'
import TokenStore from './data/tokenStore'
import UserService from './services/userService'

import "reflect-metadata"
import { DataSource } from "typeorm"
import { Premises } from "./entity/Premises"

const AppDataSource = new DataSource({
    type: "postgres",
    url: config.database.url,
    // host: "localhost",
    // port: 5432,
    username: "postgres",
    // password: "",
    entities: [Premises],
    synchronize: true,
    logging: false,
})

AppDataSource.initialize()
    .then(() => {
        // here you can start to work with your database
    })
    .catch((error) => console.log(error))

promClient.collectDefaultMetrics()

const hmppsAuthClient = new HmppsAuthClient(new TokenStore(createRedisClient()))
const userService = new UserService(hmppsAuthClient)

const app = createApp(userService)
const metricsApp = createMetricsApp()

export { app, metricsApp }
