const { Buffer } = require('buffer')
const { forLog } = require('../jwt/index.js')
const { User } = require('../db/index.js')

async function logMiddle(req, res, next) {
  const cookie = req.headers['x-has-cookie']
  if (!cookie) return res.status(404).json({ err: 'unauthed' })
  const deJWT = await forLog(cookie)
  if (!deJWT) return res.status(404).json({ err: 'Pls logIn again' })
  req.headers['Uuser']=deJWT[1].data
  return next()

}

module.exports = {
  logMiddle
}
