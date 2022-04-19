import * as fs from 'fs'
import * as csv from '@fast-csv/parse'
import AppDataSource from '../dataSource'
import config from '../config'
import Premises from '../entity/premises'

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
].concat([...Array(28)])

const SeedPremises = {
  async run() {
    console.log('running seeding')

    await AppDataSource.manager.query(`TRUNCATE TABLE premises`)

    const processedPremises = new Set(['Approved Premises'])
    const processingList: Premises[] = []

    await fs
      .createReadStream(config.database.seedfile)
      .pipe(csv.parse({ headers, ignoreEmpty: true }))
      .on('error', error => console.error(error))
      .on('data', row => {
        const apCode = row.ap_bed_code.replace(/\d+/, '')

        if (!processedPremises.has(apCode) && row.name !== 'Approved Premises') {
          console.log(`** Seeding  ${row.name}  ${apCode}`)
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

          processingList.push(premises)
        }

        processedPremises.add(apCode)
      })
      .on('end', (rowCount: number) => {
        AppDataSource.manager.save(processingList)
        console.log(`Parsed ${rowCount} rows`)
      })
  },
}

export default SeedPremises
