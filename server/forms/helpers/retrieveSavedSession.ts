import { pathExists } from 'fs-extra'
import { readFile } from 'fs/promises'
import path from 'path'
import { Request } from 'express'

export async function retrieveSavedSession(request: Request, sessionVarName: string): Promise<{ [key: string]: any }> {
  const exists = await pathExists(path.join(__dirname, `${request.user.username}.json`))
  if (typeof request.user.username === 'string' && exists) {
    request.session[sessionVarName] = await readAndParseJson(request.user.username)
    return { ...request }
  }
  return { body: {}, session: {} }
}
async function readAndParseJson(username: string): Promise<null | { [key: string]: any }> {
  const file = await readFile(path.join(__dirname, `${username}.json`), 'utf-8')
  return JSON.parse(file)
}
