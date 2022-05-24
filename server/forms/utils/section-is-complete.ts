import { Request } from 'express'

import { ReferralApplication } from '../referral-application.form'
import { AllowedSectionNames } from '../interfaces'

export function sectionIsComplete(
  request: Request,
  form: typeof ReferralApplication,
  section: AllowedSectionNames
): boolean {
  const sessionVar = request.session?.[form.sessionVarName]?.sections?.[section]

  return sessionVar !== undefined && sessionVar.complete === true
}
