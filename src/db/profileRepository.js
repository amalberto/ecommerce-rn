import { getDatabase } from "./database";

const mapRowToProfile = (row) => {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    avatarUri: row.avatar_uri,
    updatedAt: row.updated_at,
  };
};

export const fetchLocalProfile = async (id) => {
  const row = await getDatabase().getFirstAsync("SELECT * FROM profile WHERE id = ?", id);
  return mapRowToProfile(row);
};

export const saveLocalProfile = async (profile) => {
  await getDatabase().runAsync(
    `INSERT OR REPLACE INTO profile (id, email, display_name, avatar_uri, updated_at)
     VALUES (?, ?, ?, ?, ?)`,
    profile.id,
    profile.email || null,
    profile.displayName || null,
    profile.avatarUri || null,
    profile.updatedAt || new Date().toISOString(),
  );
};