import { Request } from 'express'

import Form from '../form'
import type { AllowedSectionNames } from '../interfaces'

export function getSectionStatus(request: Request, form: typeof Form, section: AllowedSectionNames): string {
  const sessionVar = request.session?.[form.sessionVarName]?.sections?.[section]

  return sessionVar?.status === undefined ? 'not_started' : sessionVar.status
}
