import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import connectMongo from 'connect-mongo'
import ms from 'ms'
import fs from 'fs'
import https from 'https'
import path from 'path'
import dotenv from 'dotenv-flow'
import cors from './utils/http/cors.mjs'
import { client } from './db.mjs'
import router from './router/index.mjs'
import schedule from './schedule.mjs'
import history from 'connect-history-api-fallback'
import i18n from 'i18n'
import cookieParser from 'cookie-parser'

// telegram bot
import './bot/index.mjs'

dotenv.config()

const app = express()

app.use(cors)
app.use(history())

const jsonParser = bodyParser.json()
app.use(jsonParser)

const environment = process.env.NODE_ENV

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

const __dirname = path.resolve()

i18n.configure({
  // setup some locales - other locales default to en silently
  locales: ['en', 'zh-tw'],

  // sets a custom cookie name to parse locale settings from
  cookie: 'language',
  // where to store json files - defaults to './locales'
  directory: `${__dirname}/src/lang`,
  objectNotation: true
})

app.use(cookieParser())
app.use(i18n.init)

app.use(express.static('view/public'))
// router
router(app)

// for ssl
const privateKey = fs.readFileSync(`${__dirname}/ssl/private.key`)
const certificate = fs.readFileSync(`${__dirname}/ssl/certificate.crt`)
const credentials = { key: privateKey, cert: certificate }

const httpsServer = https.createServer(credentials, app)

const startServer = () => {
  console.log('Server is listening at http://localhost:3000')

  client.connect()
    .then(() => {
      console.log('db connect')
      schedule(i18n)
    })
    .catch(error => {
      console.error(error)
    })
}

if (environment === 'production') {
  httpsServer.listen(3000, () => {
    startServer()
  })
} else {
  app.listen(3000, async () => {
    startServer()
  })
}
