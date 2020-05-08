import defaultRequest from '@/utils/http/request'

export default req => {
  return defaultRequest.request({
    ...req,
    url: req.url || ''
  })
}
