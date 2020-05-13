import { client } from '../db.mjs'

import bcrypt from 'bcrypt'

import crypto from 'crypto-js'

// 回應格式
export const responseFormat = (
  {
    code,
    msg,
    data
  }
) => {
  return {
    code,
    msg,
    data
  }
}

// 檢查email
export const checkEmailIsExist = async email => {
  const worker = async () => {
    const db = client.db()
    const collection = db.collection('user')
    try {
      return await collection.find({ email })
    } catch (error) {
      console.log('checkEmailIsExist')
      console.log('error: ', error)
    }
  }

  try {
    const cursor = await worker()
    const userInfo = await cursor.next()
    const hasNext = userInfo !== null
    return [hasNext, userInfo]
  } catch (error) {
    console.log('checkEmailIsExist')
    console.log('error: ', error)
    return true
  }
}

// 取得使用者資料
export const getUserInfo = async (email) => {
  try {
    const db = client.db()
    const collection = db.collection('user')
    const cursor = await collection.find({ email })
    const user = await cursor.next()
    return await user
  } catch (error) {
    console.log('getUserInfo')
    console.log('error: ', error)
    return null
  }
}

// 取得所有使用者資料
export const getAllUserInfo = async () => {
  try {
    const db = client.db()
    const collection = db.collection('user')
    const cursor = await collection.find()
    const allUsers = await cursor.toArray()
    return await allUsers
  } catch (error) {
    console.log('getUserInfo')
    console.log('error: ', error)
    return null
  }
}

// 更新使用者資料

export const updateUserInfo = async ({
  lastKH,
  lastTestingTime,
  email
}) => {

  if (!lastKH || !lastTestingTime || !email) {
    return
  }

  // 檢查email是否存在
  const isExist = await checkEmailIsExist(email)
  if (!isExist[0]) {
    return
  }

  // 寫入 MongoDb
  const db = client.db()
  const collection = db.collection('user')
  try {
    await collection.updateOne(
      { email },
      {
        $set: {
          lastKH,
          lastTestingTime
        }
      },
      { w: 1 },
      err => {
        if (err) throw err
      })
  } catch (error) {
    console.log('setting')
    console.log('error: ', error)
  }
}

// 比對密碼
export const comparePassword = async (email, password) => {
  const worker = async () => {
    const db = client.db()
    const collection = db.collection('user')
    try {
      return await collection.find({ email })
    } catch (error) {
      console.log('comparePassword')
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
    console.log('comparePassword')
    console.log('error: ', error)
    return false
  }
}

// 加密密碼
export const hashPassword = passowrd => bcrypt.hashSync(passowrd, 10)

// 加密密碼(可解密)
export const encryptPassword = password => {
  const secret = process.env.PASSWORD_KEY
  const encPassword = crypto.AES.encrypt(password, secret).toString()
  return crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(encPassword));
}

// 解密密碼
export const decryptPassword = password => {
  const secret = process.env.PASSWORD_KEY
  let decData = crypto.enc.Base64.parse(password).toString(crypto.enc.Utf8);
  const bytes = crypto.AES.decrypt(decData, secret)
  return bytes.toString(crypto.enc.Utf8)
}