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
].concat([...Array(27)])

const SeedPremises = {
  async run() {
    console.log('Seeding premises')

    await AppDataSource.manager.query(`TRUNCATE TABLE beds, premises;`)

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
