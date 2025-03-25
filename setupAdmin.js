const bcrypt = require('bcryptjs');
const db = require('./config/db');

async function setupAdmin() {
  try {
    // Check if admin already exists
    const [existingAdmins] = await db.query('SELECT * FROM users WHERE email = ?', ['admin@bconnect.com']);
    
    if (existingAdmins.length > 0) {
      console.log('Admin user already exists');
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);

    // Insert admin user
    await db.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      ['admin', 'admin@bconnect.com', hashedPassword, 'admin']
    );

    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error setting up admin:', error);
  } finally {
    process.exit();
  }
}

setupAdmin(); 