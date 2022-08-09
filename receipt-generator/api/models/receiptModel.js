// Load modules
const database = require('../database/database');

// Get all receipts from database
const getReceipts = (callback) => {
  const sql = `SELECT * from receipts`;
  database.appDatabase.all(sql, [], (error, rows) => {
    if (error) {
      throw(error.message)
    }
    callback(rows);
  });
};

// Add a receipt to the database
const createReceipt = (id, receipt, callback) => {
  const sql = `INSERT INTO receipts (id, receipt) VALUES ('${id}', '${receipt}')`;
  database.appDatabase.run(sql, [], (error, row) => {
    if (error) {
      throw(error.message)
    }
    const successMessage = "The receipt was entered successfully.";
    callback(successMessage);
  });
};

// Get a single receipt from database
const getReceipt = (id, callback) => {
  const sql = `SELECT * from receipts WHERE id = ${id}`;
  database.appDatabase.get(sql, [], (error, row) => {
    if (error) {
      throw(error.message)
    }
    callback(row);
  });
};

// Delete a receipt from the database
const deleteReceipt = (id, callback) => {
  const sql = `DELETE FROM receipts WHERE id = ${id}`;
  database.appDatabase.run(sql, [], (error, row) => {
    if (error) {
      callback(error.message);
    }
    const successMessage = "The receipt was successfully deleted.";
    callback(successMessage);
  });
};

// Update a receipt in the database
const updateReceipt = (id, receipt, callback) => {

  let sql = `UPDATE receipts SET receipt = '${receipt}' WHERE (id = ${id})`;
  database.appDatabase.run(sql, [], (error, row) => {
    if (error) {
      throw(error.message)
    }
    const successMessage = "The receipt was successfully updated.";
    callback(successMessage);
  });
};

// Export models
module.exports = {
  getReceipts,
  createReceipt,
  getReceipt,
  deleteReceipt,
  updateReceipt
};
