import { outputFile } from 'fs-extra'
import path from 'path'

export async function saveSession(username: string, data: any): Promise<void> {
  if (typeof username !== 'string') return
  const stringifiedData = JSON.stringify(data)
  await outputFile(path.join(__dirname, `${username}.json`), stringifiedData, 'utf-8')
}
