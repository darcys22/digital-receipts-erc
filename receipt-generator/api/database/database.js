// Load modules
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')
const path = require('path');
const fs = require('fs');

// parse JSON config object into CONFIG
const config = JSON.parse(fs.readFileSync(process.cwd() + '/public/config/config.json', 'utf8'));

// Connect with SQLite database
const db_name = 'db.sqlite';
const db_dir = process.env.DB_DIR || path.join(__dirname, '../database');
const db_path = path.join(db_dir, db_name);
const appDatabase = (async () => {

  if (!fs.existsSync(db_dir)) {
    fs.mkdirSync(db_dir, 0744);
  }
  console.log("Database location: " + db_path);
  const appDatabase = await open({
    filename:db_path,
    //mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    driver: sqlite3.Database
  });

  await appDatabase.migrate({
    force: false,
    migrationsPath: path.join(__dirname, 'migrations')
  });

  var initialised = false;
  const result = await appDatabase.get('SELECT contract FROM metadata LIMIT 1');
  if (result && result.contract == config.CONTRACT_ADDRESS)
    initialised = true;

  if (!initialised)
    reset_database(appDatabase);

  return appDatabase;
})();

const reset_database = async (db) => {
  console.log("Resetting Database");
  var sql = `DROP TABLE IF EXISTS receipts;`;

  await db.run(sql, [], (error, row) => {
      if (error) {
        reject(error.message);
        console.log(error.message);
      }
      resolve("The receipts table was successfully dropped.");
    })

  sql = `DROP TABLE IF EXISTS metadata;`;

  await db.run(sql, [], (error, row) => {
      if (error) {
        reject(error.message);
        console.log(error.message);
      }
      resolve("The metadata table was successfully dropped.");
    })
  sql = `DROP TABLE IF EXISTS migrations;`;

  await db.run(sql, [], (error, row) => {
      if (error) {
        reject(error.message);
        console.log(error.message);
      }
      resolve("The migrations table was successfully dropped.");
    })

  await db.migrate({
    migrationsPath: path.join(__dirname, 'migrations')
  });

  const update_contract_sql = `INSERT INTO metadata (contract) VALUES ('${config.CONTRACT_ADDRESS}')`;

  await db.run(update_contract_sql, [], (error, row) => {
      if (error) {
        reject(error.message);
      }
      resolve("The current contract was successfully entered into database.");
    })
};


// Export database object
module.exports = { appDatabase }
