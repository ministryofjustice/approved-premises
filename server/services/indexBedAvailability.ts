import AppDataSource from '../dataSource'
import OpenSearchClient from '../data/openSearchClient'
import Bed from '../entity/bed'

const IndexBedAvailability = {
  indexName: 'bed_availability',

  async run(): Promise<void> {
    console.log('Indexing in opensearch....')
    const indexName = 'bed_availability'
    const allBeds = await AppDataSource.getRepository(Bed).find({
      relations: ['premises', 'bookings'],
    })

    console.log('Deleting index....')

    await OpenSearchClient.indices.delete({
      index: indexName,
    })

    console.log('Creating index....')

    await OpenSearchClient.indices.create({
      index: indexName,
      body: {
        mappings: {
          properties: {
            premises: {
              properties: {
                location: {
                  type: 'geo_point',
                },
              },
            },
          },
        },
      },
    })

    console.log('Indexing beds....')

    await Promise.all(allBeds.map(bed => this.indexBed(bed)))
  },

  async indexBed(bed: Bed): Promise<any> {
    await OpenSearchClient.index({
      id: bed.id.toString(),
      index: this.indexName,
      body: {
        bed: {
          gender: bed.gender,
          iap: bed.iap,
          pipe: bed.pipe,
          enhanced_security: bed.enhanced_security,
          step_free_access_to_communal_areas: bed.step_free_access_to_communal_areas,
          lift_or_stairlift: bed.lift_or_stairlift,
        },
        premises: {
          id: bed.premises.id,
          location: {
            lat: bed.premises.lat,
            lon: bed.premises.lon,
          },
        },
        bookings: bed.bookings.map(booking => {
          return {
            start_time: booking.start_time,
            end_time: booking.end_time,
          }
        }),
      },
      refresh: true,
    })
  },
}

export default IndexBedAvailability
