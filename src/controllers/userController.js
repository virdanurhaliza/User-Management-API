import pool from '../config/db.js'
import cloudinary from '../config/cloudinary.js'
import streamifier from 'streamifier'
import bcrypt from 'bcryptjs'

export const getUsers = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, username, email, role, avatar_url FROM users'
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: 'Failed to get users', error: err.message })
  }
}

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })

    const uploadStream = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'avatars' },
          (err, result) => (err ? reject(err) : resolve(result))
        )
        streamifier.createReadStream(req.file.buffer).pipe(stream)
      })

    const result = await uploadStream()
    const { id } = req.user

    await pool.query('UPDATE users SET avatar_url = $1 WHERE id = $2', [
      result.secure_url,
      id
    ])

    res.json({ message: 'Avatar uploaded successfully', url: result.secure_url })
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.user
    const { username, email, password } = req.body

    if (!username && !email && !password)
      return res.status(400).json({ message: 'No data provided for update' })

    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id])
    if (rows.length === 0)
      return res.status(404).json({ message: 'User not found' })

    const updatedUser = {
      username: username || rows[0].username,
      email: email || rows[0].email,
      password: password ? await bcrypt.hash(password, 10) : rows[0].password
    }

    await pool.query(
      `UPDATE users 
       SET username = $1, email = $2, password = $3, updated_at = NOW() 
       WHERE id = $4`,
      [updatedUser.username, updatedUser.email, updatedUser.password, id]
    )

    res.json({ message: 'Profile updated successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message })
  }
}

export const deleteProfile = async (req, res) => {
  try {
    const { id } = req.user
    await pool.query('DELETE FROM users WHERE id = $1', [id])
    res.json({ message: 'User deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message })
  }
}