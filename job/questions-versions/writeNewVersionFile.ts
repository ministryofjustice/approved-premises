import { writeFile } from 'fs/promises'
import path from 'path'

export const writeNewVersionFile = async (newVersion: { [key: string]: any }) => {
  await writeFile(path.join(__dirname, 'version.json'), JSON.stringify(newVersion))
}
