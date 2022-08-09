/*
 * Create and init receipts database
 */

-- Receipts --

CREATE TABLE IF NOT EXISTS receipts (
  id INTEGER PRIMARY KEY,
  receipt TEXT DEFAULT ""
)
