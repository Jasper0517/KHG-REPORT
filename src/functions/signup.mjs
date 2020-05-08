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
}) => {
  // 基本防呆
  if (!email || !password || !confirmPassword) {
    return responseFormat({
      code: 400,
      msg: '欄位不可以為空'
    })
  }

  // 密碼不一致
  if (password !== confirmPassword) {
    return responseFormat({
      code: 400,
      msg: '密碼不一致'
    })
  }

  // email重複
  if (await checkEmailIsExist(email)) {
    return responseFormat({
      code: 400,
      msg: 'email已註冊'
    })
  }
  // 寫入 MongoDb
  const worker = (async (data) => {
    const db = client.db()
    const collection = db.collection('user')
    try {
      const result = await collection.insertOne(data)
      return result
    } catch (error) {
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
      code: 0,
      msg: `${email}, 註冊完成`
    })
  } catch (error) {
    console.log('error: ', error)
    return responseFormat({
      code: 500,
      msg: '系統異常請稍後再試'
    })
  }
}
