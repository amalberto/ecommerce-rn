import { getDatabase } from "./database";

export const fetchCachedCategories = async () => {
  return getDatabase().getAllAsync("SELECT id, title, image FROM cached_categories ORDER BY title ASC");
};

export const fetchCachedProducts = async () => {
  const rows = await getDatabase().getAllAsync("SELECT * FROM cached_products ORDER BY title ASC");
  return rows.map((row) => ({
    id: row.id,
    categoryId: row.category_id,
    title: row.title,
    description: row.description,
    price: row.price,
    stock: row.stock,
    image: row.image,
  }));
};

export const cacheCategories = async (categories) => {
  const db = getDatabase();
  await db.withTransactionAsync(async () => {
    await db.runAsync("DELETE FROM cached_categories");
    for (const category of categories) {
      await db.runAsync(
        "INSERT OR REPLACE INTO cached_categories (id, title, image) VALUES (?, ?, ?)",
        category.id,
        category.title,
        category.image || null,
      );
    }
  });
};

export const cacheProducts = async (products) => {
  const db = getDatabase();
  await db.withTransactionAsync(async () => {
    await db.runAsync("DELETE FROM cached_products");
    for (const product of products) {
      await db.runAsync(
        `INSERT OR REPLACE INTO cached_products
        (id, category_id, title, description, price, stock, image)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        product.id,
        product.categoryId,
        product.title,
        product.description || null,
        product.price,
        product.stock ?? 0,
        product.image || null,
      );
    }
  });
};