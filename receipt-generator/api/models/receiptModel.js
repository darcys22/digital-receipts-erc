// Load modules
const database = require('../database/database');

// Get all receipts from database
const getReceipts = () => new Promise((resolve, reject) => {
  const sql = `SELECT * from receipts`;
  database.appDatabase.all(sql, [], (error, rows) => {
    if (error) {
      reject(error.message);
    }
    resolve(rows);
  });
});

// Add a receipt to the database
const createReceipt = async (id, receipt) => new Promise((resolve, reject) => {
  const sql = "INSERT INTO receipts (id, receipt) VALUES (?, ?)";
  database.appDatabase.then(async (db) => {
    const result = await db.run(sql, id, receipt);
    if (result.changes > 0)
      resolve("Receipt added to database, ID: " + result.lastID);
    reject("Could not add to database")
  });
});

// Get a single receipt from database
const getReceipt = async (id) => new Promise((resolve, reject) => {
  database.appDatabase.then(async (db) => {
    const result = await db.get('SELECT * from receipts WHERE id = ?', id);
    if (!result)
      reject("Could not find receipt in database");
    resolve(result.receipt);
  });
});

// Delete a receipt from the database
const deleteReceipt = (id) => new Promise((resolve, reject) => {
  const sql = `DELETE FROM receipts WHERE id = ${id}`;
  database.appDatabase.then((db) => {
    db.run(sql, [], (error, row) => {
      if (error) {
        reject(error.message);
      }
      resolve("The receipt was successfully deleted.");
    });
  });
});

// Update a receipt in the database
const updateReceipt = (id, receipt) => new Promise((resolve, reject) => {
  let sql = `UPDATE receipts SET receipt = '${receipt}' WHERE (id = ${id})`;
  database.appDatabase.then((db) => {
    db.run(sql, [], (error, row) => {
      if (error) {
        reject(error.message);
      }
      resolve("The receipt was successfully updated.");
    });
  });
});

// Export models
module.exports = {
  getReceipts,
  createReceipt,
  getReceipt,
  deleteReceipt,
  updateReceipt
};
