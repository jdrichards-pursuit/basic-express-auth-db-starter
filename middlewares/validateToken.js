const jwt = require('jsonwebtoken')

const authenticateToken = (req, res, next) => {
  // Retrieve the token from the cookies
  const token = req.cookies['token']
  if (token === null)
    return res.sendStatus(401).json({ message: 'Unauthorized' }) // If no token, return 401 Unauthorized

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403).json({ message: 'Forbidden' }) // If token is not valid, return 403 Forbidden
    req.user = user // Add the user payload to the request object
    next() // Proceed to the next middleware or route handler
  })
}

module.exports = { authenticateToken }
