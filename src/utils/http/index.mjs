import defaultRequest from './request.mjs'

export default req => {
  return defaultRequest.request({
    ...req,
    url: req.url || ''
  })
}
