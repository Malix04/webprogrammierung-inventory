// js/inventory.js
import {
  getCategories, getItems,
  createCategory, createItem,
  deleteCategory, deleteItem
} from './api.js';

const wid = new URLSearchParams(location.search).get('warehouseId');
if (!wid) { alert('Kein Warehouse gewählt'); location.href = 'warehouses.html'; }

const catList  = document.querySelector('[data-category-list]');
const itemList = document.querySelector('[data-item-list]');
const catForm  = document.querySelector('[data-category-form]');
const itemForm = document.querySelector('[data-item-form]');
const catSelect = itemForm.querySelector('select[name="categoryId"]');

async function loadAll() {
  catList.innerHTML = '<li>Wird geladen…</li>';
  itemList.innerHTML = '<li>Wird geladen…</li>';
  try {
    const [cats, items] = await Promise.all([getCategories(wid), getItems(wid)]);

    catList.innerHTML = (cats || []).length
  ? cats.map(c => `<li>${c.name} <button data-del-cat="${c.id}">Löschen</button></li>`).join('')
  : '<li>Noch keine Kategorien.</li>';

catSelect.innerHTML = (cats || []).map(c => `<option value="${c.id}">${c.name}</option>`).join('');

itemList.innerHTML = (items || []).length
  ? items.map(i => `<li>${i.name} (x${i.quantity}) <button data-del-item="${i.id}">Löschen</button></li>`).join('')
  : '<li>Noch keine Items.</li>';

  } catch (e) {
    catList.innerHTML = itemList.innerHTML = `<li style="color:#b00;">Fehler: ${e.message}</li>`;
  }
}

catForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = catForm.name.value.trim();
  if (!name) return alert('Kategoriename erforderlich');
  await createCategory(wid, { name });
  catForm.reset();
  loadAll();
});

itemForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name        = itemForm.name.value.trim();
  const description = itemForm.description.value.trim();     // NEU
  const quantity    = Number(itemForm.quantity.value);
  const categoryId  = Number(itemForm.categoryId.value);

  if (!name || !description || Number.isNaN(quantity) || quantity < 0 || Number.isNaN(categoryId)) {
    alert('Bitte Name, Beschreibung, Menge (>=0) und Kategorie angeben.');
    return;
  }

  try {
    // Die meisten .NET-Backends sind bei JSON keys case-insensitive.
    // Falls es trotzdem meckert, unten "description" testweise in "Description" ändern.
    await createItem(wid, { name, description, quantity, categoryId });
    itemForm.reset();
    await loadAll();
  } catch (err) {
    console.error('Create Item failed:', err);
    alert('Item konnte nicht angelegt werden: ' + err.message);
  }
});



document.addEventListener('click', async (e) => {
  const delItemId = e.target?.dataset?.delItem;
  const delCatId  = e.target?.dataset?.delCat;
  if (delItemId) { await deleteItem(wid, delItemId); loadAll(); }
  if (delCatId)  { await deleteCategory(wid, delCatId); loadAll(); }
});

loadAll();
