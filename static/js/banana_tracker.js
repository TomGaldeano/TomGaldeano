/* ============================================================
 *  banana_tracker.js
 *  ─────────────────
 *  UI layer for the Banana Tracker page.
 *  • The Overpass API caller (getNearbyStores) is left UNTOUCHED
 *    at the top of this file.
 *  • Below it you'll find two reusable modules:
 *      1. StorageManager  – generic localStorage CRUD
 *      2. ListRenderer    – generic "render a list of cards" helper
 *  Both are designed to be copy-pasted into other pages that
 *  need the same pattern (fetch data → render list → persist).
 * ============================================================ */

// ─── API CALLER (DO NOT TOUCH) ──────────────────────────────
async function getNearbyStores(lat, lon, radiusMeters = 1000) {
  const allowedTypes = ["supermarket", "grocery", "greengrocer"];
  const typeFilter = allowedTypes.join("|"); // no quotes around each type
  const query = `
    [out:json][timeout:25];
    (
      node["shop"~"^(${typeFilter})$"](around:${radiusMeters},${lat},${lon});
      way["shop"~"^(${typeFilter})$"](around:${radiusMeters},${lat},${lon});
    );
    out center tags;
  `;
  const url = "https://overpass-api.de/api/interpreter";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Overpass API error: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    const stores = data.elements.map((el) => ({
      id: el.id,
      type: el.type,
      lat: el.lat || el.center?.lat,
      lon: el.lon || el.center?.lon,
      name: el.tags?.name || "Unnamed store",
      shopType: el.tags?.shop,
      address: {
        street: el.tags?.["addr:street"],
        housenumber: el.tags?.["addr:housenumber"],
        city: el.tags?.["addr:city"],
        postcode: el.tags?.["addr:postcode"],
      },
      tags: el.tags,
    }));
    return stores;
  } catch (err) {
    console.error("Failed to fetch nearby stores:", err);
    return [];
  }
}


/* =============================================================
 *  REUSABLE MODULE 1 — StorageManager
 *  -----------------------------------------------------------
 *  Generic localStorage helper. Stores an array of objects
 *
 *  Usage:
 *    const mgr = new StorageManager("myItems", "id");
 *    mgr.save({ id: 42, name: "Thing" });
 *    mgr.getAll();          // → [{ id: 42, name: "Thing" }]
        const status = document.getElementById("online-link-status");
        navigator.clipboard.writeText(`Tienda: ${store.name}\nDirección: ${formatAddress(store.address)}\nGoogle Maps: ${mapsUrl || "No disponible"}`)
          .then(() => { status.textContent = `Información de ${store.name} copiada.`; })
          .catch(() => { status.textContent = "No se pudo copiar la información."; });
 *    mgr.remove(42);        // deletes it
 * ============================================================ */
class StorageManager {
  /**
        saveBtn.textContent = alreadySaved ? "✓ Guardada" : "☆ Guardar";
    this.storageKey = storageKey;
    this.idField = idField;
          btn.textContent = still ? "✓ Guardada" : "☆ Guardar";

  /** Return all saved items (parsed). */
  getAll() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey)) || [];
    } catch {
      return [];
    }
  }

  /** Persist the full array back to storage. */
  _persist(items) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  /** Save an item (no duplicates by idField). */
  save(item) {
    const items = this.getAll();
    if (!items.some((i) => i[this.idField] === item[this.idField])) {
      items.push(item);
      this._persist(items);
    }
  }

  /** Remove an item by its id value. */
  remove(idValue) {
    const items = this.getAll().filter(
      (i) => String(i[this.idField]) !== String(idValue)
    );
    this._persist(items);
  }

  /** Check whether an item is already saved. */
  has(idValue) {
    return this.getAll().some(
      (i) => String(i[this.idField]) === String(idValue)
    );
  }
}


/* =============================================================
 *  REUSABLE MODULE 2 — ListRenderer
 *  -----------------------------------------------------------
 *  Renders an array of objects into a container element using
 *  a caller-supplied "buildCard" function.
 *
 *  Usage:
 *    const renderer = new ListRenderer({
 *      container : document.getElementById("my-list"),
 *      buildCard : (item) => { ... return HTMLElement },
 *      emptyText : "Nothing to show yet.",
 *    });
 *    renderer.render(itemsArray);
 *    renderer.clear();
 *    renderer.showLoading("Searching…");
 * ============================================================ */
