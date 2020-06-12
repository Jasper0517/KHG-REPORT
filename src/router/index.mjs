import {
  signup,
  login,
  setting,
  connectKHG,
  tools,
  recaptcha,
  forgetPassword,
  changePassword
} from '../functions/index.mjs'

const {
  KHGLogin,
  EDAC,
  getKHRecord,
  normalApiControl
} = connectKHG

const {
  responseFormat
} = tools

export default app => {
  app.get('/hello', (req, res) => {
    res.send('hello khg-report')
  })

  app.post('/signup', async (req, res) => {
    const body = req.body
    const resData = await signup(body, req)
    res.statusCode = resData.code
    res.send(resData)
  })

  app.post('/login', async (req, res) => {
    const body = req.body
    const resData = await login(body, req.session, req.__)
    res.statusCode = resData.code
    res.send(resData)
  })

  app.patch('/setting', async (req, res) => {
    const body = req.body
    const resData = await setting(body, req.__)
    res.statusCode = resData.code
    res.send(resData)
  })

  app.patch('/changePassword', async (req, res) => {
    const body = req.body
    const resData = await changePassword(body, req.__)
    res.statusCode = resData.code
    res.send(resData)
  })

  app.post('/forgetPassword', async (req, res) => {
    const body = req.body
    const resData = await forgetPassword(body, req.__)
    res.statusCode = resData.code
    res.send(resData)
  })

  app.get('/logout', async (req, res) => {
    req.session.cookie = {}
    req.session.email = ''
    req.session.password = ''
    res.send({ code: 200, message: '' })
  })

  app.post('/KHGLogin', async (req, res) => {
    const body = req.body
    try {
      await KHGLogin(body)
      res.send(responseFormat({
        code: 200,
        msg: ''
      }))
    } catch (error) {
      res.statusCode = 400
      res.send(error)
    }
  })

  app.post('/EDAC', async (req, res) => {
    const body = req.body
    try {
      const resData = await EDAC(body)
      res.send(responseFormat({
        code: 200,
        msg: '',
        data: resData
      }))
    } catch (error) {
      res.statusCode = 400
      res.send()
    }
  })

  app.post('/getKHRecord', async (req, res) => {
    const body = req.body
    try {
      const resData = await getKHRecord(body)
      res.send(responseFormat({
        code: 200,
        msg: '',
        data: resData
      }))
    } catch (error) {
      res.statusCode = 400
      res.send()
    }
  })

  app.post('/normalApiControl', async (req, res) => {
    const body = req.body
    try {
      const resData = await normalApiControl(body)
      res.send(resData)
    } catch (error) {
      res.statusCode = 400
      res.send()
    }
  })

  app.post('/verifyRecaptcha', async (req, res) => {
    const recaptchaResponse = req.body['g-recaptcha-response']
    recaptcha.verify({ response: recaptchaResponse }, (error) => {
      if (error) {
        return res.send(
          responseFormat({
            code: 200,
            data: false
          })
        )
      }
      return res.send(
        responseFormat({
          code: 200,
          data: true
        })
      )
    })
  })
}
