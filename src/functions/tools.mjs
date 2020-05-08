import { client } from '../db.mjs'

import bcrypt from 'bcrypt'

export const responseFormat = (
  {
    code,
    msg
  }
) => {
  return {
    code,
    msg
  }
}

export const checkEmailIsExist = async email => {
  // 寫入 MongoDb
  const worker = async () => {
    const db = client.db()
    const collection = db.collection('user')
    try {
      return await collection.find({ email })
    } catch (error) {
      console.log('error: ', error)
    }
  }

  // 回應
  try {
    const cursor = await worker()
    return await cursor.hasNext()
  } catch (error) {
    console.log('error: ', error)
    return true
  }
}

export const comparePassword = async (email, password) => {
  // 寫入 MongoDb
  const worker = async () => {
    const db = client.db()
    const collection = db.collection('user')
    try {
      return await collection.find({ email })
    } catch (error) {
      console.log('error: ', error)
    }
  }

  // 回應
  try {
    const cursor = await worker()
    const isExist = await cursor.hasNext()
    if (isExist) {
      const user = await cursor.next()
      return bcrypt.compareSync(password, user.password)
    } else {
      return false
    }
  } catch (error) {
    console.log('error: ', error)
    return true
  }
}

// 加密密碼
export const hashPassword = passowrd => bcrypt.hashSync(passowrd, 10)
