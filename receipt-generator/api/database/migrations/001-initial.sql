--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

-- Receipts --
CREATE TABLE IF NOT EXISTS receipts (
  id INTEGER PRIMARY KEY,
  receipt TEXT DEFAULT ""
);

-- Metadata --
CREATE TABLE IF NOT EXISTS metadata (
  contract TEXT DEFAULT ""
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE receipts;
DROP TABLE metadata;