class ListRenderer {
  /**
   * @param {Object}   opts
   * @param {Element}  opts.container  – the DOM node to render into
   * @param {Function} opts.buildCard  – (item) => HTMLElement
   * @param {string}   [opts.emptyText]
   */
  constructor({ container, buildCard, emptyText = "No results." }) {
    this.container = container;
    this.buildCard = buildCard;
    this.emptyText = emptyText;
  }

  /** Remove all children from the container. */
  clear() {
    this.container.innerHTML = "";
  }

  /** Render a list of items. Shows empty state if array is empty. */
  render(items) {
    this.clear();
    if (!items || items.length === 0) {
      this._showEmpty();
      return;
    }
    const fragment = document.createDocumentFragment();
    items.forEach((item) => {
      const card = this.buildCard(item);
      if (card) fragment.appendChild(card);
    });
    this.container.appendChild(fragment);
  }

  /** Append a single item without clearing the list. */
  append(item) {
    // Remove empty-state placeholder if present
    const placeholder = this.container.querySelector(".list-empty-state");
    if (placeholder) placeholder.remove();
    const card = this.buildCard(item);
    if (card) this.container.appendChild(card);
  }

  /** Show a loading / status message inside the container. */
  showStatus(message) {
    this.clear();
    const el = document.createElement("li");
    el.className = "list-status-msg";
    el.setAttribute("role", "status");
    el.textContent = message;
    this.container.appendChild(el);
  }

  /** @private */
  _showEmpty() {
    const el = document.createElement("li");
    el.className = "list-empty-state";
    el.setAttribute("role", "listitem");
    el.textContent = this.emptyText;
    this.container.appendChild(el);
  }
}


/* =============================================================
 *  PAGE-SPECIFIC WIRING
 *  -----------------------------------------------------------
 *  Everything below is specific to the Banana Tracker page.
 *  It wires StorageManager + ListRenderer + getNearbyStores.
 * ============================================================ */

// ── Helpers ─────────────────────────────────────────────────
const SHOP_TYPE_META = {
  supermarket: { label: "Supermercado" },
  grocery: { label: "Tienda de comestibles" },
  greengrocer: { label: "Frutería" },
};

function getShopMeta(shopType) {
  return SHOP_TYPE_META[shopType] || { label: shopType || "Desconocido" };
}

