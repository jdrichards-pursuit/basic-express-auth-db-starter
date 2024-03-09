const express = require('express')
const user = express.Router()

const { authenticateToken } = require('../middlewares/validateToken')

user.get('/', authenticateToken, async (req, res) => {
  res.json({ message: 'User controller' })
})

module.exports = user
