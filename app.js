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
  checkoutForm: document.querySelector("#checkoutForm"),
  productModal: document.querySelector("#productModal"),
  closeProduct: document.querySelector("#closeProduct"),
  modalProductImage: document.querySelector("#modalProductImage"),
  modalProductBrand: document.querySelector("#modalProductBrand"),
  modalProductName: document.querySelector("#modalProductName"),
  modalProductRating: document.querySelector("#modalProductRating"),
  modalProductPrice: document.querySelector("#modalProductPrice"),
  modalProductMRP: document.querySelector("#modalProductMRP"),
  modalProductDiscount: document.querySelector("#modalProductDiscount"),
  modalProductOffer: document.querySelector("#modalProductOffer"),
  modalProductFit: document.querySelector("#modalProductFit"),
  modalProductDesign: document.querySelector("#modalProductDesign"),
  modalProductColor: document.querySelector("#modalProductColor"),
  modalProductCategory: document.querySelector("#modalProductCategory"),
  modalSizeChips: document.querySelector("#modalSizeChips"),
  modalSizeError: document.querySelector("#modalSizeError"),
  modalAddButton: document.querySelector("#modalAddButton")
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
  document.title = `${site.brandName} Storefront` + (state.section === "home" ? "" : ` - ${state.section.charAt(0).toUpperCase() + state.section.slice(1)}`);
  
  const brandSpan = document.querySelector(".brand span");
  if (brandSpan) brandSpan.textContent = site.brandName;

  const shippingSpan = document.querySelector(".shipping-band span");
  if (shippingSpan) shippingSpan.textContent = site.freeShippingText;

  const ticker = document.querySelector("#trustTicker");
  if (ticker) {
    ticker.innerHTML = site.stats.map((stat) => `
      <span><img src="${stat.icon}" alt="" /> <b>${stat.value}</b> ${stat.label}</span>
    `).join("");
  }
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
  if (!nodes.filterGroups) return;
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
  if (!nodes.chips) return;
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
  if (!nodes.grid) return;
  const items = productsForView();
  if (nodes.count) nodes.count.textContent = `${items.length} Products`;
  nodes.grid.innerHTML = items.map((item) => `
    <article class="product-card" data-product-id="${item.id}">
      <div class="product-media">
        <img src="${item.image}" alt="${item.name}" loading="lazy" />
        <span class="fit-badge">${item.fit}</span>
        <span class="rating"><span>&#9733;</span>${item.rating}</span>
        <button class="wishlist ${state.wishlist.has(item.id) ? "is-active" : ""}" data-wishlist="${item.id}" aria-label="Add ${item.name} to wishlist">${state.wishlist.has(item.id) ? "&#9829;" : "&#9825;"}</button>
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
  if (nodes.title) nodes.title.textContent = collection.title;
  if (nodes.crumb) nodes.crumb.textContent = collection.crumb;
  renderFilters();
  renderChips();
  renderProducts();
}

function renderCart() {
  if (!nodes.cartCount || !nodes.cartTotal || !nodes.cartItems) return;
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
          <span class="cart-item-size" style="display: block; font-size: 12px; color: var(--muted); margin: 3px 0;">Size: ${item.selectedSize || 'M'}</span>
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
  const isActive = state.wishlist.size > 0;
  button.classList.toggle('is-active', isActive);
  button.innerHTML = isActive ? '&#9829;' : '&#9825;';
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

function saveCart() {
  try {
    localStorage.setItem('fransonoCart', JSON.stringify(state.cart.map((item) => ({ id: item.id, size: item.selectedSize }))));
  } catch (error) {
    console.warn('Could not save cart', error);
  }
}

function loadCart() {
  try {
    const stored = localStorage.getItem('fransonoCart');
    if (stored && DATA) {
      const items = JSON.parse(stored);
      state.cart = items.map((entry) => {
        const id = typeof entry === 'string' ? entry : entry.id;
        const size = typeof entry === 'string' ? 'M' : entry.size;
        const product = allProducts().find((p) => p.id === id);
        if (product) {
          return { ...product, selectedSize: size || product.sizes[0] || 'M' };
        }
        return null;
      }).filter(Boolean);
    }
  } catch (error) {
    console.warn('Could not load cart', error);
  }
}

function renderWishlist() {
  const items = allProducts().filter((item) => state.wishlist.has(item.id));
  const container = document.querySelector('#wishlistItems');
  if (!container) return;
  updateWishlistButtonState();
  container.innerHTML = items.length
    ? items.map((item) => `
      <div class="cart-line">
        <img src="${item.image}" alt="${item.name}" />
        <div>
          <h3>${item.brand}</h3>
          <p>${item.name}</p>
          <strong>${rupees(item.price)}</strong>
          <button class="add-btn" data-cart="${item.id}" aria-label="Add ${item.name} to cart">ADD TO BAG</button>
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
    lines.push(`${item.name} (Size: ${item.selectedSize || 'M'})`);
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
  const modal = document.querySelector("#checkoutModal");
  if (modal) modal.setAttribute("aria-hidden", "false");
}

