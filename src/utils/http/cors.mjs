const cors = async (req, res, next) => {
  const ctx = res
  // only for test,Don't use on prod.
  ctx.set('Access-Control-Allow-Origin', req.headers.origin)
  ctx.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild'
  )
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS, PATCH')
  ctx.set('Content-Type', 'application/json; charset=utf-8')
  ctx.set('Access-Control-Allow-Credentials', 'true')
  if (res.req.method === 'OPTIONS') {
    res.req.status = 200
  }
  await next()
}

export default cors
