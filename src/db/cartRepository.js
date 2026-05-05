import { getDatabase } from "./database";

const mapRowToCartItem = (row) => ({
  id: row.id,
  productId: row.product_id,
  title: row.title,
  price: row.price,
  quantity: row.quantity,
  image: row.image,
});

export const fetchCartItems = async () => {
  const rows = await getDatabase().getAllAsync("SELECT * FROM cart_items ORDER BY title ASC");
  return rows.map(mapRowToCartItem);
};

export const saveCartItem = async (item) => {
  await getDatabase().runAsync(
    `INSERT OR REPLACE INTO cart_items (id, product_id, title, price, quantity, image)
     VALUES (?, ?, ?, ?, ?, ?)`,
    item.id,
    item.productId,
    item.title,
    item.price,
    item.quantity,
    item.image || null,
  );
};

export const deleteCartItem = async (id) => {
  await getDatabase().runAsync("DELETE FROM cart_items WHERE id = ?", id);
};

export const clearCart = async () => {
  await getDatabase().runAsync("DELETE FROM cart_items");
};