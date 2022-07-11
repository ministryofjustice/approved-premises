import fs from 'fs/promises'
import fsExtra from 'fs-extra'
import path from 'path'

export const loadCurrentQuestions = async (questionsDirectory: string) => {
  const allQuestionFileNames = await fs.readdir(path.join(__dirname, questionsDirectory))
  const questionFileReads = []

  // eslint-disable-next-line
  for (const fileName of allQuestionFileNames) {
    const pathToQuestions = path.join(__dirname, questionsDirectory, fileName)

    // eslint-disable-next-line
    const fileExists = await fsExtra.pathExists(pathToQuestions)

    // eslint-disable-next-line
    if (fileExists) questionFileReads.push(JSON.parse(await fs.readFile(pathToQuestions, 'utf-8')))
    else throw new Error(`questions file ${pathToQuestions} doesn't exist`)
  }

  const questions = await Promise.all(questionFileReads)

  return JSON.stringify(questions.reduce((prev, curr, i) => ({ ...prev, [`question ${i}`]: curr }), {}))
}
