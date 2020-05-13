import { checkEmailIsExist } from './tools.mjs'

import { client } from '../db.mjs'

export default async (email, chatId) => {
  const isExist = await checkEmailIsExist(email)
  // 檢查Email
  if (!isExist[0]) return 'Email不存在'

  // 寫入 MongoDb
  const db = client.db()
  const collection = db.collection('user')
  try {
    await collection.updateOne(
      { email },
      { $set: { chatId } },
      { w: 1 },
      err => {
        if (err) throw err
      })
    return 'Email連結成功'
  } catch (error) {
    console.log('connectMail')
    console.log('error: ', error)
    return 'Email連接異常，請稍候重試'
  }
}