function closeCheckoutDetails() {
  document.body.classList.remove("checkout-open");
  const modal = document.querySelector("#checkoutModal");
  if (modal) modal.setAttribute("aria-hidden", "true");
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

function openProductModal(productId) {
  const product = allProducts().find((p) => p.id === productId);
  if (!product) return;
  
  state.selectedProduct = product;
  state.selectedSize = null;
  
  if (nodes.modalProductImage) nodes.modalProductImage.src = product.image;
  if (nodes.modalProductImage) nodes.modalProductImage.alt = product.name;
  if (nodes.modalProductBrand) nodes.modalProductBrand.textContent = product.brand;
  if (nodes.modalProductName) nodes.modalProductName.textContent = product.name;
  if (nodes.modalProductRating) nodes.modalProductRating.textContent = product.rating;
  if (nodes.modalProductPrice) nodes.modalProductPrice.textContent = rupees(product.price);
  if (nodes.modalProductMRP) nodes.modalProductMRP.textContent = rupees(product.mrp);
  if (nodes.modalProductDiscount) nodes.modalProductDiscount.textContent = product.discount;
  
  if (nodes.modalProductOffer) {
    nodes.modalProductOffer.textContent = product.offer || "";
    nodes.modalProductOffer.style.display = product.offer ? "inline-block" : "none";
  }
  
  if (nodes.modalProductFit) nodes.modalProductFit.textContent = product.fit;
  if (nodes.modalProductDesign) nodes.modalProductDesign.textContent = product.design;
  if (nodes.modalProductColor) nodes.modalProductColor.textContent = product.color;
  if (nodes.modalProductCategory) nodes.modalProductCategory.textContent = product.category;
  
  if (nodes.modalSizeChips) {
    const sizes = product.sizes && product.sizes.length ? product.sizes : ["XS", "S", "M", "L", "XL"];
    nodes.modalSizeChips.innerHTML = sizes.map((size) => `
      <button type="button" data-modal-size="${size}">${size}</button>
    `).join("");
  }
  
  if (nodes.modalSizeError) nodes.modalSizeError.style.display = "none";
  
  document.body.classList.remove('drawer-open', 'wishlist-open', 'checkout-open');
  document.body.classList.add('product-open');
  if (nodes.productModal) nodes.productModal.setAttribute("aria-hidden", "false");
}

function closeProductModal() {
  document.body.classList.remove('product-open');
  if (nodes.productModal) nodes.productModal.setAttribute("aria-hidden", "true");
  state.selectedProduct = null;
  state.selectedSize = null;
}

document.addEventListener("click", (event) => {
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

  // Intercept size selection in product modal
  const sizeChip = event.target.closest("[data-modal-size]");
  if (sizeChip) {
    state.selectedSize = sizeChip.dataset.modalSize;
    document.querySelectorAll("[data-modal-size]").forEach((btn) => {
      btn.classList.toggle("selected", btn.dataset.modalSize === state.selectedSize);
    });
    if (nodes.modalSizeError) nodes.modalSizeError.style.display = "none";
    return;
  }

  // Intercept Add to Bag from details modal
  const modalAddBtn = event.target.closest("#modalAddButton");
  if (modalAddBtn) {
    if (!state.selectedProduct) return;
    if (!state.selectedSize) {
      if (nodes.modalSizeError) nodes.modalSizeError.style.display = "block";
      return;
    }
    const productWithSize = { ...state.selectedProduct, selectedSize: state.selectedSize };
    state.cart.push(productWithSize);
    saveCart();
    renderCart();
    closeProductModal();
    document.body.classList.add("drawer-open");
    return;
  }

  // Intercept product modal close click
  const closeProductBtn = event.target.closest("#closeProduct");
  if (closeProductBtn) {
    closeProductModal();
    return;
  }

  // Intercept product card or add to bag click to open details modal
  const cartButton = event.target.closest("[data-cart]");
  const productCard = event.target.closest("[data-product-id]");
  if (cartButton || productCard) {
    const id = cartButton ? cartButton.dataset.cart : productCard.dataset.productId;
    openProductModal(id);
    return;
  }

  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) {
    state.cart.splice(Number(removeButton.dataset.remove), 1);
    saveCart();
    renderCart();
  }
});

