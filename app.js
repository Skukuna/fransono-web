let DATA = null;

const state = {
  section: "men",
  query: "",
  category: "all",
  sort: "popular",
  filters: {},
  wishlist: new Set(),
  cart: []
};

const nodes = {
  mainNav: document.querySelector("#mainNav"),
  search: document.querySelector("#searchInput"),
  filterGroups: document.querySelector("#filterGroups"),
  chips: document.querySelector("#categoryChips"),
  grid: document.querySelector("#productGrid"),
  title: document.querySelector("#collectionTitle"),
  count: document.querySelector("#productCount"),
  crumb: document.querySelector("#crumbLabel"),
  sort: document.querySelector("#sortSelect"),
  cartCount: document.querySelector("#cartCount"),
  cartItems: document.querySelector("#cartItems"),
  cartTotal: document.querySelector("#cartTotal"),
  checkoutForm: document.querySelector("#checkoutForm")
};

function collectionData(section = state.section) {
  return DATA.collections[section];
}

function allProducts() {
  return Object.values(DATA.collections).flatMap((collection) => collection.products);
}

function rupees(value) {
  return `\u20B9${value.toLocaleString("en-IN")}`;
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function valuesMatch(productValues, selectedValue) {
  const selected = normalize(selectedValue);
  return productValues.map(normalize).some((value) => value === selected || value.includes(selected) || selected.includes(value));
}

function ratingThreshold(value) {
  const match = String(value).match(/[\d.]+/);
  return match ? Number(match[0]) : 0;
}

function productMatchesFilter(product, group, selectedValue) {
  const key = normalize(group);
  const tags = product.tags || [];

  if (key === "category") return valuesMatch([product.category, product.type, ...tags], selectedValue);
  if (key === "brand") return valuesMatch([product.brand], selectedValue);
  if (key === "fit") return valuesMatch([product.fit, ...tags], selectedValue);
  if (key === "type") return valuesMatch([product.type, product.category, ...tags], selectedValue);
  if (key === "offers") return valuesMatch([product.offer, ...tags], selectedValue);
  if (key === "ratings") return Number(product.rating || 0) >= ratingThreshold(selectedValue);
  if (key === "sizes") return valuesMatch([...(product.sizes || []), ...tags], selectedValue);
  if (key === "tags") return valuesMatch(tags, selectedValue);

  return valuesMatch([product[key], ...tags], selectedValue);
}

function renderSiteSettings() {
  const site = DATA.site;
  document.title = `${site.brandName} Storefront`;
  document.querySelector(".brand span").textContent = site.brandName;
  document.querySelector(".hero-brand").textContent = site.brandName;
  document.querySelector(".shipping-band span").textContent = site.freeShippingText;

  document.querySelector("#trustTicker").innerHTML = site.stats.map((stat) => `
    <span><img src="${stat.icon}" alt="" /> <b>${stat.value}</b> ${stat.label}</span>
  `).join("");

  document.querySelector(".hero-cards").innerHTML = site.homeCards.map((card) => `
    <button class="shop-card" data-section="${card.section}">
      <img src="${card.image}" alt="${card.label} fashion" />
      <span>${card.label}</span>
    </button>
  `).join("");

  document.querySelector(".category-band").innerHTML = site.featureCards.map((card) => `
    <article>
      <strong>${card.title}</strong>
      <span>${card.text}</span>
    </article>
  `).join("");
}

function productsForView() {
  let items = [...collectionData().products].filter((item) => item.active !== false);
  if (state.category !== "all") {
    items = items.filter((item) => item.category === state.category);
  }
  Object.entries(state.filters).forEach(([group, values]) => {
    if (!values.length) return;
    items = items.filter((item) => values.some((value) => productMatchesFilter(item, group, value)));
  });
  if (state.query) {
    const query = state.query.toLowerCase();
    items = items.filter((item) => `${item.brand} ${item.name} ${(item.tags || []).join(" ")}`.toLowerCase().includes(query));
  }
  if (state.sort === "high") items.sort((a, b) => b.price - a.price);
  if (state.sort === "low") items.sort((a, b) => a.price - b.price);
  if (state.sort === "new") items.sort((a, b) => Number(b.isNew) - Number(a.isNew));
  return items;
}

function renderFilters() {
  const groups = collectionData().filters;
  nodes.filterGroups.innerHTML = Object.entries(groups)
    .map(([group, values]) => `
      <section class="filter-group">
        <button class="filter-title" type="button">${group}<span>&#8963;</span></button>
        <div class="filter-options">
          ${values.map((value) => `
            <label>
              <input type="checkbox" data-filter-group="${group}" data-filter-value="${value}" ${(state.filters[group] || []).includes(value) ? "checked" : ""} />
              <span>${value}</span>
            </label>
          `).join("")}
        </div>
      </section>
    `)
    .join("");
}

function renderChips() {
  const categories = ["all", ...collectionData().categories];
  nodes.chips.innerHTML = categories
    .map((category) => `
      <button class="${state.category === category ? "is-active" : ""}" data-category="${category}">
        ${category === "all" ? "All" : category}
      </button>
    `)
    .join("");
}

function renderProducts() {
  const items = productsForView();
  nodes.count.textContent = `${items.length} Products`;
  nodes.grid.innerHTML = items.map((item) => `
    <article class="product-card">
      <div class="product-media">
        <img src="${item.image}" alt="${item.name}" loading="lazy" />
        <span class="fit-badge">${item.fit}</span>
        <span class="rating"><span>&#9733;</span>${item.rating}</span>
        <button class="wishlist ${state.wishlist.has(item.id) ? "is-active" : ""}" data-wishlist="${item.id}" aria-label="Add ${item.name} to wishlist">&#9825;</button>
      </div>
      <div class="product-info">
        <h3>${item.brand}</h3>
        <p>${item.name}</p>
        <div class="price">
          <strong>${rupees(item.price)}</strong>
          <del>${rupees(item.mrp)}</del>
          <span>${item.discount}</span>
        </div>
        <span class="offer">${item.offer}</span>
        <button class="add-btn" data-cart="${item.id}">ADD TO BAG</button>
      </div>
    </article>
  `).join("") || `<p class="empty">No products matched your search.</p>`;
  updateWishlistButtonState();
}

function renderCollection() {
  const collection = collectionData();
  nodes.title.textContent = collection.title;
  nodes.crumb.textContent = collection.crumb;
  document.querySelectorAll(".main-nav a").forEach((link) => {
    link.classList.toggle("is-active", link.hash === `#${state.section}`);
  });
  renderFilters();
  renderChips();
  renderProducts();
}

function renderCart() {
  nodes.cartCount.textContent = state.cart.length;
  const total = state.cart.reduce((sum, item) => sum + item.price, 0);
  nodes.cartTotal.textContent = rupees(total);
  nodes.cartItems.innerHTML = state.cart.length
    ? state.cart.map((item, index) => `
      <div class="cart-line">
        <img src="${item.image}" alt="${item.name}" />
        <div>
          <h3>${item.brand}</h3>
          <p>${item.name}</p>
          <strong>${rupees(item.price)}</strong>
        </div>
        <button data-remove="${index}" aria-label="Remove ${item.name}">&times;</button>
      </div>
    `).join("")
    : `<p class="empty">Your bag is empty. Add a few favorites from the grid.</p>`;
}

function updateWishlistButtonState() {
  const button = document.querySelector('#wishlistButton');
  if (!button) return;
  button.classList.toggle('is-active', state.wishlist.size > 0);
}

function saveWishlist() {
  try {
    localStorage.setItem('fransonoWishlist', JSON.stringify([...state.wishlist]));
  } catch (error) {
    console.warn('Could not save wishlist', error);
  }
}

function loadWishlist() {
  try {
    const stored = localStorage.getItem('fransonoWishlist');
    if (stored) {
      state.wishlist = new Set(JSON.parse(stored));
    }
  } catch (error) {
    console.warn('Could not load wishlist', error);
  }
}

function renderWishlist() {
  const items = allProducts().filter((item) => state.wishlist.has(item.id));
  const container = document.querySelector('#wishlistItems');
  updateWishlistButtonState();
  container.innerHTML = items.length
    ? items.map((item) => `
      <div class="cart-line">
        <img src="${item.image}" alt="${item.name}" />
        <div>
          <h3>${item.brand}</h3>
          <p>${item.name}</p>
          <strong>${rupees(item.price)}</strong>
        </div>
        <button data-wishlist-remove="${item.id}" aria-label="Remove ${item.name} from wishlist">&times;</button>
      </div>
    `).join('')
    : `<p class="empty">No liked items yet. Tap the heart icon on a product to add it.</p>`;
}

function openWishlistDrawer() {
  renderWishlist();
  document.body.classList.remove('drawer-open', 'checkout-open');
  document.body.classList.add('wishlist-open');
}

function closeWishlistDrawer() {
  document.body.classList.remove('wishlist-open');
}

function buildWhatsAppOrderMessage(customer = {}) {
  const total = state.cart.reduce((sum, item) => sum + item.price, 0);
  const lines = [
    "Hello FRANSONO, I want to place this order:",
    ""
  ];

  if (customer.name) {
    lines.push("Customer Details:");
    lines.push(`Name: ${customer.name}`);
    lines.push(`Mobile: ${customer.phone}`);
    lines.push(`Address: ${customer.address}`);
    lines.push(`City: ${customer.city}`);
    lines.push(`Pincode: ${customer.pincode}`);
    if (customer.note) lines.push(`Note: ${customer.note}`);
    lines.push("");
  }

  lines.push("Order Details:");

  state.cart.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.brand}`);
    lines.push(item.name);
    lines.push(`Price: ${rupees(item.price)}`);
    lines.push("");
  });

  lines.push(`Total: ${rupees(total)}`);
  lines.push("");
  lines.push("Please confirm availability and delivery details.");
  return lines.join("\n");
}

function openCheckoutDetails() {
  if (!state.cart.length) {
    alert("Your bag is empty. Add products before placing an order.");
    return;
  }

  document.body.classList.remove("drawer-open");
  document.body.classList.add("checkout-open");
  document.querySelector("#checkoutModal").setAttribute("aria-hidden", "false");
}

function closeCheckoutDetails() {
  document.body.classList.remove("checkout-open");
  document.querySelector("#checkoutModal").setAttribute("aria-hidden", "true");
}

function redirectToWhatsAppOrder(customer) {
  if (!state.cart.length) {
    alert("Your bag is empty. Add products before placing an order.");
    return;
  }

  const phoneNumber = DATA.site.whatsappNumber;
  const message = encodeURIComponent(buildWhatsAppOrderMessage(customer));
  window.location.href = `https://wa.me/${phoneNumber}?text=${message}`;
}

