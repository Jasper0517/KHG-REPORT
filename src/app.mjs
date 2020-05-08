import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import connectMongo from 'connect-mongo'

import cors from './utils/http/cors.mjs'

import { client } from './db.mjs'

import router from './router/index.mjs'

// telegram bot
import './bot/index.mjs'

const app = express()

app.use(cors)

const jsonParser = bodyParser.json()
app.use(jsonParser)

const MongoStore = connectMongo(session)
const sessionOption = {
  secret: 'khg-report-tw-jasper',
  store: new MongoStore({ url: 'mongodb://localhost:27017/session' }),
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 1000 }
}

app.use(session(sessionOption))

router(app)

// Listen for any kind of message. There are different kinds of
// messages.

// const login = async () => {
//   const loginData = qs.stringify({ password: 'Admin', button: 'Login' })
//   await axios(
//     {
//       url: 'http://220.134.66.121:8090/Login',
//       method: 'POST',
//       data: loginData
//     }
//   )
// }
// const EDAC = async () => {
//   const EDACData = qs.stringify({ EAPK: 'EAPK' })
//   const { data } = await axios(
//     {
//       url: 'http://220.134.66.121:8090/EDAC',
//       method: 'POST',
//       data: EDACData
//     }
//   )
//   const $ = cheerio.load(data)
//   const tbody = $('body')
//   return EDACPaser(tbody.text())
// }

// const EDACPaser = EDAC => {
//   if (!EDAC) return
//   const data = EDAC.replace(/</g, '').replace(/>/g, ',').replace(/\n/g, '').split(',')
//   const formatedEDAC = {}
//   formatedEDAC.rountineTime = +data[1].trim()
//   formatedEDAC.resetTime = +data[14].trim()
//   formatedEDAC.port = +data[12].trim()
//   formatedEDAC.lastKH = +data[5].trim()
//   formatedEDAC.lastTestingTime = data[15].trim()
//   formatedEDAC.nextTime = +data[14].trim()
//   return formatedEDAC
// }

// const getApi = async () => {
//   await login()
//   await new Promise(resolve => setTimeout(() => {
//     resolve()
//   }, 4000))
//   return await EDAC()
// }

app.listen(3000, async () => {
  // setInterval(async () => {

  // }, 60 * 1000);
  console.log('Server is listening at http://localhost:3000')

  client.connect()
    .then(() => {
      console.log('db connect')
    })
    .catch(error => {
      console.error(error)
    })

  // let KH;
  // try {
  //   KH = await getApi();
  // } catch (error) {
  //   console.log('error: ', error);
  // }
  // console.log(`KH: ${KH.lastKH}, 最後測量時間: ${KH.lastTestingTime}`);
  // bot.sendMessage(522955751, `KH: ${KH.lastKH}, 最後測量時間: ${KH.lastTestingTime}`);
})
