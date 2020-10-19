const cors = async (req, res, next) => {
  const ctx = res
  // only for test,Don't use on prod.
  if (process.env.NODE_ENV === 'development') {
    ctx.set('Access-Control-Allow-Origin', req.headers.origin)
  } else {
    ctx.set('Access-Control-Allow-Origin', 'https://khg-viewer.jasper-tw.com')
  }
  ctx.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , language'
  )
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS, PATCH')
  // const url = res.req.url
  // console.log('url: ', `${req.protocol}://${req.headers.host}/`)
  // console.log(req.route)
  // if (url.indexOf('.css') >= 0) {
  //   ctx.set('Content-Type', 'text/css')
  // } else if (url.indexOf('.js') >= 0) {
  //   ctx.set('Content-Type', 'application/javascript;')
  // } else {
  //   ctx.set('Content-Type', 'application/json; text/html; charset=utf-8;')
  // }
  // req.accepts(['html', 'json', 'text'])
  ctx.set('Access-Control-Allow-Credentials', 'true')
  if (res.req.method === 'OPTIONS') {
    res.req.status = 200
  }
  await next()
}

export default cors
