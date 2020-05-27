import {
  encryptPassword,
  responseFormat,
  checkEmailIsExist
} from './tools.mjs'

import { client } from '../db.mjs'

export default async ({
  url,
  KHGPassword,
  EDAPKey,
  email,
  notification
}) => {
  if (!url || !KHGPassword || !EDAPKey) {
    return responseFormat({
      code: 400,
      msg: '欄位不可以為空'
    })
  }

  // 檢查email是否存在
  const isExist = await checkEmailIsExist(email)
  if (!isExist[0]) {
    return responseFormat({
      code: 400,
      msg: 'email不存在，請註冊'
    })
  }

  const encryptKHGPassword = encryptPassword(KHGPassword)
  // 寫入 MongoDb
  const db = client.db()
  const collection = db.collection('user')
  try {
    await collection.updateOne(
      { email },
      {
        $set: {
          url,
          KHGPassword: encryptKHGPassword,
          EDAPKey,
          notification,
          isSetting: true
        }
      },
      { w: 1 },
      err => {
        if (err) throw err
      })
    return responseFormat({
      code: 200,
      msg: '更新成功'
    })
  } catch (error) {
    console.log('setting')
    console.log('error: ', error)
    return responseFormat({
      code: 400,
      msg: '更新異常，請稍候重試'
    })
  }
}
