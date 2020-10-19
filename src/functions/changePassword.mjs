import {
  responseFormat,
  comparePassword,
  hashPassword
} from './tools.mjs'

import { client } from '../db.mjs'

export default async ({
  email,
  password,
  newPassword,
  confirmNewPassword
}, $t) => {
  if (!email) {
    return responseFormat({
      code: 400,
      msg: $t('changePassword.warning.0')
    })
  }

  if (!await comparePassword(email, password)) {
    return responseFormat({
      code: 400,
      msg: $t('changePassword.warning.1')
    })
  }

  if (newPassword !== confirmNewPassword) {
    return responseFormat({
      code: 400,
      msg: $t('changePassword.warning.2')
    })
  }

  if (password === newPassword) {
    return responseFormat({
      code: 400,
      msg: $t('changePassword.warning.3')
    })
  }

  // 寫入 MongoDb
  const db = client.db()
  const collection = db.collection('user')
  try {
    await collection.updateOne(
      { email },
      {
        $set: {
          password: hashPassword(newPassword)
        }
      },
      { w: 1 },
      err => {
        if (err) throw err
      })
    return responseFormat({
      code: 200,
      msg: ''
    })
  } catch (error) {
    console.log('changePassword')
    console.log('error: ', error)
    return responseFormat({
      code: 400,
      msg: $t('systemError')
    })
  }
}
