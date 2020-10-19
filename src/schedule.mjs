import schedule from 'node-schedule'

import {
  getKH
} from './functions/index.mjs'

import {
  getAllUserInfo
} from './functions/tools.mjs'

export default i18n => {
  schedule.scheduleJob('0 0 * * * *', async () => {
    const users = await getAllUserInfo()
    for (let i = 0; i < users.length; i++) getKH(users[i], i18n)
  })
}
