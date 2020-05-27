import { getUserInfo, updateUserInfo } from './tools.mjs'
import { EDAC } from './connectKHG.mjs'
import { sendMessage } from '../bot/index.mjs'

import moment from 'moment'

export default async user => {
  if (user.chatId) {
    if (!user.url || !user.KHGPassword || !user.EDAPKey) return
    // get system infomation
    const EDACData = await EDAC({ EAPK: user.EDAPKey, url: user.url })
    // system last testing time
    const lastTestingTime = moment(new Date(`${new Date().getFullYear()}/${EDACData.lastTestingTime}`))
    // report last testing time
    const userRecordLastTestingTime = user.lastTestingTime === null ? null : new Date(`${new Date().getFullYear()}/${user.lastTestingTime}`)
    // check last time testing is after
    const isAfter = userRecordLastTestingTime === null ? true : moment(lastTestingTime).isAfter(userRecordLastTestingTime)
    if (isAfter && user.notification) {
      // update user info
      updateUserInfo({ email: user.email, lastKH: EDACData.lastKH, lastTestingTime: EDACData.lastTestingTime })
      // send message to telegram
      sendMessage(user.chatId, `lastKH: ${EDACData.lastKH}, lastTime: ${EDACData.lastTestingTime}`)
    }
  }
}
