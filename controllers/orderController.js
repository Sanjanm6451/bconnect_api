const db = require('../config/db');

const getAllOrders = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT o.*, p.name as product_name, p.price as product_price 
      FROM orders o 
      JOIN products p ON o.product_id = p.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT o.*, p.name as product_name, p.price as product_price 
      FROM orders o 
      JOIN products p ON o.product_id = p.id 
      WHERE o.id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOrder = async (req, res) => {
  const { product_id, quantity } = req.body;
  const user_id = req.user.id;

  try {
    // Get product price
    const [product] = await db.query('SELECT price FROM products WHERE id = ?', [product_id]);
    if (product.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const total_price = product[0].price * quantity;

    // Create order
    const [result] = await db.query(
      'INSERT INTO orders (user_id, product_id, quantity, total_price, status) VALUES (?, ?, ?, ?, ?)',
      [user_id, product_id, quantity, total_price, 'pending']
    );

    res.status(201).json({
      id: result.insertId,
      user_id,
      product_id,
      quantity,
      total_price,
      status: 'pending'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT o.*, p.name as product_name, p.price as product_price 
      FROM orders o 
      JOIN products p ON o.product_id = p.id 
      WHERE o.user_id = ?
    `, [req.user.id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getUserOrders
}; 