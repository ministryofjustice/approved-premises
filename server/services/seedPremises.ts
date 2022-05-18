import * as csv from '@fast-csv/parse'
import AppDataSource from '../dataSource'
import config from '../config'
import Premises from '../entity/premises'
import Bed from '../entity/bed'

const headers = [
  'name',
  'apArea',
  'probationRegion',
  'localAuthorityArea',
  'town',
  'address',
  'postcode',
  'bed_count',
  'ap_bed_code',
  'gender',
  'iap',
  'pipe',
  'enhanced_security',
]
  .concat([...Array(9)])
  .concat(['step_free_access_to_communal_areas', 'lift_or_stairlift'])
  .concat([...Array(16)])

const SeedPremises = {
  toBoolean(value: string): boolean {
    return value.toLowerCase() === 'yes'
  },

  async run(): Promise<any> {
    console.log('Seeding premises')

    await AppDataSource.manager.query(`TRUNCATE TABLE bookings, beds, premises;`)

    const premises = await this.getPremises()

    const allPremises = await AppDataSource.manager.save(premises)

    console.log(`Seeded ${allPremises.length} APs...`)

    await SeedPremises.seedBeds(allPremises)
  },

  async seedBeds(allPremises: Premises[]): Promise<any> {
    const beds = await this.getBeds(allPremises)

    const allBeds = await AppDataSource.manager.save(beds)

    console.log(`Seeded ${allBeds.length} Beds...`)
  },

  async getBeds(allPremises: Premises[]): Promise<Bed[]> {
    const bedProcessingList: Bed[] = []

    return new Promise((resolve, reject) => {
      csv
        .parseFile(config.database.seedfile, { headers, ignoreEmpty: true, skipLines: 1 })
        .on('error', error => {
          reject(error)
        })
        .on('data', row => {
          if (row.name.length > 0) {
            const apCode = row.ap_bed_code.replace(/\d+/, '')

            const bed = new Bed()

            bed.bedCode = row.ap_bed_code
            bed.premises = allPremises.find(p => p.apCode === apCode)
            bed.gender = row.gender
            bed.iap = this.toBoolean(row.iap)
            bed.pipe = this.toBoolean(row.pipe)
            bed.enhanced_security = this.toBoolean(row.enhanced_security)
            bed.step_free_access_to_communal_areas = this.toBoolean(row.step_free_access_to_communal_areas)
            bed.lift_or_stairlift = this.toBoolean(row.lift_or_stairlift)

            bedProcessingList.push(bed)
          }
        })
        .on('end', async () => {
          return resolve(bedProcessingList)
        })
    })
  },

  async getPremises(): Promise<Premises[]> {
    const processedPremises = new Set(['Approved Premises'])
    const apProcessingList: Premises[] = []

    return new Promise((resolve, reject) => {
      csv
        .parseFile(config.database.seedfile, { headers, ignoreEmpty: true, skipLines: 1 })
        .on('error', error => {
          reject(error)
        })
        .on('data', row => {
          const apCode = row.ap_bed_code.replace(/\d+/, '')

          if (!processedPremises.has(apCode) && row.name.length > 0) {
            const premises = new Premises()

            premises.apCode = apCode
            premises.name = row.name
            premises.apArea = row.apArea
            premises.probationRegion = row.probationRegion
            premises.localAuthorityArea = row.localAuthorityArea
            premises.town = row.town
            premises.address = row.address
            premises.postcode = row.postcode

            apProcessingList.push(premises)
          }

          processedPremises.add(apCode)
        })
        .on('end', async () => {
          return resolve(apProcessingList)
        })
    })
  },
}

export default SeedPremises
