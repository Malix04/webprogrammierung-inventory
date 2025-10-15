// js/api.js
export const API_BASE = 'https://inventory-api-app.azurewebsites.net/api';

export async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return res.status === 204 ? null : res.json();
}

// Warehouses
export const getWarehouses   = () => request('/Warehouse');
export const createWarehouse = (body) => request('/Warehouse', { method:'POST', body: JSON.stringify(body) });
export const updateWarehouse = (id, body) => request(`/Warehouse/${id}`, { method:'PUT', body: JSON.stringify(body) });
export const deleteWarehouse = (id) => request(`/Warehouse/${id}`, { method:'DELETE' });

// Categories pro Warehouse
// Kategorien je Warehouse – 404 = leere Liste
export const getCategories = async (warehouseId) => {
  try {
    return await request(`/Warehouse/${warehouseId}/Category`);
  } catch (e) {
    if (String(e.message).includes('404')) return []; // neu: 404 == keine Kategorien
    throw e;
  }
};
export const createCategory = (wid, body) => request(`/Warehouse/${wid}/Category`, { method:'POST', body: JSON.stringify(body) });
export const updateCategory = (wid, id, body) => request(`/Warehouse/${wid}/Category/${id}`, { method:'PUT', body: JSON.stringify(body) });
export const deleteCategory = (wid, id) => request(`/Warehouse/${wid}/Category/${id}`, { method:'DELETE' });

// Items pro Warehouse
/* ---------- Inventory je Warehouse ---------- */

// 404 = leere Liste
export const getItems = async (warehouseId) => {
  try {
    return await request(`/Warehouse/${warehouseId}/Inventory`);
  } catch (e) {
    if (String(e.message).includes('404')) return [];
    throw e;
  }
};

export const createItem = (warehouseId, body) =>
  request(`/Warehouse/${warehouseId}/Inventory`, {
    method: 'POST',
    body: JSON.stringify(body)
  });

export const updateItem = (warehouseId, id, body) =>
  request(`/Warehouse/${warehouseId}/Inventory/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body)
  });

export const deleteItem = (warehouseId, id) =>
  request(`/Warehouse/${warehouseId}/Inventory/${id}`, {
    method: 'DELETE'
  });
