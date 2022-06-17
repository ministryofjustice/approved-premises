import { remove } from 'fs-extra'
import path from 'path'

import { resetStubs } from '../mockApis/wiremock'

import auth from '../mockApis/auth'
import tokenVerification from '../mockApis/tokenVerification'

const testUsername = 'USER1'

export default (on: (string, Record) => void): void => {
  on('task', {
    reset: resetStubs,

    getSignInUrl: auth.getSignInUrl,
    stubSignIn: auth.stubSignIn,

    stubAuthUser: auth.stubUser,
    stubAuthPing: auth.stubPing,

    stubTokenVerificationPing: tokenVerification.stubPing,

    deleteSessionFile: async (): Promise<null | any> => {
      const testSessionPath = path.resolve(
        __dirname,
        '..',
        '..',
        'dist',
        'server',
        'forms',
        'helpers',
        `${testUsername}.json`
      )
      return remove(testSessionPath)
        .then(() => {
          console.log(`Deleted ${testSessionPath}`)
          return null
        })
        .catch(err => {
          console.error(err)
          return err
        })
    },
  })
}
