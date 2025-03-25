const bcrypt = require('bcryptjs');
const db = require('./config/db');

async function cleanupAdmin() {
  try {
    // Delete all existing admin users
    await db.query('DELETE FROM users WHERE role = ?', ['admin']);
    console.log('Cleaned up existing admin users');

    // Create new admin user with proper password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);

    await db.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      ['admin', 'admin@bconnect.com', hashedPassword, 'admin']
    );

    console.log('Created new admin user successfully');

    // Verify the new admin user
    const [adminUsers] = await db.query('SELECT * FROM users WHERE email = ?', ['admin@bconnect.com']);
    if (adminUsers.length > 0) {
      console.log('Admin user verified:', {
        id: adminUsers[0].id,
        email: adminUsers[0].email,
        role: adminUsers[0].role
      });
    }

  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    process.exit();
  }
}

cleanupAdmin(); 