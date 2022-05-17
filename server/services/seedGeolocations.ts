import * as csv from '@fast-csv/parse'
import AppDataSource from '../dataSource'
import config from '../config'
import Premises from '../entity/premises'

const headers = ['apCode', 'postcode', 'lat', 'lon']

const SeedGeolocations = {
  async run() {
    console.log('Seeding geolocations')

    const premises = await this.getPremises()

    await AppDataSource.manager.save(premises)
  },

  async getPremises(): Promise<Premises[]> {
    const allPremises = await AppDataSource.getRepository(Premises).find()
    const apProcessingList: Premises[] = []

    return new Promise<Premises[]>((resolve, reject) => {
      csv
        .parseFile(config.database.geoseedfile, { headers, ignoreEmpty: true, skipLines: 1 })
        .on('error', error => {
          reject(error)
        })
        .on('data', async row => {
          if (row.lon !== 'unknown') {
            const premises = allPremises.find(p => p.apCode === row.apCode)
            premises.lat = row.lat
            premises.lon = row.lon
            premises.location = { coordinates: [row.lon, row.lat], type: 'Point' }
            apProcessingList.push(premises)
          }
        })
        .on('end', async () => {
          resolve(apProcessingList)
        })
    })
  },
}

export default SeedGeolocations
