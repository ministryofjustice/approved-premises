/* eslint no-underscore-dangle: ["error", { "allow": ["_source", "_score"] }] */
import { In } from 'typeorm'

import AppDataSource from '../dataSource'
import Premises from '../entity/premises'
import OpenSearchClient from '../data/openSearchClient'
import FilterArgs from '../common/dto/filter-args'

export default class PlacementMatcher {
  constructor(private readonly filterArgs: FilterArgs) {}

  public async results(): Promise<any[]> {
    console.log('Finding suitable, available, nearby candidate placements near', this.filterArgs.location)

    const lat = 53.7901124
    const lon = -1.560001909

    const body = {
      index: 'bed_availability',
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

    const premises = await AppDataSource.getRepository(Premises).find({ where: { id: In(ids) }, relations: ['beds'] })
    const sortedPremisesWithMetadata = premises
      .map(p => {
        const searchResult = searchResults.hits.find((r: any) => r._source.premises.id === p.id)

        return {
          ...p,
          distance: searchResult.fields.distance[0],
          score: searchResult._score,
        }
      })
      .sort((a, b) => b.score - a.score)

    return sortedPremisesWithMetadata
  }

  private query(lat: number, lon: number) {
    let query

    const filters = (this.filterArgs.requirements || []).map(requirement => {
      return {
        term: {
          [requirement]: {
            value: true,
            boost: 1.0,
          },
        },
      }
    })

    if (filters.length) {
      query = {
        bool: {
          should: filters,
        },
      }
    } else {
      query = {
        bool: {
          must: {
            match_all: {},
          },
        },
      }
    }

    return {
      function_score: {
        functions: [
          {
            gauss: {
              'premises.location': {
                origin: { lat, lon },
                scale: '50miles',
              },
            },
          },
        ],
        query,
      },
    }
  }
}
