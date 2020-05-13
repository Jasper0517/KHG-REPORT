import request from '../utils/http/index.mjs'
import qs from 'qs'
import cheerio from 'cheerio'

export const login = async ({ url, password }) => {
  const loginData = qs.stringify({ password, button: 'Login' })
  await request({
    url: `${url}/Login`,
    method: 'POST',
    data: loginData
  }).catch(error => {
    console.log('KHG-login')
    console.log(error)
  })
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
  return EDACPaser(tbody.text())
}

const EDACPaser = EDAC => {
  if (!EDAC) return
  const data = EDAC.replace(/</g, '')
    .replace(/>/g, ',')
    .replace(/\n/g, '')
    .split(',')
  const formatedEDAC = {}
  formatedEDAC.rountineTime = +data[1].trim()
  formatedEDAC.resetTime = +data[14].trim()
  formatedEDAC.port = +data[12].trim()
  formatedEDAC.lastKH = +data[5].trim()
  formatedEDAC.lastTestingTime = data[15].trim()
  formatedEDAC.nextTime = +data[14].trim()
  return formatedEDAC
}
