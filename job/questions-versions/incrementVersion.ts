import { loadVersionFile } from './loadVersionFile'
import { writeNewVersionFile } from './writeNewVersionFile'

export const incrementVersion = async (): Promise<{ version: number }> => {
  const currentVersionFile = await loadVersionFile('version.json')

  const newVersionNumber = Number(currentVersionFile.version) + 1
  const newVersion = { ...currentVersionFile, version: newVersionNumber }

  await writeNewVersionFile(newVersion)

  return newVersion
}
