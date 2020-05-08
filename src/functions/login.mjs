import {
  responseFormat,
  checkEmailIsExist,
  comparePassword,
  hashPassword
} from './tools.mjs'

export default async ({
  email,
  password
}, session) => {
  // 基本防呆
  if (!email || !password) {
    return responseFormat({
      code: 400,
      msg: '欄位不可以為空'
    })
  }

  // 檢查email是否存在
  if (!await checkEmailIsExist(email)) {
    return responseFormat({
      code: 400,
      msg: 'email不存在，請註冊'
    })
  }

  if (!await comparePassword(email, password)) {
    return responseFormat({
      code: 400,
      msg: '登入資料錯誤請重新輸入'
    })
  }

  session.email = email
  session.password = hashPassword(password)

  return responseFormat({
    code: 0,
    msg: ''
  })
}
