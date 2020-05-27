import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import connectMongo from 'connect-mongo'
import ms from 'ms'

import cors from './utils/http/cors.mjs'

import { client } from './db.mjs'

import router from './router/index.mjs'

import schedule from './schedule.mjs'

// telegram bot
import './bot/index.mjs'

const app = express()

app.use(cors)

const jsonParser = bodyParser.json()
app.use(jsonParser)

const MongoStore = connectMongo(session)
const sessionOption = {
  secret: 'khg-report-tw-jasper',
  store: new MongoStore({ url: 'mongodb://172.17.0.3:27017/session' }),
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: ms('30d') }
}

app.use(session(sessionOption))
router(app)

app.listen(3000, async () => {
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
