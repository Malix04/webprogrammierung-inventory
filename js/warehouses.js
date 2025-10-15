// js/warehouses.js
import { getWarehouses, createWarehouse } from './api.js';

const listEl = document.querySelector('[data-warehouse-list]');
const formEl = document.querySelector('[data-warehouse-form]');
const nameInput = formEl?.querySelector('input[name="name"]');

async function loadWarehouses() {
  listEl.innerHTML = '<li>Wird geladen…</li>';
  try {
    const data = await getWarehouses();
    listEl.innerHTML = (!Array.isArray(data) || data.length === 0)
      ? '<li>Noch keine Warehouses vorhanden.</li>'
      : data.map(w => `
          <li>
            <strong>${w.name}</strong>
            <button data-open="${w.id}">Öffnen</button>
          </li>
        `).join('');
  } catch (e) {
    listEl.innerHTML = `<li style="color:#b00;">Fehler: ${e.message}</li>`;
  }
}

formEl?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  if (!name) return alert('Name erforderlich');
  try {
    await createWarehouse({ name });
    formEl.reset();
    await loadWarehouses();
  } catch (e) {
    alert('Anlegen fehlgeschlagen: ' + e.message);
  }
});

document.addEventListener('click', (e) => {
  const id = e.target?.dataset?.open;
  if (id) location.href = `inventory.html?warehouseId=${encodeURIComponent(id)}`;
});

loadWarehouses();
