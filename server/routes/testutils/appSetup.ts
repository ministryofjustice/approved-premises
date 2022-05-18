import express, { Router, Express } from 'express'
import cookieSession from 'cookie-session'
import createError from 'http-errors'
import path from 'path'

import indexRoutes from '../index'
import placementRoutes, { placementsUrlPrefix } from '../placementRoutes'

import nunjucksSetup from '../../utils/nunjucksSetup'
import errorHandler from '../../errorHandler'
import standardRouter from '../standardRouter'
import UserService from '../../services/userService'
import * as auth from '../../authentication/auth'

const user = {
  name: 'john smith',
  firstName: 'john',
  lastName: 'smith',
  username: 'user1',
  displayName: 'John Smith',
}

class MockUserService extends UserService {
  constructor() {
    super(undefined)
  }

  async getUser(token: string) {
    return {
      token,
      ...user,
    }
  }
}

interface AllRoutes {
  [key: string]: Array<(router: express.Router) => express.Router>
}

function appSetup(routes: AllRoutes, production: boolean): Express {
  const app = express()

  app.set('view engine', 'njk')

  nunjucksSetup(app, path)

  app.use((req, res, next) => {
    res.locals = {}
    res.locals.user = user
    next()
  })

  app.use(cookieSession({ keys: [''] }))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  Object.keys(routes).forEach(prefix => {
    const r = routes[prefix]
    r.forEach(route => {
      app.use(prefix, route(standardRouter(new MockUserService())))
    })
  })

  app.use(placementsUrlPrefix, placementRoutes(standardRouter(new MockUserService())))
  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(production))

  return app
}

export default function appWithAllRoutes({ production = false }: { production?: boolean }): Express {
  auth.default.authenticationMiddleware = () => (req, res, next) => next()
  const allRoutes = {
    '/': [indexRoutes],
    [placementsUrlPrefix]: [placementRoutes],
  }
  return appSetup(allRoutes, production)
}
