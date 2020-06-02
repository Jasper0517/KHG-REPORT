import Mongo from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()

const MongoClient = Mongo.MongoClient

const url = `mongodb://${process.env.DB_URL}/aquarium`
export const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
