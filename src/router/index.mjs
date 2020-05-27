import {
  signup,
  login,
  setting,
  connectKHG,
  tools
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
  app.post('/signup', async (req, res) => {
    const body = req.body
    const resData = await signup(body)
    res.statusCode = resData.code
    res.send(resData)
  })

  app.post('/login', async (req, res) => {
    const body = req.body
    // const { language } = req.headers
    const resData = await login(body, req.session)
    res.statusCode = resData.code
    res.send(resData)
  })

  app.patch('/setting', async (req, res) => {
    const body = req.body
    const resData = await setting(body)
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
}
