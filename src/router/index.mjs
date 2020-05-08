import {
  signup,
  login
} from '../functions/index.mjs'

export default app => {
  app.post('/signup', async (req, res) => {
    const body = req.body
    const resdata = await signup(body)
    res.send(resdata)
  })

  app.post('/login', async (req, res) => {
    console.log(req.session)
    const body = req.body
    const resdata = await login(body, req.session)
    res.send(resdata)
  })
}
