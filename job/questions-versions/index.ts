import { loadQuestionFiles } from './loadQuestionFiles'
import { loadVersionFile } from './loadVersionFile'
import { incrementVersion } from './incrementVersion'
import { writeNewVersionFile } from './writeNewVersionFile'

const main = async () => {
  console.log(`loading questions...`)
  const { previousQuestions, currentQuestions } = await loadQuestionFiles('previous.json', 'current.json')

  if (previousQuestions !== currentQuestions) {
    console.log(`questions do not match previous version`)

    const currentVersionFile = await loadVersionFile('version.json')
    const newVersion = incrementVersion(currentVersionFile)

    await writeNewVersionFile('version.json', newVersion)
    return newVersion
  }

  console.log(`questions match previous version`)
  return undefined
}

main()
