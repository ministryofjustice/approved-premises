import { Factory } from 'fishery'
import Bed from '../../../entity/bed'

export default Factory.define<Bed>(({ sequence }) => ({
  id: sequence,
  bedCode: sequence.toString(),
  gender: 'M',
  iap: true,
  pipe: false,
  enhanced_security: false,
  step_free_access_to_communal_areas: false,
  lift_or_stairlift: false,
  premises: undefined,
  bookings: [],
}))
