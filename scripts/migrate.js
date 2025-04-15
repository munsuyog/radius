// scripts/migrate.js
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Get the directory name equivalent to __dirname in CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config();

if (!process.env.NEXT_PUBLIC_DATABASE_CONNECTION_STRING) {
  console.error('Database connection string not found in environment variables');
  process.exit(1);
}

console.log('Starting database migration...');

try {
  // Run the migration script
  const migrationPath = join(__dirname, '../migrations/addShareAndProgressTables.js');
  execSync(`node --experimental-modules -r dotenv/config ${migrationPath}`, { stdio: 'inherit' });
  
  console.log('Migration completed successfully!');
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}