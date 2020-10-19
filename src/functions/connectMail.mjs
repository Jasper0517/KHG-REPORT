import { checkEmailIsExist } from './tools.mjs'

import { client } from '../db.mjs'

export default async (email, chatId, i18n) => {
  const isExist = await checkEmailIsExist(email)
  // 檢查Email
  if (!isExist[0]) return 'Email Not Exist, Email不存在'
  const user = isExist[1]
  i18n.setLocale(user.language || 'zh-tw')
  // 寫入 MongoDb
  const db = client.db()
  const collection = db.collection('user')
  try {
    await collection.updateOne(
      { email },
      { $set: { chatId, notification: true } },
      { w: 1 },
      err => {
        if (err) throw err
      })
    return i18n.__('connectEamil.success')
  } catch (error) {
    console.log('connectMail')
    console.log('error: ', error)
    return i18n.__('connectEamil.failure')
  }
}
