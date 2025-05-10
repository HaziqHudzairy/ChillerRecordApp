import { openDatabaseSync } from 'expo-sqlite';

// Open the database
const db = openDatabaseSync('chillerRecords.db');

// Function to initialize database tables
export const setupDatabase = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS chiller_records (
        record_id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        record_time TEXT NOT NULL,
        Te REAL NOT NULL,
        Pe REAL NOT NULL,
        Tc REAL NOT NULL,
        Pcom REAL NOT NULL,
        Tcon REAL NOT NULL,
        Pcon REAL NOT NULL,
        Tev REAL NOT NULL
      );
    `);
    console.log('✅ Chiller Records table created successfully');
  } catch (error) {
    console.error('❌ Error creating table:', error);
  }
};

export const resetDatabase = async () => {
  try {
    await db.execAsync(`DROP TABLE IF EXISTS chiller_records;`);
    console.log('✅ Table dropped');
    await setupDatabase(); // Recreate table
  } catch (error) {
    console.error('❌ Error resetting database:', error);
  }
};


// Function to get database instance
export const getDBConnection = () => db;

// Ensure database setup is done when imported
setupDatabase();
