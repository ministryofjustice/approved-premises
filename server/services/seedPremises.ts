import AppDataSource from '../dataSource'
import { Premises } from '../entity/premises'

const SeedPremises = {
  async run() {
    console.log('running seeding')
    const premises = new Premises()
    premises.name = 'First Foot Foundation'
    premises.postcode = 'BD9 6RJ'

    await AppDataSource.manager.save(premises)
    console.log('Premises has been saved. Premises id is', premises.id)
  },
}

export default SeedPremises
