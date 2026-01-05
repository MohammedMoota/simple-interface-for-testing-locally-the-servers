// Database Setup Script
// Run with: node setup-db.js
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
    console.log('🔧 FYP Secure Database Setup\n');

    // First connect without database to create it
    let connection;
    try {
        console.log('📡 Connecting to MySQL...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true
        });
        console.log('✅ Connected to MySQL!\n');
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.log('\n💡 Tips:');
        console.log('   1. Make sure MySQL is running');
        console.log('   2. Check your password in .env file');
        console.log('   3. Try different passwords: empty, "root", "123456"');
        process.exit(1);
    }

    try {
        // Read and execute schema
        console.log('📄 Reading schema file...');
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('🚀 Executing schema...');
        await connection.query(schema);

        console.log('✅ Database created successfully!\n');

        // Verify
        const [users] = await connection.query('SELECT COUNT(*) as count FROM fyp_secure_db.users');
        console.log(`📊 Total users in database: ${users[0].count}`);

        const [admins] = await connection.query('SELECT email FROM fyp_secure_db.users WHERE role = "Admin"');
        console.log('👤 Admin accounts:');
        admins.forEach(a => console.log(`   - ${a.email}`));

        console.log('\n🎉 Setup complete! You can now run: npm start');

    } catch (error) {
        console.error('❌ Schema execution failed:', error.message);
    } finally {
        await connection.end();
    }
}

setupDatabase();
