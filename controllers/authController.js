const express = require('express')
const bcrypt = require('bcrypt')
const { generateToken } = require('../utils/token')
const { findUserByUsername, createUser } = require('../queries/users')
const auth = express.Router()

// Login route
auth.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await findUserByUsername(username)
    console.log('user', user)
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const validPassword = await bcrypt.compare(password, user.password_hash)
    console.log('validpass', validPassword)

    if (!validPassword)
      return res.status(401).json({ message: 'Invalid credentials' })

    const token = generateToken(user)
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    })

    console.log('token', token)
    res.status(200).json({
      message: 'Logged in successfully',
      user: user.email,
      id: user.id,
      email: user.email,
    })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ message: 'An error occurred during the login process.' })
  }
})

// Register route
auth.post('/register', async (req, res) => {
  const { username, password, email } = req.body
  try {
    // Check if user already exists
    const existingUser = await findUserByUsername(username)
    if (existingUser) {
      return res.status(409).json({ message: 'Username already taken' })
    }

    // Hash password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user in the database
    const newUser = await createUser({
      username,
      passwordHash: hashedPassword,
      email,
    })

    // Generate token (optional, if you want to log the user in immediately)
    const token = generateToken(newUser)

    // Set token in HTTP-only cookie (optional, for immediate login)
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    })

    // Respond with success message (or token/user info if needed)
    res.status(201).json({ message: 'User registered successfully', newUser })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ message: 'An error occurred during the registration process.' })
  }
})

auth.get('/logout', (req, res) => {
  res.clearCookie('token')
  res.status(200).json({ message: 'Logged out successfully' })
})

module.exports = auth
