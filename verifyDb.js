const db = require('./config/db');

async function verifyDatabase() {
  try {
    // Test database connection
    const [result] = await db.query('SELECT 1');
    console.log('Database connection successful');

    // Check if admin user exists
    const [adminUsers] = await db.query('SELECT * FROM users WHERE email = ?', ['admin@bconnect.com']);
    
    if (adminUsers.length > 0) {
      console.log('Admin user found:', {
        id: adminUsers[0].id,
        email: adminUsers[0].email,
        role: adminUsers[0].role
      });
    } else {
      console.log('Admin user not found');
    }

    // List all users
    const [allUsers] = await db.query('SELECT id, email, role FROM users');
    console.log('\nAll users in database:', allUsers);

  } catch (error) {
    console.error('Database verification failed:', error);
  } finally {
    process.exit();
  }
}

verifyDatabase(); 