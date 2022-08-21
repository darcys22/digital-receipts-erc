// Load modules
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')
const path = require('path');
const fs = require('fs');

// Connect with SQLite database
const db_name = 'db.sqlite';
const db_dir = process.env.DB_DIR || path.join(__dirname, '../database');
const db_path = path.join(db_dir, db_name);
const appDatabase = initializeDatabase();

async function initializeDatabase() {
  if (!fs.existsSync(db_path)) {
    fs.mkdirSync(db_path, 0744);
  }
  const appDatabase = await open({
    filename:db_path,
    driver: sqlite3.Database
  });
  await appDatabase.migrate({
    force: 'last',
    migrationsPath: path.join(__dirname, 'migrations')
  });
  // TODO sean Make sure the metadata reflects our current state
  //if (dbExists) {
    //const sql = `SELECT contract FROM metadata`;
    //database.appDatabase.get(sql, [], (error, row) => {
      //if (!error && row == config.CONTRACT) {
        //dbInitialised = true;
      //}
    //});
  //}
  //if (!dbExists || !dbInitialised)
  //{
    //reset_database(database)
  //}

  return appDatabase;
}

// Export database object
module.exports = { appDatabase }
