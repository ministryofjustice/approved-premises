import AppDataSource from '../dataSource'
import OpenSearchClient from '../data/openSearchClient'
import Premises from '../entity/premises'
import config from '../config'

const IndexBedAvailability = {
  indexName: config.opensearch.indexName,

  async run(): Promise<void> {
    console.log('Indexing in opensearch....')
    const allPremises = await AppDataSource.getRepository(Premises).find({
      relations: ['beds', 'beds.bookings'],
    })

    console.log('Deleting index....')

    try {
      await OpenSearchClient.indices.delete({
        index: this.indexName,
      })
    } catch (error) {
      console.log('Index does not exist - skipping deletion')
    }

    console.log('Creating index....')

    await OpenSearchClient.indices.create({
      index: this.indexName,
      body: {
        mappings: {
          properties: {
            location: {
              type: 'geo_point',
            },
            gender: {
              type: 'keyword',
            },
            beds: {
              type: 'nested',
              properties: {
                bookings: {
                  type: 'date_range',
                },
              },
            },
          },
        },
      },
    })

    console.log('Indexing beds....')

    await Promise.all(allPremises.map(premises => this.indexPremises(premises)))
  },

  async indexPremises(premises: Premises): Promise<any> {
    await OpenSearchClient.index({
      id: premises.id.toString(),
      index: this.indexName,
      body: {
        location: {
          lat: premises.lat,
          lon: premises.lon,
        },
        gender: premises.beds[0].gender,
        iap: premises.beds[0].iap,
        pipe: premises.beds[0].pipe,
        enhanced_security: premises.beds[0].enhanced_security,
        step_free_access_to_communal_areas: premises.beds[0].step_free_access_to_communal_areas,
        lift_or_stairlift: premises.beds[0].lift_or_stairlift,
        beds: premises.beds.map(bed => {
          return {
            bookings: bed.bookings.map(booking => {
              return { gte: booking.start_time, lte: booking.end_time }
            }),
          }
        }),
      },
      refresh: true,
    })
  },
}

export default IndexBedAvailability