function setSection(section) {
  if (!DATA.collections[section]) return;
  state.section = section;
  state.category = "all";
  state.filters = {};
  state.query = "";
  nodes.search.value = "";
  renderCollection();
  document.querySelector("#collection").scrollIntoView({ behavior: "smooth", block: "start" });
}

document.addEventListener("click", (event) => {
  const sectionButton = event.target.closest("[data-section]");
  if (sectionButton) setSection(sectionButton.dataset.section);

  const categoryButton = event.target.closest("[data-category]");
  if (categoryButton) {
    state.category = categoryButton.dataset.category;
    renderChips();
    renderProducts();
  }

  const filterInput = event.target.closest("[data-filter-group]");
  if (filterInput) {
    const group = filterInput.dataset.filterGroup;
    const value = filterInput.dataset.filterValue;
    const selected = new Set(state.filters[group] || []);
    filterInput.checked ? selected.add(value) : selected.delete(value);
    state.filters[group] = [...selected];
    renderProducts();
  }

  const wishlistButton = event.target.closest("[data-wishlist]");
  if (wishlistButton) {
    const id = wishlistButton.dataset.wishlist;
    state.wishlist.has(id) ? state.wishlist.delete(id) : state.wishlist.add(id);
    saveWishlist();
    renderProducts();
    if (document.body.classList.contains('wishlist-open')) {
      renderWishlist();
    }
    return;
  }

  const topWishlistButton = event.target.closest("#wishlistButton");
  if (topWishlistButton) {
    openWishlistDrawer();
    return;
  }

  const wishlistRemoveButton = event.target.closest("[data-wishlist-remove]");
  if (wishlistRemoveButton) {
    state.wishlist.delete(wishlistRemoveButton.dataset.wishlistRemove);
    saveWishlist();
    renderWishlist();
    renderProducts();
    return;
  }

  const cartButton = event.target.closest("[data-cart]");
  if (cartButton) {
    const product = allProducts().find((item) => item.id === cartButton.dataset.cart);
    if (product) state.cart.push(product);
    renderCart();
    document.body.classList.add("drawer-open");
  }

  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) {
    state.cart.splice(Number(removeButton.dataset.remove), 1);
    renderCart();
  }
});

