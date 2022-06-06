import fsPromises from 'fs/promises'
import Step from './step'

jest.mock('fs/promises')

describe('Step', () => {
  describe('initialize', () => {
    it('returns an instance of a Step', async () => {
      const step = { name: 'foo', section: 'bar', title: 'title', showTitle: false }

      jest.spyOn(fsPromises, 'readFile').mockImplementation(async () => JSON.stringify(step))

      const result = await Step.initialize('step')

      expect(fsPromises.readFile).toHaveBeenCalledWith(`${__dirname}/steps/step.json`, 'utf8')

      expect(result).toBeInstanceOf(Step)

      expect(result.name).toEqual('foo')
      expect(result.section).toEqual('bar')
      expect(result.title).toEqual('title')
      expect(result.showTitle).toEqual(false)
    })
  })
})
