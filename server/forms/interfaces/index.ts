import { Request } from 'express'

import ApType from '../dtos/ap-type'
import ReferralReason from '../dtos/referral-reason'
import OpdPathway from '../dtos/opd-pathway'
import EsapReasons from '../dtos/esap-reasons'

import type { AllowedStepNames } from '../steps'

export type AllowedSectionNames = 'eligibility' | 'ap-type'

export type ReferralApplicationParams = {
  step: AllowedStepNames
  section: AllowedSectionNames
}

export type ReferralApplicationBody = Partial<ApType & ReferralReason & OpdPathway & EsapReasons>

export type ReferralApplicationRequest = Request<
  ReferralApplicationParams,
  Record<string, unknown>,
  ReferralApplicationBody
>
