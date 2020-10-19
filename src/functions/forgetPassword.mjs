import nodemailer from 'nodemailer'

import {
  responseFormat,
  hashPassword,
  updateUserInfo,
  checkEmailIsExist
} from './tools.mjs'

export default async ({ email }, $t) => {
  if (!email) {
    return responseFormat({
      code: 400,
      msg: $t('forgetPassword.warning.0')
    })
  }

  // 檢查email是否存在
  const isExist = await checkEmailIsExist(email)
  if (!isExist[0]) {
    return responseFormat({
      code: 400,
      msg: $t('forgetPassword.warning.1')
    })
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ACCOUNT,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  const newPassword = Math.random().toString(36).substr(2)
  const mailOptions = {
    from: `KHG-Viewer <${process.env.EMAIL_ACCOUNT}`,
    to: email,
    subject: $t('forgetPassword.subject'),
    text: $t('forgetPassword.context', newPassword)
  }

  try {
    await transporter.sendMail(mailOptions)
    const hashNewPassword = hashPassword(newPassword)
    await updateUserInfo({ email, password: hashNewPassword })
  } catch (error) {
    console.log('error: ', error)
    return responseFormat({
      code: 400,
      msg: $t('forgetPassword.errorMessage')
    })
  }

  return responseFormat({
    code: 200,
    msg: ''
  })
}
