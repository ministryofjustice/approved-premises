import { readFile } from 'fs/promises'
import path from 'path'

import { loadVersionFile } from './loadVersionFile'

jest.mock('fs/promises')

describe('loadVersionsFile', () => {
  it('returns an object parsed from json', async () => {
    const mockedReadFile = (readFile as jest.Mock).mockResolvedValueOnce('{"name": "first file"}')

    const actual = await loadVersionFile('versionsFile.json')
    expect(actual).toEqual({
      name: 'first file',
    })

    expect(mockedReadFile).toBeCalledTimes(1)
    expect(mockedReadFile).toHaveBeenCalledWith(path.join(__dirname, 'versionsFile.json'), 'utf-8')
  })
})
