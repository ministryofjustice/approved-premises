import fs from 'fs/promises'
import path from 'path'

import { writeNewVersionFile } from './writeNewVersionFile'

jest.mock('fs/promises')

describe('writeNewVersionFile', () => {
  it('returns two objects and reads the files from disk', async () => {
    const mockedWriteFile = jest.spyOn(fs, 'writeFile')
    const dataToWrite = { name: 'data to write' }

    const actual = await writeNewVersionFile(dataToWrite)

    expect(actual).toBe(undefined)
    expect(mockedWriteFile).toBeCalledTimes(1)
    expect(mockedWriteFile).toHaveBeenCalledWith(path.join(__dirname, 'version.json'), JSON.stringify(dataToWrite))
  })
})
