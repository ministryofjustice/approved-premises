import type { RequestHandler, Router } from 'express'

import Premises from '../entity/premises'
import Bed from '../entity/bed'
import AppDataSource from '../dataSource'
import asyncMiddleware from '../middleware/asyncMiddleware'

export const get = (router: Router, path: string, handler: RequestHandler): Router =>
  router.get(path, asyncMiddleware(handler))

export const post = (router: Router, path: string, handler: RequestHandler): Router =>
  router.post(path, asyncMiddleware(handler))

export default function routes(router: Router): Router {
  get(router, '/', (_req, res, next) => {
    res.render('pages/index')
  })

  get(router, '/premises', async (req, res, next) => {
    const premises = await AppDataSource.getRepository(Premises).find({
      order: {
        probationRegion: 'ASC',
        town: 'ASC',
        name: 'ASC',
      },
    })
    const bedCounts = await AppDataSource.getRepository(Premises)
      .createQueryBuilder('premises')
      .select('premises.apCode', 'apCode')
      .addSelect('COUNT(beds.id)', 'bedCount')
      .innerJoin('premises.beds', 'beds')
      .groupBy('premises.apCode')
      .getRawMany()

    // throws a error after adding the `location` field of type `geometry`
    // const apCount = await AppDataSource.getRepository(Premises).count()

    const apCount = premises.length
    const bedCount = await AppDataSource.getRepository(Bed).count()
    const apRows = premises.map(ap => {
      return [
        { text: ap.apCode },
        { text: ap.name },
        { text: ap.town },
        { text: ap.probationRegion },
        { text: ap.postcode },
        { text: [ap.lat, ap.lon] },
        { text: bedCounts.find(b => b.apCode === ap.apCode).bedCount },
      ]
    })
    res.render('pages/premisesIndex', { apCount, apRows, bedCount, csrfToken: req.csrfToken() })
  })

  return router
}
