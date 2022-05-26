import { Request } from 'express'

import { ReferralApplication } from '../referral-application.form'
import type { AllowedSectionNames } from '../steps'

export function getSectionStatus(
  request: Request,
  form: typeof ReferralApplication,
  section: AllowedSectionNames
): string {
  const sessionVar = request.session?.[form.sessionVarName]?.sections?.[section]

  return sessionVar?.status === undefined ? 'not_started' : sessionVar.status
}
