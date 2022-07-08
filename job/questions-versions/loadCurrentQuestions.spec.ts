import { readdir, readFile } from 'fs/promises'
import { join as pathJoin } from 'path'
import fsExtra from 'fs-extra'
import { loadCurrentQuestions } from './loadCurrentQuestions'

jest.mock('fs/promises')
jest.mock('path')
jest.mock('fs-extra', () => {
  return {
    pathExists: jest.fn(),
  }
})

describe('loadCurrentQuestions', () => {
  it('when the neccessary files exist it reads the names of files from a directory and returns the content of those files concatenated as a string', async () => {
    const mockedReaddir = (readdir as jest.Mock).mockResolvedValueOnce([
      'questionsFileOne.json',
      'questionsFileTwo.json',
    ])
    const mockedReadFile = (readFile as jest.Mock)
      .mockResolvedValueOnce('{"name": "first questions file"}')
      .mockResolvedValueOnce('{"name": "second questions file"}')

    const mockedPathJoin = (pathJoin as jest.Mock)
      .mockReturnValueOnce('dir/questionsFolder')
      .mockReturnValueOnce('dir/questionsFileOne.json')
      .mockReturnValueOnce('dir/questionsFileTwo.json')

    const mockPathExists = (fsExtra.pathExists as jest.Mock).mockImplementation(() => true)

    const result = await loadCurrentQuestions('./questionsFolder')

    expect(result).toBe('{"question 0":{"name":"first questions file"},"question 1":{"name":"second questions file"}}')

    expect(mockedReaddir).toHaveBeenCalledWith('dir/questionsFolder')
    expect(mockedReaddir).toHaveBeenCalledTimes(1)

    expect(mockPathExists).toHaveBeenCalledWith('dir/questionsFileOne.json')
    expect(mockPathExists).toHaveBeenCalledWith('dir/questionsFileTwo.json')
    expect(mockPathExists).toHaveBeenCalledTimes(2)

    expect(mockedReadFile.mock.calls).toEqual([
      ['dir/questionsFileOne.json', 'utf-8'],
      ['dir/questionsFileTwo.json', 'utf-8'],
    ])
    expect(mockedReadFile).toHaveBeenCalledTimes(2)

    expect(mockedPathJoin).toHaveBeenCalledTimes(3)
  })
})
