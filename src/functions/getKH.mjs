import { getUserInfo, updateUserInfo } from './tools.mjs'
import { EDAC } from './connectKHG.mjs'
import { sendMessage } from '../bot/index.mjs'

import moment from 'moment'

export default async email => {
  const user = await getUserInfo(email)
  if (user.chatId) {
    if (!user.url || !user.KHGPassword || !user.EDAPKey) return
    // login khg
    // await KHGLogin({ url: user.url, password: decryptPassword(user.KHGPassword) })
    // // wait for 2 seconds
    // await new Promise(
    //   resolve => setTimeout(() => {
    //     resolve()
    //   }, 2000)
    // )
    // get system infomation
    const EDACData = await EDAC({ EAPK: user.EDAPKey, url: user.url })
    // system last testing time
    const lastTestingTime = moment(new Date(`${new Date().getFullYear()}/${EDACData.lastTestingTime}`))
    // report last testing time
    const userRecordLastTestingTime = new Date(`${new Date().getFullYear()}/${user.lastTestingTime}`)
    // check last time testing is after
    const isAfter = moment(lastTestingTime).isAfter(userRecordLastTestingTime)
    if (isAfter) {
      // update user info
      updateUserInfo({ email, lastKH: EDACData.lastKH, lastTestingTime: EDACData.lastTestingTime })
      // send message to telegram
      sendMessage(user.chatId, `lastKH: ${EDACData.lastKH}, lastTime: ${EDACData.lastTestingTime}`)
    }
  }
}
