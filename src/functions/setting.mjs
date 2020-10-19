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
  notification,
  language
}, $t) => {
  if (!url || !KHGPassword || !EDAPKey) {
    return responseFormat({
      code: 400,
      msg: $t('setting.warning.0')
    })
  }

  // 檢查email是否存在
  const isExist = await checkEmailIsExist(email)
  if (!isExist[0]) {
    return responseFormat({
      code: 400,
      msg: $t('setting.warning.1')
    })
  }

  const encryptKHGPassword = encryptPassword(KHGPassword)
  // 寫入 MongoDb
  const db = client.db()
  const collection = db.collection('user')
  const newUrl = url.lastIndexOf('/') === url.length - 1 ? url.substr(0, url.length - 1) : url
  try {
    await collection.updateOne(
      { email },
      {
        $set: {
          url: newUrl,
          KHGPassword: encryptKHGPassword,
          EDAPKey,
          notification,
          isSetting: true,
          language
        }
      },
      { w: 1 },
      err => {
        if (err) throw err
      })
    return responseFormat({
      code: 200,
      msg: $t('systemSuccess')
    })
  } catch (error) {
    console.log('setting')
    console.log('error: ', error)
    return responseFormat({
      code: 400,
      msg: $t('systemError')
    })
  }
}