document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", (event) => {
    const section = link.hash.replace("#", "");
    if (DATA.collections[section]) {
      event.preventDefault();
      setSection(section);
    }
  });
});

nodes.search.addEventListener("input", (event) => {
  state.query = event.target.value.trim();
  renderProducts();
});

nodes.sort.addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderProducts();
});

document.querySelector("#filterToggle").addEventListener("click", () => document.body.classList.add("filters-open"));
document.querySelector("#closeFilters").addEventListener("click", () => document.body.classList.remove("filters-open"));
document.querySelector("#menuToggle").addEventListener("click", () => document.body.classList.toggle("filters-open"));
document.querySelector("#cartButton").addEventListener("click", () => document.body.classList.add("drawer-open"));
document.querySelector("#closeCart").addEventListener("click", () => document.body.classList.remove("drawer-open"));
document.querySelector("#closeWishlist").addEventListener("click", closeWishlistDrawer);
document.querySelector("#drawerBackdrop").addEventListener("click", () => {
  document.body.classList.remove("drawer-open");
  closeWishlistDrawer();
  closeCheckoutDetails();
});
document.querySelector("#checkoutButton").addEventListener("click", openCheckoutDetails);
document.querySelector("#closeCheckout").addEventListener("click", closeCheckoutDetails);
const wishlistToggle = document.querySelector("#wishlistButton");
wishlistToggle?.addEventListener("click", openWishlistDrawer);
nodes.checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(nodes.checkoutForm);
  const customer = Object.fromEntries(formData.entries());
  redirectToWhatsAppOrder(customer);
});
document.querySelector("#mobileSort").addEventListener("click", () => {
  const order = ["popular", "new", "high", "low"];
  const labels = {
    popular: "Popularity",
    new: "New Arrival",
    high: "High to Low",
    low: "Low to High"
  };
  state.sort = order[(order.indexOf(state.sort) + 1) % order.length];
  nodes.sort.value = state.sort;
  document.querySelector("#mobileSort").textContent = `Sort: ${labels[state.sort]}`;
  renderProducts();
});

let tick = 0;
setInterval(() => {
  if (!DATA) return;
  tick = Number(!tick);
  document.querySelector("#trustTicker").style.transform = `translateX(-${tick * 100}vw)`;
}, 2600);

async function initStorefront() {
  nodes.grid.innerHTML = `<p class="empty">Loading store data...</p>`;

  try {
    loadWishlist();
    const response = await fetch("./data/store.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Could not load data/store.json (${response.status})`);
    DATA = await response.json();
    renderSiteSettings();
    renderCollection();
    renderCart();
    updateWishlistButtonState();
  } catch (error) {
    nodes.grid.innerHTML = `<p class="empty">Store data failed to load. Check data/store.json and run the site from a local server.</p>`;
    console.error(error);
  }
}

initStorefront();

