import express from 'express'
import { getUsers, uploadAvatar, updateProfile, deleteProfile } from '../controllers/userController.js'
import { verifyToken } from '../middleware/auth.js'
import upload from '../middleware/upload.js'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoint untuk manajemen user
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Mendapatkan semua data user
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan data user
 *       401:
 *         description: Token tidak valid atau belum login
 */
router.get('/', verifyToken, getUsers)

/**
 * @swagger
 * /users/avatar:
 *   post:
 *     summary: Upload foto profil (avatar)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar berhasil diupload
 *       400:
 *         description: Tidak ada file yang diupload
 *       401:
 *         description: Token tidak valid
 */
router.post('/avatar', verifyToken, upload.single('file'), uploadAvatar)

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Update profil user sendiri
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Profil berhasil diperbarui
 *       400:
 *         description: Input tidak valid
 *       401:
 *         description: Token tidak valid
 */
router.put('/me', verifyToken, updateProfile)

/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: Hapus akun user sendiri
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Akun berhasil dihapus
 *       401:
 *         description: Token tidak valid
 *       500:
 *         description: Terjadi kesalahan server
 */
router.delete('/me', verifyToken, deleteProfile)

export default router