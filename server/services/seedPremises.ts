import * as csv from '@fast-csv/parse'
import AppDataSource from '../dataSource'
import OpenSearchClient from '../data/openSearchClient'
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

  async run() {
    console.log('Seeding premises')

    // await AppDataSource.manager.query(`TRUNCATE TABLE beds, premises;`)

    const processedPremises = new Set(['Approved Premises'])
    const apProcessingList: Premises[] = []

    csv
      .parseFile(config.database.seedfile, { headers, ignoreEmpty: true, skipLines: 1 })
      .on('error', error => console.error(error))
      .on('data', row => {
        const apCode = row.ap_bed_code.replace(/\d+/, '')

        if (!processedPremises.has(apCode) && row.name.length > 0) {
          console.log(`** Seeding  ${row.name}  ${apCode}`)
          console.log(row.name.length)
          console.log(row)

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
        const allPremises = await AppDataSource.manager.save(apProcessingList)
        console.log(`Seeded ${allPremises.length} APs...`)
        SeedPremises.seedBeds(allPremises)
      })
  },

  async seedBeds(allPremises: Premises[]) {
    console.log('Now to seed the beds...')
    console.log(`We have ${allPremises.length} APs ready to associate`)

    const bedProcessingList: Bed[] = []

    csv
      .parseFile(config.database.seedfile, { headers, ignoreEmpty: true, skipLines: 1 })
      .on('error', error => console.error(error))
      .on('data', row => {
        if (row.name.length > 0) {
          const apCode = row.ap_bed_code.replace(/\d+/, '')

          console.log(`** Seeding  ${apCode} ${row.ap_bed_code}`)
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
        const allBeds = await AppDataSource.manager.save(bedProcessingList)
        console.log(`Seeded ${allBeds.length} Beds...`)
      })
  },
}

export default SeedPremises
