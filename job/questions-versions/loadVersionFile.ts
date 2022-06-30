import fs from 'fs/promises'
import path from 'path'

export const loadVersionFile = async (versionFileName: string): Promise<{ version: number }> => {
  const versionString = await fs.readFile(path.join(__dirname, versionFileName), 'utf-8')
  return JSON.parse(versionString)
}
