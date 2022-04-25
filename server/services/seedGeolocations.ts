import * as csv from '@fast-csv/parse'
import AppDataSource from '../dataSource'
import config from '../config'
import Premises from '../entity/premises'

const headers = ['apCode', 'postcode', 'lat', 'lon']

const SeedGeolocations = {
  async run() {
    console.log('Seeding geolocations')

    // await AppDataSource.manager.query(`TRUNCATE TABLE beds, premises;`)

    const allPremises = await AppDataSource.getRepository(Premises).find()
    const apProcessingList: Premises[] = []

    csv
      .parseFile(config.database.geoseedfile, { headers, ignoreEmpty: true, skipLines: 1 })
      .on('error', error => console.error(error))
      .on('data', async row => {
        console.log(row.apCode, row.lon)
        if (row.lon !== 'unknown') {
          const premises = allPremises.find(p => p.apCode === row.apCode)
          premises.lat = row.lat
          premises.lon = row.lon
          // premises.location = { coordinates: [1, 2], type: 'Point' }
          apProcessingList.push(premises)
        }
      })
      .on('end', async () => {
        const allAps = await AppDataSource.manager.save(apProcessingList)
        console.log(`Seeded geolocation of ${allAps.length} APs...`)
      })
  },
}

export default SeedGeolocations
