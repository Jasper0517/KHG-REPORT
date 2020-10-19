import {
  responseFormat,
  checkEmailIsExist,
  hashPassword
} from './tools.mjs'

import { client } from '../db.mjs'

export default async ({
  email,
  password,
  confirmPassword
}, req) => {
  const $t = req.__
  // 基本防呆
  if (!email || !password || !confirmPassword) {
    return responseFormat({
      code: 400,
      msg: $t('signup.warning.0')
    })
  }

  // 密碼不一致
  if (password !== confirmPassword) {
    return responseFormat({
      code: 400,
      msg: $t('signup.warning.1')
    })
  }

  const isExist = await checkEmailIsExist(email)

  // email重複
  if (isExist[0]) {
    return responseFormat({
      code: 400,
      msg: $t('signup.warning.2')
    })
  }
  // 寫入 MongoDb
  const worker = (async ({ email, password }) => {
    const userData = {
      email,
      password,
      chatId: null,
      url: '',
      KHGPassword: '',
      EDAPKey: '',
      role: 'user',
      notification: false,
      isSetting: false,
      lastTestingTime: null,
      language: req.locale
    }
    const db = client.db()
    const collection = db.collection('user')
    try {
      const result = await collection.insertOne(userData)
      return result
    } catch (error) {
      console.log('signup')
      console.log('error: ', error)
    }
  })({
    email,
    password: hashPassword(password)
  })

  // 回應
  try {
    await worker
    return responseFormat({
      code: 200,
      msg: $t('signup.success', email)
    })
  } catch (error) {
    console.log('signup')
    console.log('error: ', error)
    return responseFormat({
      code: 500,
      msg: $t('systemError')
    })
  }
}
