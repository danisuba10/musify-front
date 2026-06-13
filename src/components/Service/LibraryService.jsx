import { apiURL } from "../../assets/Constants";

const BASE = `${apiURL}/library`;

export async function fetchLibraryPage({ userToken, pageSize = 25, lastSavedAt = null, lastItemId = null }) {
  const params = new URLSearchParams({ pageSize });
  if (lastSavedAt) params.set("lastSavedAt", lastSavedAt);
  if (lastItemId) params.set("lastItemId", lastItemId);

  const response = await fetch(`${BASE}?${params.toString()}`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });

  if (!response.ok) {
    throw new Error(`Library fetch failed: ${response.status}`);
  }

  const data = await response.json();
  return {
    items: data.items?.$values ?? data.items ?? [],
    lastSavedAt: data.lastSavedAt ?? null,
    lastItemId: data.lastItemId ?? null,
  };
}

export async function toggleLibraryItem({ userToken, itemId, itemType }) {
  const formData = new FormData();
  formData.append("itemId", itemId);
  formData.append("itemType", itemType);

  const response = await fetch(`${BASE}/toggle`, {
    method: "POST",
    headers: { Authorization: `Bearer ${userToken}` },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Toggle failed: ${response.status}`);
  }

  const data = await response.json();
  return data; // { added: boolean, itemId, itemType }
}
