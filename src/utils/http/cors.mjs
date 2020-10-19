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
  ctx.set('Access-Control-Allow-Credentials', 'true')
  if (res.req.method === 'OPTIONS') {
    res.req.status = 200
  }
  await next()
}

export default cors
