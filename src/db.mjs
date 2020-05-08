import Mongo from 'mongodb'

const MongoClient = Mongo.MongoClient

const url = 'mongodb://localhost:27017/aquarium'
export const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
