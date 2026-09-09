const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const { protect } = require("../middlewares/auth.middleware");

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Manajemen Kategori
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Mengambil semua kategori
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar kategori
 *   post:
 *     summary: Membuat kategori baru
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Kategori berhasil dibuat
 */
router.get("/", categoryController.getAllCategories);
router.post("/", categoryController.createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Mengupdate kategori berdasarkan ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kategori berhasil diupdate
 *   delete:
 *     summary: Menghapus kategori berdasarkan ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kategori berhasil dihapus
 */
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;