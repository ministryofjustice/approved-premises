import Step from './step'
import ApTypeStep from './ap-type.step'
import ReferralReasonStep from './referral-reason.step'
import Dto from '../dtos/dto'

const stepList = {
  'referral-reason': ReferralReasonStep,
  'type-of-ap': ApTypeStep,
  'enhanced-risk': Step,
  'opd-pathway': Step,
  'esap-reasons': Step,
  'not-eligible': Step,
}

const stepNames = Object.keys(stepList)

type AllowedStepNames = typeof stepNames[number]

export { Step, Dto, stepList, AllowedStepNames }
