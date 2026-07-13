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
      body: query,
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
 *  identified by a unique key (default: "id").
 *
 *  Usage:
 *    const mgr = new StorageManager("myItems", "id");
 *    mgr.save({ id: 42, name: "Thing" });
 *    mgr.getAll();          // → [{ id: 42, name: "Thing" }]
 *    mgr.has(42);           // → true
 *    mgr.remove(42);        // deletes it
 * ============================================================ */
class StorageManager {
  /**
   * @param {string} storageKey  – the localStorage key name
   * @param {string} idField     – property used as unique identifier
   */
  constructor(storageKey, idField = "id") {
    this.storageKey = storageKey;
    this.idField = idField;
  }

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
    el.textContent = message;
    this.container.appendChild(el);
  }

  /** @private */
  _showEmpty() {
    const el = document.createElement("li");
    el.className = "list-empty-state";
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
  supermarket: { label: "Supermarket"},
  grocery:     { label: "Grocery"},
  greengrocer: { label: "Greengrocer"},
};

function getShopMeta(shopType) {
  return SHOP_TYPE_META[shopType] || { label: shopType || "Unknown" };
}

function formatAddress(addr) {
  if (!addr) return "Address unknown";
  const parts = [
    [addr.street, addr.housenumber].filter(Boolean).join(" "),
    addr.postcode,
    addr.city,
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : "Address unknown";
}


// ── Storage instance ────────────────────────────────────────
const savedStoresManager = new StorageManager("banana_saved_stores", "id");


// ── Card builder (shared for search results & saved list) ───
/**
 * Builds a store card <li> element.
 * @param {Object}  store           – store data object
 * @param {Object}  opts
 * @param {boolean} opts.isSaved    – render "Unsave" vs "Save" button
 * @param {Function} opts.onSave    – callback(store)
 * @param {Function} opts.onUnsave  – callback(store)
 */
function buildStoreCard(store, { isSaved = false, onSave, onUnsave } = {}) {
  const li = document.createElement("li");
  li.className = "store-card";
  li.dataset.storeId = store.id;

  const meta = getShopMeta(store.shopType);

  // Google Maps link
  const mapsUrl =
    store.lat && store.lon
      ? `https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lon}`
      : null;

  li.innerHTML = `
    <span class="store-type-badge">
    ${meta.label}
    </span>
    <h3 class="store-name">${store.name}</h3>
    <p class="store-address">${formatAddress(store.address)}</p>
    <div class="store-actions">
    ${mapsUrl ? `<a class="btn btn-success mr-2" href="${mapsUrl}" target="_blank" rel="noopener">Open in Maps</a>` : ""}
    </div>
  `;

  const actionsDiv = li.querySelector(".store-actions");

  const shareBtn = document.createElement("button");
  shareBtn.className = "btn btn-warning mr-2 btn-share";
  shareBtn.textContent = "Share";
  shareBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(`Store: ${store.name}\nAddress: ${formatAddress(store.address)}\nGoogle Maps: ${mapsUrl || "N/A"}`);
  });
  actionsDiv.appendChild(shareBtn);

  if (isSaved) {
    // Unsave button
    const unsaveBtn = document.createElement("button");
    unsaveBtn.className = "btn-action btn btn-danger btn-unsave";
    unsaveBtn.textContent = "Remove";
    unsaveBtn.addEventListener("click", () => {
      if (onUnsave) onUnsave(store);
    });
    actionsDiv.appendChild(unsaveBtn);
  } else {
    // Save button (check if already saved)
    const alreadySaved = savedStoresManager.has(String(store.id));
    const saveBtn = document.createElement("button");
    saveBtn.className = "btn-action btn btn-primary btn-save";
    saveBtn.textContent = alreadySaved ? "✓ Saved" : "☆ Save";
    saveBtn.disabled = alreadySaved;
    saveBtn.addEventListener("click", () => {
      if (onSave) onSave(store);
      saveBtn.textContent = "✓ Saved";
      saveBtn.disabled = true;
    });
    actionsDiv.appendChild(saveBtn);
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
  emptyText: "No stores found nearby. Try moving to a different location or expanding the search radius.",
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
  emptyText: "No saved stores yet. Search and save your favourites!",
});


// ── Refresh helpers ─────────────────────────────────────────
function refreshSavedList() {
  const saved = savedStoresManager.getAll();
  savedRenderer.render(saved);
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
      btn.textContent = still ? "✓ Saved" : "☆ Save";
      btn.disabled = still;
    }
  });
}


