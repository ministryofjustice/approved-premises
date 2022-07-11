import fs from 'fs/promises'
import path from 'path'

export const overwritePreviousQuestions = async (newVersion: any) => {
  await fs.writeFile(path.join(__dirname, 'previous.json'), JSON.stringify(newVersion), 'utf-8')
}
