import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("ecommerce.db");

export const initDatabase = async () => {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS cart_items (
      id TEXT PRIMARY KEY NOT NULL,
      product_id TEXT NOT NULL,
      title TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      stock INTEGER,
      image TEXT
    );

    CREATE TABLE IF NOT EXISTS profile (
      id TEXT PRIMARY KEY NOT NULL,
      email TEXT,
      display_name TEXT,
      avatar_uri TEXT,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS cached_categories (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      image TEXT
    );

    CREATE TABLE IF NOT EXISTS cached_products (
      id TEXT PRIMARY KEY NOT NULL,
      category_id TEXT,
      title TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      stock INTEGER,
      image TEXT
    );
  `);

  const cartColumns = await db.getAllAsync("PRAGMA table_info(cart_items)");
  const hasStockColumn = cartColumns.some((column) => column.name === "stock");

  if (!hasStockColumn) {
    await db.execAsync("ALTER TABLE cart_items ADD COLUMN stock INTEGER;");
  }
};

export const getDatabase = () => db;