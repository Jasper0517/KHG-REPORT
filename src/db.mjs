import Mongo from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()

const MongoClient = Mongo.MongoClient

const url = process.env.DB_URL
export const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
