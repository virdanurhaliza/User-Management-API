import express from 'express'
import { verifyToken } from '../middleware/auth.js'
import {
  getItems,
  createItem,
  updateItem,
  deleteItem
} from '../controllers/itemController.js'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Items
 *   description: CRUD untuk data items milik user
 */

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Ambil semua item milik user login
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil data items
 */
router.get('/', verifyToken, getItems)

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Tambah item baru
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Item berhasil ditambahkan
 */
router.post('/', verifyToken, createItem)

/**
 * @swagger
 * /items/{id}:
 *   put:
 *     summary: Update item berdasarkan ID
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *             example:
 *               title: Belajar React Lanjutan
 *               description: Update dari CRUD app sebelumnya
 *     responses:
 *       200:
 *         description: Item berhasil diperbarui
 *       400:
 *         description: Input tidak valid
 *       401:
 *         description: Token tidak valid
 */
router.put('/:id', verifyToken, updateItem)

/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: Hapus item berdasarkan ID
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID item
 *     responses:
 *       200:
 *         description: Item berhasil dihapus
 */
router.delete('/:id', verifyToken, deleteItem)

export default router