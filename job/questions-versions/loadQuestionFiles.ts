import fs from 'fs/promises'
import path from 'path'

import { loadCurrentQuestions } from './loadCurrentQuestions'

export const loadQuestionFiles = async (previousQuestionsName: string, currentQuestionsPath: string) => {
  const previousQuestions = await fs.readFile(path.join(__dirname, previousQuestionsName), 'utf-8')
  const currentQuestions = await loadCurrentQuestions(currentQuestionsPath)
  return { previousQuestions, currentQuestions }
}
