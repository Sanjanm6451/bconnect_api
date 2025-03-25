const db = require('../config/db');

const getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  const { name, price, description, image_url, stock } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO products (name, price, description, image_url, stock) VALUES (?, ?, ?, ?, ?)',
      [name, price, description, image_url, stock]
    );
    res.status(201).json({ id: result.insertId, name, price, description, image_url, stock });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  const { name, price, description, image_url, stock } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE products SET name = ?, price = ?, description = ?, image_url = ?, stock = ? WHERE id = ?',
      [name, price, description, image_url, stock, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ id: req.params.id, name, price, description, image_url, stock });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}; 