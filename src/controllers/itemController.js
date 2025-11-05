import pool from '../config/db.js'

// Get all items for the logged-in user
export const getItems = async (req, res) => {
  try {
    const userId = req.user.id
    const result = await pool.query(
      'SELECT * FROM items WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch items', error: err.message })
  }
}

// Create new item
export const createItem = async (req, res) => {
  try {
    const userId = req.user.id
    const { title, description } = req.body

    if (!title) return res.status(400).json({ message: 'Title is required' })

    const result = await pool.query(
      `INSERT INTO items (title, description, user_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, description, userId]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Failed to create item', error: err.message })
  }
}

// Update item
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    const { title, description } = req.body

    const result = await pool.query(
      `UPDATE items
       SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [title, description, id, userId]
    )

    if (!result.rows.length)
      return res.status(404).json({ message: 'Item not found or unauthorized' })

    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Failed to update item', error: err.message })
  }
}

// Delete item
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const result = await pool.query(
      `DELETE FROM items WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId]
    )

    if (!result.rows.length)
      return res.status(404).json({ message: 'Item not found or unauthorized' })

    res.json({ message: 'Item deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete item', error: err.message })
  }
}
