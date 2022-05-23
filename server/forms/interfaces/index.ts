import { Request } from 'express'

import ApType from '../dtos/ap-type'
import ReferralReason from '../dtos/referral-reason'

import type { AllowedStepNames } from '../steps'

export type ReferralApplicationParams = {
  step: AllowedStepNames
}

export type ReferralApplicationBody = Partial<ApType & ReferralReason>

export type ReferralApplicationRequest = Request<
  ReferralApplicationParams,
  Record<string, unknown>,
  ReferralApplicationBody
>
