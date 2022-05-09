import AppDataSource from '../dataSource'
import Premises from '../entity/premises'

const PlacementFinder = {
  async near(placeOrPostcode: string): Promise<any[]> {
    console.log('Finding suitable, available, nearby candidate placements near', placeOrPostcode)

    // here we will geocode the given placename / postcode
    // initially we use a point in Leeds
    const origin = {
      type: 'Point',
      coordinates: [-1.560001909, 53.7901124],
    }

    const candidatePremises = await AppDataSource.getRepository(Premises)
      .createQueryBuilder('premises')
      .select([
        'premises.apCode as apCode',
        'premises.name as name',
        'premises.town as town',
        'premises.localAuthorityArea as localAuthorityArea',
        'premises.postcode as postcode',
        'ST_Distance(location, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(location))) * 100 AS distance',
      ])
      .where('ST_DWithin(location, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(location)), :range)')
      .orderBy('distance', 'ASC')
      .limit(10)
      .setParameters({
        origin: JSON.stringify(origin),
        range: 1000 * 1000,
      })
      .getRawMany()
    return candidatePremises
  },
}

export default PlacementFinder
