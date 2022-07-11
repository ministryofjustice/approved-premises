import { readFile } from 'fs/promises'
import path from 'path'
import { loadCurrentQuestions } from './loadCurrentQuestions'
import { loadQuestionFiles } from './loadQuestionFiles'

jest.mock('fs/promises')
jest.mock('./loadCurrentQuestions.ts')

describe('loadQuestionsFiles', () => {
  it('returns two objects and reads the files from disk', async () => {
    const mockedReadFile = (readFile as jest.Mock).mockResolvedValueOnce('{"name": "previous questions file"}')
    const mockedLoadCurrentQuestions = (loadCurrentQuestions as jest.Mock).mockResolvedValueOnce(
      JSON.stringify({
        questionOne: 'question',
        questionTwo: 'question',
      })
    )

    const actual = await loadQuestionFiles('previousQuestions.json', './currentQuestionsDir')

    expect(actual).toEqual({
      previousQuestions: '{"name": "previous questions file"}',
      currentQuestions: '{"questionOne":"question","questionTwo":"question"}',
    })

    expect(mockedReadFile).toBeCalledTimes(1)
    expect(mockedReadFile).toHaveBeenCalledWith(path.join(__dirname, 'previousQuestions.json'), 'utf-8')

    expect(mockedLoadCurrentQuestions).toHaveBeenCalledWith('./currentQuestionsDir')
  })
})
