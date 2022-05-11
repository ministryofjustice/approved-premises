import { Factory } from 'fishery'
import Booking from '../../../entity/booking'

export default Factory.define<Booking>(({ sequence }) => ({
  id: sequence,
  start_time: new Date(2022, 1, 1),
  end_time: new Date(2022, 1, 23),
  bed: undefined,
}))
