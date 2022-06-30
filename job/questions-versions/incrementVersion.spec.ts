import { incrementVersion } from './incrementVersion'
import { loadVersionFile } from './loadVersionFile'
import { writeNewVersionFile } from './writeNewVersionFile'

jest.mock('./loadVersionFile')
jest.mock('./writeNewVersionFile')

describe('incrementVersion', () => {
  it('returns the version object with the version incremented', async () => {
    const mockLoadVersionFile = (loadVersionFile as jest.Mock).mockResolvedValue({ version: 0 })
    const mockWriteNewVersionFile = writeNewVersionFile as jest.Mock

    const actual = await incrementVersion()
    expect(actual).toEqual({ version: 1 })

    expect(mockLoadVersionFile).toBeCalledTimes(1)
    expect(mockLoadVersionFile).toBeCalledWith('version.json')

    expect(mockLoadVersionFile).toBeCalledTimes(1)
    expect(mockWriteNewVersionFile).toBeCalledWith({ version: 1 })
  })
})
