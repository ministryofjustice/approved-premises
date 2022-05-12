import { Factory } from 'fishery'
import Premises from '../../../entity/premises'

export default Factory.define<Premises>(({ sequence }) => ({
  id: sequence,
  name: 'Close Premises',
  apCode: sequence.toString(),
  apArea: 'NW',
  probationRegion: 'Greater Manchester',
  localAuthorityArea: 'Greater Manchester',
  town: 'Manchester',
  address: '123 Fake Street',
  postcode: 'ABC123',
  lat: 53.75397,
  lon: -2.70342,
  location: { coordinates: [53.75397, -2.70342], type: 'Point' },
  beds: [],
}))
