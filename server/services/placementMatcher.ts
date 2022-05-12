/* eslint no-underscore-dangle: ["error", { "allow": ["_source", "_score"] }] */
import { Repository } from 'typeorm'
import moment from 'moment'

import { float } from '@opensearch-project/opensearch/api/types'
import AppDataSource from '../dataSource'
import Premises from '../entity/premises'
import OpenSearchClient from '../data/openSearchClient'
import FilterArgs from '../common/dto/filter-args'
import config from '../config'

export default class PlacementMatcher {
  repository: Repository<Premises>

  constructor(private readonly filterArgs: FilterArgs) {
    this.repository = AppDataSource.getRepository(Premises)
  }

  public async results(): Promise<any[]> {
    const { indexName } = config.opensearch

    console.log('Finding suitable, available, nearby candidate placements near', this.filterArgs.location)

    const lat = 53.7901124
    const lon = -1.560001909

    const body = {
      index: indexName,
      body: {
        size: '10000',
        query: this.query(lat, lon),
        stored_fields: ['_source'],
        script_fields: {
          distance: {
            script: {
              inline: "doc['premises.location'].arcDistance(params.lat,params.lon) * 0.00062137",
              lang: 'painless',
              params: {
                lat,
                lon,
              },
            },
          },
        },
      },
    }

    const response = await OpenSearchClient.search(body)

    const searchResults = response.body.hits
    const ids = searchResults.hits.map((hit: any) => hit._source.premises.id)

    const premises = await this.fetchPremisesByIds(ids)

    const results = premises
      .map(p => {
        const searchResult = searchResults.hits.find((r: any) => r._source.premises.id === p.premises_id)

        return {
          ...p,
          distance: searchResult.fields.distance[0],
          score: searchResult._score,
        }
      })
      .sort((a, b) => b.score - a.score)

    return results
  }

  private async fetchPremisesByIds(ids: Array<string>): Promise<any[]> {
    let query = this.repository
      .createQueryBuilder('premises')
      .distinctOn(['premises.id'])
      .select(['premises'])
      .addSelect(['array_agg("beds"."gender") AS gender'])
      .addSelect(['array_agg("beds"."enhanced_security") AS enhanced_security'])
      .addSelect(['array_agg("beds"."lift_or_stairlift") AS lift_or_stairlift'])
      .addSelect(['array_agg("beds"."step_free_access_to_communal_areas") AS step_free_access_to_communal_areas'])
      .addSelect(['array_agg("beds"."iap") AS iap'])
      .addSelect(['array_agg("beds"."pipe") AS pipe'])
      .leftJoin('premises.beds', 'beds')
      .leftJoin('beds.bookings', 'bookings')
      .where('premises.id IN(:...ids)', { ids: ids })
      .groupBy('premises.id')

    if (this.filterArgs.gender) {
      query = query.andWhere('gender = :gender', { gender: this.filterArgs.gender })
    }

    if (this.filterArgs.date_from) {
      query = query.addSelect(
        `COUNT(beds.id) filter (
    WHERE
      bookings IS NULL
      OR NOT (DATE '${this.filterArgs.date_from.toDateString()}', DATE '${this.filterArgs.date_to.toDateString()}') OVERLAPS (bookings.start_time, bookings.end_time)
  )`,
        'bed_count'
      )
    }

    return await query.getRawMany()
  }

  private query(lat: number, lon: number) {
    const shouldFilters = (this.filterArgs.requirements || []).map(requirement => {
      return {
        term: {
          [requirement]: {
            value: true,
            boost: 1.0,
          },
        },
      }
    }) as any[]

    const functions = []

    if (this.filterArgs.date_from) {
      functions.push(this.availabilityQuery())
    }

    if (lat && lon) {
      functions.push(this.distanceQuery(lat, lon))
    }

    if (shouldFilters.length) {
      functions.push({
        filter: {
          bool: {
            should: shouldFilters,
          },
        },
        weight: 1,
      })
    }

    return {
      function_score: {
        query: {
          bool: {
            must: {
              match_all: {},
            },
          },
        },
        functions,
        score_mode: 'sum',
      },
    }
  }

  distanceQuery(lat: float, lon: float): any {
    return {
      gauss: {
        'premises.location': {
          origin: { lat, lon },
          scale: '50miles',
        },
      },
    }
  }

  availabilityQuery(): any {
    const start = moment(this.filterArgs.date_from)
    const end = moment(this.filterArgs.date_to)
    const duration = end.diff(start, 'days')

    const centrePoint = start
      .add(duration / 2, 'days')
      .toDate()
      .getTime()

    return {
      gauss: {
        availability: {
          origin: centrePoint,
          scale: `${Math.round(duration / 2)}d`,
        },
      },
    }
  }
}
