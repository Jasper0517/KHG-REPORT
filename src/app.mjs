import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import connectMongo from 'connect-mongo'
import ms from 'ms'
import fs from 'fs'
import https from 'https'
import path from 'path'
import dotenv from 'dotenv'

import cors from './utils/http/cors.mjs'
import { client } from './db.mjs'
import router from './router/index.mjs'
import schedule from './schedule.mjs'
import history from 'connect-history-api-fallback'

// telegram bot
import './bot/index.mjs'

dotenv.config()

const app = express()

app.use(cors)
app.use(history())

const jsonParser = bodyParser.json()
app.use(jsonParser)

const MongoStore = connectMongo(session)
const sessionOption = {
  secret: 'khg-report-tw-jasper',
  store: new MongoStore({ url: `mongodb://${process.env.DB_URL}/session` }),
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: true,
    httpOnly: true,
    maxAge: ms('30d')
  }
}

app.use(session(sessionOption))
app.use(express.static('view/public'))
// router
router(app)

// for ssl
const __dirname = path.resolve()
const privateKey = fs.readFileSync(`${__dirname}/ssl/private.key`)
const certificate = fs.readFileSync(`${__dirname}/ssl/certificate.crt`)
const credentials = { key: privateKey, cert: certificate }

const httpsServer = https.createServer(credentials, app)
httpsServer.listen(3000, () => {
  console.log('Server is listening at http://localhost:3000')
  client.connect()
    .then(() => {
      console.log('db connect')
      schedule()
    })
    .catch(error => {
      console.error(error)
    })
})
// app.listen(3000, async () => {
//   console.log('Server is listening at http://localhost:3000')

//   // client.connect()
//   //   .then(() => {
//   //     console.log('db connect')
//   //     schedule()
//   //   })
//   //   .catch(error => {
//   //     console.error(error)
//   //   })
// })
