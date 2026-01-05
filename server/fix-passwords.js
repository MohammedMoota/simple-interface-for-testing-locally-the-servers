// Fix passwords in database
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function fixPasswords() {
    console.log('🔧 Fixing user passwords...\n');

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: 'fyp_secure_db'
    });

    // Generate proper hash for admin123
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);

    console.log('New bcrypt hash:', hash);
    console.log('');

    // Update all users with this password
    const [result] = await connection.query(
        'UPDATE users SET password = ?',
        [hash]
    );

    console.log(`✅ Updated ${result.affectedRows} users with password: ${password}`);

    // Verify
    const [users] = await connection.query('SELECT id, email, role FROM users');
    console.log('\nUsers in database:');
    users.forEach(u => console.log(`  - ${u.email} (${u.role})`));

    console.log('\n🎉 All passwords set to: admin123');
    console.log('   Login with any user email + password "admin123"');

    await connection.end();
}

fixPasswords().catch(console.error);
