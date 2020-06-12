import {
  responseFormat,
  checkEmailIsExist,
  comparePassword
} from './tools.mjs'

export default async ({
  email,
  password
}, session, $t) => {
  if (session.email && !email) email = session.email
  if (session.password && !password) password = session.password

  // 基本防呆
  if (!email || !password) {
    return responseFormat({
      code: 400,
      msg: $t('login.warning.0')
    })
  }
  // 檢查email是否存在
  const isExist = await checkEmailIsExist(email)
  if (!isExist[0]) {
    return responseFormat({
      code: 400,
      msg: $t('login.warning.1')
    })
  }

  if (!await comparePassword(email, password)) {
    return responseFormat({
      code: 400,
      msg: $t('login.warning.2')
    })
  }

  session.email = email
  session.password = password

  const {
    EDAPKey,
    KHGPassword,
    url,
    role,
    notification,
    isSetting
  } = isExist[1]
  return responseFormat({
    code: 200,
    msg: '',
    data: {
      email,
      EDAPKey,
      KHGPassword,
      url,
      role,
      notification,
      isSetting
    }
  })
}
