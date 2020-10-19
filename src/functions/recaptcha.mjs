import GoogleRecaptcha from 'google-recaptcha'
import dotenv from 'dotenv-flow'
dotenv.config()

export default new GoogleRecaptcha({ secret: process.env.GOOGLE_RECAPTCHA_SECRET })