function formatAddress(addr) {
  if (!addr) return "Dirección desconocida";
  const parts = [
    [addr.street, addr.housenumber].filter(Boolean).join(" "),
    addr.postcode,
    addr.city,
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : "Dirección desconocida";
}

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const toRadians = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function formatDistance(distanceKm) {
  if (distanceKm == null || Number.isNaN(distanceKm)) {
    return "Distancia no disponible";
  }
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

function sortStores(stores, sortBy) {
  const sortedStores = [...stores];
  if (sortBy === "distance") {
    return sortedStores.sort((a, b) =>
      (a.distanceKm ?? Number.POSITIVE_INFINITY) -
      (b.distanceKm ?? Number.POSITIVE_INFINITY)
    );
  }
  if (sortBy === "type") {
    return sortedStores.sort((a, b) =>
      getShopMeta(a.shopType).label.localeCompare(getShopMeta(b.shopType).label, "es", { sensitivity: "base" })
    );
  }
  return sortedStores.sort((a, b) =>
    (a.name || "").localeCompare(b.name || "", "es", { sensitivity: "base" })
  );
}

// ── Storage instance ────────────────────────────────────────
const savedStoresManager = new StorageManager("banana_saved_stores", "id");
let nearbyStores = [];

// ── Card builder (shared for search results & saved list) ───
function buildStoreCard(store, { isSaved = false, onSave, onUnsave } = {}) {
  const li = document.createElement("li");
  li.className = "store-card";
  li.dataset.storeId = store.id;

  const meta = getShopMeta(store.shopType);
  const mapsUrl =
    store.lat && store.lon
      ? `https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lon}`
      : null;
  const distanceText = store.distanceKm != null
    ? formatDistance(store.distanceKm)
    : "Distancia no disponible";

  const typeBadge = document.createElement("span");
  typeBadge.className = "store-type-badge";
  typeBadge.textContent = meta.label;
  const name = document.createElement("h3");
  name.className = "store-name";
  name.textContent = store.name;
  const address = document.createElement("p");
  address.className = "store-address";
  address.textContent = formatAddress(store.address);
  const distance = document.createElement("p");
  distance.className = "store-distance";
  const distanceLabel = document.createElement("strong");
  distanceLabel.textContent = "Distancia: ";
  distance.append(distanceLabel, document.createTextNode(distanceText));
  const actions = document.createElement("div");
  actions.className = "store-actions";
  li.append(typeBadge, name, address, distance, actions);

  if (mapsUrl) {
    const mapsLink = document.createElement("a");
    mapsLink.className = "btn btn-success mr-2";
    mapsLink.href = mapsUrl;
    mapsLink.target = "_blank";
    mapsLink.rel = "noopener";
    mapsLink.textContent = "Abrir mapa";
    mapsLink.setAttribute("aria-label", `Abrir ${store.name} en Google Maps (se abre en una pestaña nueva)`);
    actions.appendChild(mapsLink);
  }

  const shareButton = document.createElement("button");
  shareButton.type = "button";
  shareButton.className = "btn btn-warning mr-2 btn-share";
  shareButton.textContent = "Compartir";
  shareButton.setAttribute("aria-label", `Compartir ${store.name}`);
  shareButton.addEventListener("click", () => {
    const status = document.getElementById("online-link-status");
    navigator.clipboard.writeText(
      `Tienda: ${store.name}\nDirección: ${formatAddress(store.address)}\nGoogle Maps: ${mapsUrl || "No disponible"}`
    ).then(() => {
      status.textContent = `Información de ${store.name} copiada.`;
    }).catch(() => {
      status.textContent = "No se pudo copiar la información.";
    });
  });
  actions.appendChild(shareButton);

  if (isSaved) {
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "btn-action btn btn-danger btn-unsave";
    removeButton.textContent = "Quitar";
    removeButton.setAttribute("aria-label", `Quitar ${store.name} de favoritos`);
    removeButton.addEventListener("click", () => {
      if (onUnsave) onUnsave(store);
    });
    actions.appendChild(removeButton);
  } else {
    const alreadySaved = savedStoresManager.has(String(store.id));
    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.className = "btn-action btn btn-primary btn-save";
    saveButton.textContent = alreadySaved ? "✓ Guardada" : "☆ Guardar";
    saveButton.setAttribute("aria-label", `${alreadySaved ? "Tienda guardada" : "Guardar"}: ${store.name}`);
    saveButton.disabled = alreadySaved;
    saveButton.addEventListener("click", () => {
      if (onSave) onSave(store);
      saveButton.textContent = "✓ Guardada";
      saveButton.setAttribute("aria-label", `Tienda guardada: ${store.name}`);
      saveButton.disabled = true;
    });
    actions.appendChild(saveButton);
  }

  return li;
}


// ── Renderers ───────────────────────────────────────────────
const searchRenderer = new ListRenderer({
  container: document.getElementById("near-stores"),
  buildCard: (store) =>
    buildStoreCard(store, {
      isSaved: false,
      onSave: (s) => {
        savedStoresManager.save(s);
        refreshSavedList();
      },
    }),
  emptyText: "No se encontraron tiendas cercanas. Prueba otra ubicación o amplía el radio de búsqueda.",
});

const savedRenderer = new ListRenderer({
  container: document.getElementById("saved-stores"),
  buildCard: (store) =>
    buildStoreCard(store, {
      isSaved: true,
      onUnsave: (s) => {
        savedStoresManager.remove(s.id);
        refreshSavedList();
        // Also update the search list so the save button resets
        refreshSearchButtons();
      },
    }),
  emptyText: "Todavía no hay tiendas favoritas. Busca tiendas y guárdalas aquí.",
});

document.getElementById("nearby-sort")?.addEventListener("change", (event) => {
  searchRenderer.render(sortStores(nearbyStores, event.target.value));
});

document.getElementById("saved-sort")?.addEventListener("change", () => {
  refreshSavedList();
});


// ── Refresh helpers ─────────────────────────────────────────
function refreshSavedList() {
  const saved = savedStoresManager.getAll();
  const sortBy = document.getElementById("saved-sort")?.value || "name";
  savedRenderer.render(sortStores(saved, sortBy));
  // Show / hide the saved section heading
  const section = document.getElementById("saved-section");
  if (section) {
    section.style.display = saved.length ? "" : "";
  }
}

/** Re-enable "Save" buttons in the search list for stores that were unsaved. */
function refreshSearchButtons() {
  const list = document.getElementById("near-stores");
  if (!list) return;
  list.querySelectorAll(".store-card").forEach((card) => {
    const id = card.dataset.storeId;
    const btn = card.querySelector(".btn-save");
    if (btn) {
      const still = savedStoresManager.has(String(id));
      btn.textContent = still ? "✓ Guardada" : "☆ Guardar";
      btn.setAttribute("aria-label", `${still ? "Tienda guardada" : "Guardar"}: ${card.querySelector(".store-name")?.textContent || "tienda"}`);
      btn.disabled = still;
    }
  });
}


// ── Geolocation ─────────────────────────────────────────────
function getLocation() {
  if (navigator.geolocation) {
    document.getElementById("near-stores").setAttribute("aria-busy", "true");
    searchRenderer.showStatus("Obteniendo tu ubicación…");
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    document.getElementById("near-stores").setAttribute("aria-busy", "false");
    searchRenderer.showStatus("La geolocalización no es compatible con este navegador.");
  }
}

function success(position) {
  const { latitude, longitude } = position.coords;
  searchRenderer.showStatus("Buscando tiendas cercanas…");

  getNearbyStores(latitude, longitude, 1000).then((stores) => {
    document.getElementById("near-stores").setAttribute("aria-busy", "false");
    nearbyStores = stores.map((store) => ({
      ...store,
      distanceKm: calculateDistanceKm(latitude, longitude, store.lat, store.lon),
    }));
    console.log(`Se encontraron ${nearbyStores.length} tiendas`);
    const sortBy = document.getElementById("nearby-sort")?.value || "distance";
    searchRenderer.render(sortStores(nearbyStores, sortBy));
  });
}

function error(err) {
  document.getElementById("near-stores").setAttribute("aria-busy", "false");
  const messages = {
    1: "Permiso de ubicación denegado. Permite el acceso a la ubicación e inténtalo de nuevo.",
    2: "La información de ubicación no está disponible.",
    3: "La solicitud para obtener tu ubicación agotó el tiempo de espera.",
  };
  searchRenderer.showStatus(messages[err.code] || "Se ha producido un error desconocido.");
}


// ── Init ────────────────────────────────────────────────────
document.getElementById("search-btn").addEventListener("click", () => {
  getLocation();
});

// Load saved stores on page load
refreshSavedList();


/* =============================================================
 *  ONLINE LINKS MANAGER
 *  -----------------------------------------------------------
 *  Manages the "Where to Buy Bananas Online" section.
 *  Links are fully persisted in localStorage so users can
 *  add and remove their own sources.
 *
 *  Reuses StorageManager + ListRenderer from above.
 * ============================================================ */

// ── Storage for online links ────────────────────────────────
const onlineLinksManager = new StorageManager("banana_online_links", "id");

// ── Default links (seeded once on first visit) ──────────────
const DEFAULT_ONLINE_LINKS = [
  {
    id: "default-amazon",
    label: "Amazon",
    desc: "amazon.com — mercado global",
    url: "https://www.amazon.com",
  },
  {
    id: "default-ebay",
    label: "eBay",
    desc: "ebay.com — subastas y compra inmediata",
    url: "https://www.ebay.com",
  },
  {
    id: "default-walmart",
    label: "Walmart",
    desc: "walmart.com — alimentación y productos cotidianos",
    url: "https://www.walmart.com",
  },
  {
    id: "default-aliexpress",
    label: "AliExpress",
    desc: "aliexpress.com — ofertas y envíos internacionales",
    url: "https://www.aliexpress.com",
  },
];

// Seed defaults on first visit (if nothing stored yet)
if (onlineLinksManager.getAll().length === 0) {
  DEFAULT_ONLINE_LINKS.forEach((link) => onlineLinksManager.save(link));
}

// ── Card builder for an online link row ─────────────────────
/**
 * Builds one .online-link-row div.
 * @param {Object} link  – { id, label, desc, url, icon?, iconBg? }
 * @returns {HTMLElement}
 */
function buildOnlineLinkRow(link) {
  const row = document.createElement("div");
  row.className = "online-link-row";
  row.dataset.linkId = link.id;
  row.setAttribute("role", "listitem");

  const info = document.createElement("div");
  info.className = "link-info";
  const label = document.createElement("div");
  label.className = "link-label";
  label.textContent = link.label;
  const description = document.createElement("div");
  description.className = "link-desc";
  description.textContent = link.desc || link.url;
  info.append(label, description);

  const actions = document.createElement("div");
  actions.className = "link-actions";
  const visitLink = document.createElement("a");
  visitLink.className = "btn btn-success";
  visitLink.href = link.url;
  visitLink.target = "_blank";
  visitLink.rel = "noopener";
  visitLink.textContent = "Visitar";
  visitLink.setAttribute("aria-label", `Visitar ${link.label} (se abre en una pestaña nueva)`);
  const shareButton = document.createElement("button");
  shareButton.type = "button";
  shareButton.className = "link-btn-share btn btn-warning";
  shareButton.textContent = "Compartir";
  shareButton.setAttribute("aria-label", `Compartir ${link.label}`);
  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "link-btn-remove btn btn-danger";
  removeButton.textContent = "Quitar";
  removeButton.setAttribute("aria-label", `Quitar ${link.label}`);
  actions.append(visitLink, shareButton, removeButton);
  row.append(info, actions);

  // ── Share button ──
  shareButton.addEventListener("click", () => {
    const shareText = `${link.label}\n${link.desc}\n${link.url}`;

    // Use Web Share API if available, otherwise copy to clipboard
    if (navigator.share) {
      navigator.share({ title: link.label, text: link.desc, url: link.url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        document.getElementById("online-link-status").textContent = `Enlace de ${link.label} copiado.`;
      }).catch(() => {
        document.getElementById("online-link-status").textContent = "No se pudo copiar el enlace. Selecciónalo y cópialo manualmente.";
      });
    }
  });

  // ── Remove button ──
  removeButton.addEventListener("click", () => {
    onlineLinksManager.remove(link.id);
    refreshOnlineLinks();
    document.getElementById("online-link-status").textContent = `Se quitó ${link.label} de la lista.`;
    document.getElementById("new-label").focus();
  });

  return row;
}


// ── Renderer for online links ───────────────────────────────
const onlineLinksRenderer = new ListRenderer({
  container: document.getElementById("link-list"),
  buildCard: buildOnlineLinkRow,
  emptyText: "No hay tiendas online guardadas. Añade una a continuación.",
});

function refreshOnlineLinks() {
  const links = onlineLinksManager.getAll();
  onlineLinksRenderer.render(links);
}


// ── Add-link form handler ───────────────────────────────────
document.getElementById("online-link-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const labelInput = document.getElementById("new-label");
  const descInput = document.getElementById("new-desc");
  const urlInput = document.getElementById("new-url");
  const status = document.getElementById("online-link-status");

  const label = labelInput.value.trim();
  const desc = descInput.value.trim();
  const url = urlInput.value.trim();

  if (!label || !url) {
    status.textContent = "Completa el nombre y la URL para añadir el enlace.";
    return;
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    status.textContent = "Introduce una URL válida, por ejemplo https://ejemplo.com.";
    urlInput.focus();
    return;
  }
  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    status.textContent = "Por seguridad, la URL debe usar http:// o https://.";
    urlInput.focus();
    return;
  }
  const duplicate = onlineLinksManager.getAll().some((link) => {
    try {
      return new URL(link.url).href === parsedUrl.href;
    } catch {
      return false;
    }
  });
  if (duplicate) {
    status.textContent = "Ese enlace ya está en tu lista.";
    urlInput.focus();
    return;
  }
  const newLink = {
    id: "user-" + Date.now(),
    label,
    desc: desc || url,
    url: parsedUrl.href,
  };

  onlineLinksManager.save(newLink);
  refreshOnlineLinks();

  // Clear form
  labelInput.value = "";
  descInput.value = "";
  urlInput.value = "";
  status.textContent = "Enlace añadido correctamente.";
});


// ── Init online links on page load ──────────────────────────
refreshOnlineLinks();
searchRenderer.showStatus("Pulsa «Buscar tiendas» para encontrar tiendas cercanas.");
