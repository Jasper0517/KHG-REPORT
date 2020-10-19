import request from '../utils/http/index.mjs'
import qs from 'qs'
import cheerio from 'cheerio'
import moment from 'moment'

import {
  responseFormat
} from './tools.mjs'

export const KHGLogin = async ({ url, password }) => {
  const loginData = qs.stringify({ password, button: 'Login' })
  try {
    await request({
      url: `${url}/Login`,
      method: 'POST',
      data: loginData
    })
  } catch (error) {
    console.log('KHG-login')
    console.log(error)
  }
}
export const EDAC = async ({ EAPK, url }) => {
  const EDACData = qs.stringify({ EAPK })
  const data = await request({
    url: `${url}/EDAC`,
    method: 'POST',
    data: EDACData
  })
  const $ = cheerio.load(data)
  const tbody = $('body')
  return EDACParser(tbody.text())
}

const EDACParser = EDAC => {
  if (!EDAC) return
  const data = EDAC.replace(/</g, '')
    .replace(/>/g, ',')
    .replace(/\n/g, '')
    .split(',')
  const formateEDAC = {}
  formateEDAC.rountineTime = +data[1].trim()
  formateEDAC.resetTime = +data[14].trim()
  formateEDAC.port = +data[12].trim()
  formateEDAC.lastKH = +data[5].trim()
  formateEDAC.lastTestingTime = data[15].trim()
  formateEDAC.nextTime = +data[14].trim()
  return formateEDAC
}

export const getKHRecord = async ({
  url
}) => {
  try {
    const data = await request({
      url: `${url}/SD_Dump`,
      method: 'POST'
    })
    const unFormateData = []
    const $ = cheerio.load(data)
    const tbody = $('tbody')
    const tableTd = tbody.eq(0).find('td')
    for (let i = 0; i < tableTd.length - 1; i++) {
      unFormateData.push(tableTd.eq(i).text())
    }
    return logParser(unFormateData.map(item => { return { item } }).reverse())
  } catch (error) {
    console.log('getKHRecord')
    console.log(error)
  }
}

const logParser = record => {
  // 上個月第一天
  const starts = moment().startOf('month').subtract(1, 'month')
  // 這個月+上個月總天數
  const totalDays = moment(moment().month() - 1).daysInMonth() + moment().daysInMonth()
  // filter以上條件外的資料
  const multipleOriginLog = JSON.parse(JSON.stringify(record))
  const filterOriginLog = []
  for (let i = 0; i < multipleOriginLog.length; i++) {
    // 每筆log date
    const date = moment(`${new Date().getFullYear()}/${multipleOriginLog[i].item.replace(/\r\n|\n/g, '').substring(1, 6)}`, moment.ISO_8601)
    // 相差上個月幾天
    const diffDate = date.diff(starts, 'days')
    // 如果找完上個月份的就終止
    if (totalDays < diffDate) break
    filterOriginLog.push(multipleOriginLog[i])
  }

  // max count 800
  const originData = filterOriginLog.length > 800 ? filterOriginLog.splice(0, 800) : filterOriginLog

  // formate data
  const formateData = originData.map(({ item }) => {
    const hasPH = item.indexOf('pH:') >= 0
    const newData = item.replace(' AK. ', ' ').replace(' AK.', ' ').split(' ')
    const obj = {}
    obj.date = newData[0].replace(/\r\n|\n/g, '').trim()
    obj.time = newData[1]
    if (newData[2].indexOf('W') === 0) {
      obj.KH = +newData[hasPH ? 9 : 6].replace(':', '')
      obj.isKHRecord = true
      obj.distance = +newData[2].replace('W.', '')
      obj.AK = +newData[4]
      obj.error = newData[3]
    } else {
      const message = newData.splice(2).join(' ')
      if (message.indexOf('ERR') >= 0) obj.isError = true
      obj.isKHRecord = false
      obj.message = message
    }
    return obj
  })

  return formateData
}

export const normalApiControl = async ({ actName, url }) => {
  try {
    const data = qs.stringify({ ACT_NAME: actName })
    await request({
      url: `${url}/Default`,
      method: 'POST',
      data
    })
    return responseFormat({
      code: 200,
      msg: ''
    })
  } catch (error) {
    return responseFormat({
      code: 400,
      msg: ''
    })
  }
}

export default {
  KHGLogin,
  EDAC,
  getKHRecord,
  normalApiControl
}
