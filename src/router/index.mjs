import {
  signup,
  login,
  setting
} from '../functions/index.mjs'

export default app => {
  app.post('/signup', async (req, res) => {
    const body = req.body
    const resData = await signup(body)
    res.send(resData)
  })

  app.post('/login', async (req, res) => {
    const body = req.body
    const resData = await login(body, req.session)
    res.send(resData)
  })

  app.patch('/setting', async (req, res) => {
    const body = req.body
    const resData = await setting(body)
    res.send(resData)
  })
}
