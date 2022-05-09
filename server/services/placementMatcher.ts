/* eslint no-underscore-dangle: ["error", { "allow": ["_source"] }] */
import { In } from 'typeorm'

import AppDataSource from '../dataSource'
import Premises from '../entity/premises'
import OpenSearchClient from '../data/openSearchClient'

export default class PlacementMatcher {
  constructor(private readonly placeOrPostcode: string) {}

  public async results(): Promise<any[]> {
    console.log('Finding suitable, available, nearby candidate placements near', this.placeOrPostcode)

    const lat = 53.7901124
    const lon = -1.560001909

    const response = await OpenSearchClient.search({
      index: 'bed_availability',
      body: {
        size: '10000',
        query: {
          bool: {
            must: {
              match_all: {},
            },
            filter: {
              geo_distance: {
                distance: '50miles',
                'premises.location': {
                  lat,
                  lon,
                },
              },
            },
          },
        },
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
    })

    const searchResults = response.body.hits
    const ids = searchResults.hits.map((hit: any) => hit._source.premises.id)

    const premises = await AppDataSource.getRepository(Premises).find({ where: { id: In(ids) } })
    const premisesWithDistance = premises
      .map(p => {
        const searchResult = searchResults.hits.find((r: any) => r._source.premises.id === p.id)

        return {
          ...p,
          distance: searchResult.fields.distance[0],
        }
      })
      .sort((a, b) => a.distance - b.distance)

    return premisesWithDistance
  }
}