function handleSearch(event) {
  state.query = event.target.value.trim();
  if (nodes.search) nodes.search.value = state.query;
  const mobileInput = document.querySelector("#mobileSearchInput");
  if (mobileInput) mobileInput.value = state.query;
  renderProducts();
}

nodes.search?.addEventListener("input", handleSearch);
document.querySelector("#mobileSearchInput")?.addEventListener("input", handleSearch);

nodes.sort?.addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderProducts();
});

document.querySelector("#filterToggle")?.addEventListener("click", () => document.body.classList.add("filters-open"));
document.querySelector("#closeFilters")?.addEventListener("click", () => document.body.classList.remove("filters-open"));
document.querySelector("#menuToggle")?.addEventListener("click", () => document.body.classList.toggle("filters-open"));
document.querySelector("#cartButton")?.addEventListener("click", () => document.body.classList.add("drawer-open"));
document.querySelector("#closeCart")?.addEventListener("click", () => document.body.classList.remove("drawer-open"));
document.querySelector("#closeWishlist")?.addEventListener("click", closeWishlistDrawer);
document.querySelector("#drawerBackdrop")?.addEventListener("click", () => {
  document.body.classList.remove("drawer-open");
  document.body.classList.remove("filters-open");
  closeWishlistDrawer();
  closeCheckoutDetails();
  closeProductModal();
});
document.querySelector("#checkoutButton")?.addEventListener("click", openCheckoutDetails);
document.querySelector("#closeCheckout")?.addEventListener("click", closeCheckoutDetails);
const wishlistToggle = document.querySelector("#wishlistButton");
wishlistToggle?.addEventListener("click", openWishlistDrawer);
nodes.checkoutForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(nodes.checkoutForm);
  const customer = Object.fromEntries(formData.entries());
  redirectToWhatsAppOrder(customer);
});
document.querySelector("#mobileSort")?.addEventListener("click", () => {
  const order = ["popular", "new", "high", "low"];
  const labels = {
    popular: "Popularity",
    new: "New Arrival",
    high: "High to Low",
    low: "Low to High"
  };
  state.sort = order[(order.indexOf(state.sort) + 1) % order.length];
  if (nodes.sort) nodes.sort.value = state.sort;
  const mobSortBtn = document.querySelector("#mobileSort");
  if (mobSortBtn) mobSortBtn.textContent = `Sort: ${labels[state.sort]}`;
  renderProducts();
});

let tick = 0;
setInterval(() => {
  if (!DATA) return;
  const ticker = document.querySelector("#trustTicker");
  if (!ticker) return;
  tick = Number(!tick);
  ticker.style.transform = `translateX(-${tick * 100}vw)`;
}, 2600);

async function initStorefront() {
  if (nodes.grid) {
    nodes.grid.innerHTML = `<p class="empty">Loading store data...</p>`;
  }

  try {
    loadWishlist();
    const response = await fetch("./data/store.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Could not load data/store.json (${response.status})`);
    DATA = await response.json();
    loadCart();
    
    const pathname = window.location.pathname;
    if (pathname.endsWith("/women.html") || pathname.endsWith("/women")) {
      state.section = "women";
    } else if (pathname.endsWith("/men.html") || pathname.endsWith("/men")) {
      state.section = "men";
    } else {
      state.section = "home";
    }

    renderSiteSettings();
    if (state.section !== "home" && nodes.grid) {
      renderCollection();
    }
    renderCart();
    updateWishlistButtonState();
  } catch (error) {
    if (nodes.grid) {
      nodes.grid.innerHTML = `<p class="empty">Store data failed to load. Check data/store.json and run the site from a local server.</p>`;
    }
    console.error(error);
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProductModal();
    closeWishlistDrawer();
    closeCheckoutDetails();
    document.body.classList.remove("drawer-open", "filters-open");
  }
});

initStorefront();
