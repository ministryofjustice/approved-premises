import Step from './step'
import ApTypeStep from './ap-type.step'
import ReferralReasonStep from './referral-reason.step'
import OpdPathwayStep from './opd-pathway.step'
import NotEligibleStep from './not-eligible.step'
import EsapReasonsStep from './esap-reasons.step'
import RoomSearches from './room-searches.step'
import CCTVStep from './cctv.step'

import Dto from '../dtos/dto'

const stepList = {
  'referral-reason': ReferralReasonStep,
  'type-of-ap': ApTypeStep,
  'enhanced-risk': ApTypeStep,
  'esap-reasons': EsapReasonsStep,
  'not-eligible': NotEligibleStep,
  'opd-pathway': OpdPathwayStep,
  'import-oasys-sections': ApTypeStep,
  'room-searches': RoomSearches,
  cctv: CCTVStep,
}

type AllowedStepNames = keyof typeof stepList

export { Step, Dto, stepList, AllowedStepNames }
