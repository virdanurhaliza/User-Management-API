import pool from '../config/db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password)
      return res.status(400).json({ message: 'All fields are required' })

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email))
      return res.status(400).json({ message: 'Invalid email format' })

    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' })

    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (existingUser.rows.length)
      return res.status(400).json({ message: 'Email already registered' })

    const hashed = await bcrypt.hash(password, 10)
    const query = `
      INSERT INTO users (username, email, password, role)
      VALUES ($1, $2, $3, 'user')
      RETURNING id, username, email, role
    `
    const { rows } = await pool.query(query, [username, email, hashed])

    res.status(201).json({
      message: 'User registered successfully',
      user: rows[0]
    })
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' })

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email))
      return res.status(400).json({ message: 'Invalid email format' })

    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (!rows.length) return res.status(404).json({ message: 'User not found' })

    const valid = await bcrypt.compare(password, rows[0].password)
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' })

    const token = jwt.sign(
      { id: rows[0].id, email: rows[0].email, role: rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    )

    res.json({
      message: 'Login successful',
      token,
      user:{
        id: rows[0].id,
        username: rows[0].username,
        role: rows[0].role
      }
    })
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message })
  }
}