import { loadQuestionFiles } from './loadQuestionFiles'
import { incrementVersion } from './incrementVersion'
import { overwritePreviousQuestions } from './overwritePreviousQuestions'

const main = async (): Promise<void> => {
  console.log(`loading questions...`)
  const { previousQuestions, currentQuestions } = await loadQuestionFiles(
    'previous.json',
    '../../server/forms/questions/'
  )

  if (previousQuestions !== currentQuestions) {
    console.log(`questions do not match previous version`)

    const newVersion = await incrementVersion()
    console.log(`wrote new version ${JSON.stringify(newVersion)}`)

    await overwritePreviousQuestions(currentQuestions)
    console.log(`overwrote previous questions`)
    return
  }
  console.log(`questions match previous version`)
}

main()
