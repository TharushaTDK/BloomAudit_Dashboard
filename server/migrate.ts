import pool from './db';
import fs from 'fs';
import path from 'path';

async function migrate() {
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const sql = fs.readFileSync(schemaPath, 'utf8');
        
        console.log('🚀 Starting database migration...');
        await pool.query(sql);
        console.log('✅ Users table created successfully!');
        
        process.exit(0);
    } catch (err: any) {
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    }
}

migrate();
