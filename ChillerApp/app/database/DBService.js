import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabaseAsync('chiller.db');
import { getDBConnection, setupDatabase } from './database.js';

// Function to insert a new record
export const insertChillerRecord = async (
  date,
  time,
  record_time,
  Te,
  Pe,
  Tc,
  Pcom,
  Tcon,
  Pcon,
  Tev,
  isTconCalculated,
  isTevCalculated
) => {
  const db = getDBConnection();
  try {
    await db.getAllAsync(
      `INSERT INTO chiller_records 
      (date, time, record_time, Te, Pe, Tc, Pcom, Tcon, Pcon, Tev, isTconCalculated, isTevCalculated) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        date,
        time,
        record_time,
        Te,
        Pe,
        Tc,
        Pcom,
        Tcon,
        Pcon,
        Tev,
        isTconCalculated,
        isTevCalculated,
      ]
    );
    console.log('✅ Record inserted successfully');
  } catch (error) {
    console.error('❌ Insert error:', error);
  }
};


// Function to fetch all records
export const fetchChillerRecords = async () => {
  const db = getDBConnection();
  try {
    const result = await db.getAllAsync(`SELECT * FROM chiller_records ORDER BY date DESC, time DESC;`);
    return result; // Returns an array of records
  } catch (error) {
    console.error('❌ Fetch error:', error);
    return []; // Return an empty array in case of error
  }
};

// Function to delete a record by ID
export const deleteChillerRecord = async (record_id) => {
  const db = getDBConnection();
  try {
    await db.getAllAsync(`DELETE FROM chiller_records WHERE record_id = ?;`, [record_id]);
    console.log(`✅ Record with ID ${record_id} deleted successfully`);
  } catch (error) {
    console.error('❌ Delete error:', error);
  }
};

export const insertSampleData = async () => {
  try {
    const db = getDBConnection();

    // Insert sample data
    await db.execAsync(`
      

      INSERT INTO chiller_records (date, time, record_time, Te, Pe, Tc, Pcom, Tcon, Pcon, Tev, isTconCalculated, isTevCalculated)
      VALUES 
      ('2025-03-28', '8:00 AM', '8:40 AM', 5.0, 1.2, 15.0, 2.5, 25.0, 3.8, 4.5, 0, 0),
      ('2025-03-28', '12:00 PM', '12:12 PM', 6.5, 1.4, 16.0, 2.8, 26.5, 4.0, 4.8, 0, 0),
      ('2025-03-28', '4:00 PM', '4:44 PM', 7.2, 1.6, 17.2, 3.0, 27.8, 4.3, 5.2, 0, 0);
      
    `);

    console.log("Sample data inserted successfully.");

    // Fetch the inserted data
    const results = await db.getAllAsync(`SELECT * FROM chiller_records`);

  } catch (error) {
    console.error("Error inserting sample data:", error);
  }
};

// Function to update an existing record by ID
export const updateChillerRecord = async (
  record_id,
  date,
  time,
  record_time,
  Te,
  Pe,
  Tc,
  Pcom,
  Tcon,
  Pcon,
  Tev,
  isTconCalculated,
  isTevCalculated
) => {
  const db = getDBConnection();
  try {
    await db.getAllAsync(
      `UPDATE chiller_records 
       SET 
         date = ?, 
         time = ?, 
         record_time = ?, 
         Te = ?, 
         Pe = ?, 
         Tc = ?, 
         Pcom = ?, 
         Tcon = ?, 
         Pcon = ?, 
         Tev = ?, 
         isTconCalculated = ?, 
         isTevCalculated = ?
       WHERE 
         record_id = ?;`,
      [
        date,
        time,
        record_time,
        Te,
        Pe,
        Tc,
        Pcom,
        Tcon,
        Pcon,
        Tev,
        isTconCalculated,
        isTevCalculated,
        record_id,
      ]
    );
    console.log(`✅ Record with ID ${record_id} updated successfully`);
  } catch (error) {
    console.error('❌ Update error:', error);
  }
};