// ── Geolocation ─────────────────────────────────────────────
function getLocation() {
  if (navigator.geolocation) {
    searchRenderer.showStatus("Getting your location…");
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    searchRenderer.showStatus("Geolocation is not supported by this browser.");
  }
}

function success(position) {
  const { latitude, longitude } = position.coords;
  searchRenderer.showStatus("Searching for nearby stores…");

  getNearbyStores(latitude, longitude, 1000).then((stores) => {
    console.log(`Found ${stores.length} stores`);
    searchRenderer.render(stores);
  });
}

function error(err) {
  const messages = {
    1: "Location permission denied. Please allow location access and try again.",
    2: "Location information is unavailable.",
    3: "The request to get your location timed out.",
  };
  searchRenderer.showStatus(messages[err.code] || "An unknown error occurred.");
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
    desc: "amazon.com — global marketplace",
    url: "https://www.amazon.com",
  },
  {
    id: "default-ebay",
    label: "eBay",
    desc: "ebay.com — auctions & buy-it-now",
    url: "https://www.ebay.com",
  },
  {
    id: "default-walmart",
    label: "Walmart",
    desc: "walmart.com — groceries & everyday essentials",
    url: "https://www.walmart.com",
  },
  {
    id: "default-aliexpress",
    label: "AliExpress",
    desc: "aliexpress.com — international deals & shipping",
    url: "https://www.aliexpress.com",
  },
];

// Seed defaults on first visit (if nothing stored yet)
if (onlineLinksManager.getAll().length === 0) {
  DEFAULT_ONLINE_LINKS.forEach((link) => onlineLinksManager.save(link));
}

// ── Random icon/color for user-added links ──────────────────

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
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

  row.innerHTML = `
    <div class="link-info">
      <div class="link-label">${link.label}</div>
      <div class="link-desc">${link.desc}</div>
    </div>
    <div class="link-actions">
      <a class="btn btn-success" href="${link.url}" target="_blank" rel="noopener">Visit</a>
      <button class="link-btn-share btn btn-warning" title="Share this link">Share</button>
      <button class="link-btn-remove btn btn-danger" title="Remove this link">Remove</button>
    </div>
  `;

  // ── Share button ──
  row.querySelector(".link-btn-share").addEventListener("click", () => {
    const shareText = `${link.label}\n${link.desc}\n${link.url}`;

    // Use Web Share API if available, otherwise copy to clipboard
    if (navigator.share) {
      navigator.share({ title: link.label, text: link.desc, url: link.url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        const btn = row.querySelector(".link-btn-share");
        const original = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = original), 1500);
      });
    }
  });

  // ── Remove button ──
  row.querySelector(".link-btn-remove").addEventListener("click", () => {
    onlineLinksManager.remove(link.id);
    refreshOnlineLinks();
  });

  return row;
}


// ── Renderer for online links ───────────────────────────────
const onlineLinksRenderer = new ListRenderer({
  container: document.getElementById("link-list"),
  buildCard: buildOnlineLinkRow,
  emptyText: "No online stores saved. Add one below!",
});

function refreshOnlineLinks() {
  const links = onlineLinksManager.getAll();
  onlineLinksRenderer.render(links);
}


// ── Add-link form handler ───────────────────────────────────
document.getElementById("add-link-btn").addEventListener("click", () => {
  const labelInput = document.getElementById("new-label");
  const descInput = document.getElementById("new-desc");
  const urlInput = document.getElementById("new-url");

  const label = labelInput.value.trim();
  const desc = descInput.value.trim();
  const url = urlInput.value.trim();

  if (!label || !url) {
    // Briefly highlight empty required fields
    if (!label) labelInput.style.borderColor = "#e74c3c";
    if (!url) urlInput.style.borderColor = "#e74c3c";
    setTimeout(() => {
      labelInput.style.borderColor = "";
      urlInput.style.borderColor = "";
    }, 1500);
    return;
  }

  const newLink = {
    id: "user-" + Date.now(),
    label,
    desc: desc || url,
    url,
    icon: randomFrom(USER_LINK_ICONS),
    iconBg: randomFrom(USER_LINK_COLORS),
  };

  onlineLinksManager.save(newLink);
  refreshOnlineLinks();

  // Clear form
  labelInput.value = "";
  descInput.value = "";
  urlInput.value = "";
});


// ── Init online links on page load ──────────────────────────
refreshOnlineLinks();
searchRenderer.showStatus("Click 'Find Nearby Stores' to search for banana sellers near you!");
