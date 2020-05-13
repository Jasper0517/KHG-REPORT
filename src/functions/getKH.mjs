import { getUserInfo, decryptPassword, updateUserInfo } from './tools.mjs'
import { login, EDAC } from './connectKHG.mjs'
import { sendMessage } from '../bot/index.mjs'

import moment from 'moment'

export default async email => {
  let user = await getUserInfo(email)
  if (user.chatId) {
    if (!user.url || !user.KHGPassword || !user.EDAPKey) return
    await login({ url: user.url, password: decryptPassword(user.password) })
    await new Promise(reslove => setTimeout(() => reslove(), 2000))
    const EDACData = await EDAC({ EAPK: user.EDAPKey, url: user.url })
    updateUserInfo({ email, lastKH: EDACData.lastKH, lastTestingTime: EDACData.lastTestingTime })
    user = await getUserInfo(email)
    const lastTestingTime = moment(`${new Date().getFullYear()} ${EDACData.lastTestingTime}`)
    const userRecordLastTestingTime = moment(`${new Date().getFullYear()} ${user.lastTestingTime}`)
    const isAfter = moment(lastTestingTime).isAfter(userRecordLastTestingTime)
    if (isAfter) {
      sendMessage(user.chatId, `lastKH: ${EDACData.lastKH}, lastTime: ${EDACData.lastTestingTime}`)
    }
  }
}