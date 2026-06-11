const DATA = {
  men: {
    crumb: "Men Clothing",
    title: "Clothes for Men",
    total: 2583,
    categories: ["t-shirt", "shirt", "hoodies", "joggers", "jeans"],
    filters: {
      Category: ["T-Shirt", "Shirt", "Hoodies", "Joggers", "Jeans"],
      Sizes: ["XS", "S", "M", "L", "XL"],
      Brand: ["FRANSONO", "FRANSONO X Marvel", "FRANSONO Heavy Duty 1.0", "FRANSONO Air 1.0"],
      Color: ["Black", "Blue", "Green", "White", "Brown"],
      Design: ["Graphic Print", "Solid", "Typography", "Aop", "Checked"],
      Fit: ["Oversized Fit", "Regular Fit", "Straight Fit", "Super Loose Fit"],
      Offers: ["Buy 2 For 1199", "Buy 3 For 1199"],
      Ratings: ["4.5 And Above", "4 And Above", "0 And Above"]
    },
    products: [
      {
        id: "m1",
        brand: "FRANSONO X Marvel",
        name: "Men's Green Wakanda Forever Graphic Printed Oversized T-shirt",
        image: "https://images.bewakoof.com/t640/men-s-green-wakanda-forever-graphic-printed-oversized-t-shirt-637169-1739771293-1.jpg",
        fit: "OVERSIZED FIT",
        rating: 4.6,
        price: 706,
        mrp: 1449,
        discount: "51% OFF",
        offer: "Buy 2 for 1199",
        category: "t-shirt",
        isNew: false
      },
      {
        id: "m2",
        brand: "FRANSONO X Marvel",
        name: "Men's Brown Most Wanted Graphic Printed Oversized T-shirt",
        image: "https://images.bewakoof.com/t640/men-s-brown-most-wanted-graphic-printed-oversized-t-shirt-629607-1753166834-1.jpg",
        fit: "OVERSIZED FIT",
        rating: 4.5,
        price: 660,
        mrp: 1299,
        discount: "49% OFF",
        offer: "Buy 2 for 1199",
        category: "t-shirt",
        isNew: true
      },
      {
        id: "m3",
        brand: "FRANSONO X Marvel",
        name: "Men's Black Venom Graphic Printed Oversized T-shirt",
        image: "https://images.bewakoof.com/t640/men-s-black-venom-graphic-printed-oversized-t-shirt-651229-1731501911-1.jpg",
        fit: "OVERSIZED FIT",
        rating: 4.5,
        price: 645,
        mrp: 1799,
        discount: "64% OFF",
        offer: "Buy 2 for 1199",
        category: "t-shirt",
        isNew: false
      },
      {
        id: "m4",
        brand: "FRANSONO",
        name: "Men's Brick Red Magar Much Graphic Printed T-shirt",
        image: "https://images.bewakoof.com/t640/men-s-brick-red-magar-much-graphic-printed-t-shirt-677649-1746769064-1.jpg",
        fit: "REGULAR FIT",
        rating: 4.5,
        price: 499,
        mrp: 999,
        discount: "50% OFF",
        offer: "Buy 3 for 1199",
        category: "t-shirt",
        isNew: true
      },
      {
        id: "m5",
        brand: "FRANSONO X Marvel",
        name: "Men's Black Ghost Rider Spirit of Vengeance Oversized T-shirt",
        image: "https://images.bewakoof.com/t640/men-s-black-ghost-rider-spirit-of-vengeance-graphic-printed-oversized-t-shirt-604148-1730987047-1.jpg",
        fit: "OVERSIZED FIT",
        rating: 4.4,
        price: 799,
        mrp: 1799,
        discount: "56% OFF",
        offer: "Buy 2 for 1199",
        category: "t-shirt",
        isNew: false
      },
      {
        id: "m6",
        brand: "FRANSONO X Marvel",
        name: "Men's Red Friendly Neighbour Graphic Printed Oversized T-shirt",
        image: "https://images.bewakoof.com/t640/men-s-red-friendly-neighbour-graphic-printed-oversized-t-shirt-660978-1738573645-1.jpg",
        fit: "OVERSIZED FIT",
        rating: 4.6,
        price: 749,
        mrp: 1499,
        discount: "50% OFF",
        offer: "Buy 2 for 1199",
        category: "t-shirt",
        isNew: true
      }
    ]
  },
  women: {
    crumb: "Women Clothing",
    title: "Women's Clothing",
    total: 1335,
    categories: ["t-shirt", "pyjama", "dress", "hoodies", "top"],
    filters: {
      Category: ["T-Shirt", "Pyjama", "Dress", "Hoodies", "Top"],
      Sizes: ["XS", "S", "M", "L", "XL"],
      Brand: ["FRANSONO", "FRANSONO X Disney", "FRANSONO Heavy Duty 1.0", "FRANSONO Air 1.0"],
      Color: ["Black", "Blue", "White", "Green", "Pink"],
      Design: ["Graphic Print", "Solid", "Aop", "Typography", "Printed"],
      Fit: ["Oversized Fit", "Regular Fit", "Boyfriend Fit", "Wide Leg"],
      Offers: ["Buy 2 For 1099", "Buy 3 For 1199"],
      Ratings: ["4.5 And Above", "4 And Above", "3 And Above"]
    },
    products: [
      {
        id: "w1",
        brand: "FRANSONO",
        name: "Women's Beige Drip Typography Boyfriend T-shirt",
        image: "https://images.bewakoof.com/t640/women-s-beige-drip-graphic-printed-boyfriend-t-shirt-687568-1758530941-1.jpg",
        fit: "BOYFRIEND FIT",
        rating: 4.5,
        price: 409,
        mrp: 1299,
        discount: "70% OFF",
        offer: "Buy 2 for 1099",
        category: "t-shirt",
        isNew: true
      },
      {
        id: "w2",
        brand: "FRANSONO",
        name: "Women's Green The Panda Way Graphic Printed Oversized T-shirt",
        image: "https://images.bewakoof.com/t640/women-s-green-the-panda-way-graphic-printed-oversized-t-shirt-581312-1737092527-1.jpg",
        fit: "OVERSIZED FIT",
        rating: 4.7,
        price: 554,
        mrp: 1499,
        discount: "63% OFF",
        offer: "Buy 2 for 1099",
        category: "t-shirt",
        isNew: false
      },
      {
        id: "w3",
        brand: "FRANSONO X Disney",
        name: "Women's Orange Fresh As A Daisy Graphic Printed Boyfriend T-shirt",
        image: "https://images.bewakoof.com/t640/women-s-orange-fresh-as-a-daisy-graphic-printed-boyfriend-t-shirt-638829-1738331416-1.jpg",
        fit: "BOYFRIEND FIT",
        rating: 4.5,
        price: 540,
        mrp: 1299,
        discount: "58% OFF",
        offer: "Buy 2 for 1099",
        category: "t-shirt",
        isNew: false
      },
      {
        id: "w4",
        brand: "FRANSONO",
        name: "Women's Mellow Rose Pink Awesome Typography Boyfriend T-shirt",
        image: "https://images.bewakoof.com/t640/women-s-mellow-rose-pink-awesome-graphic-printed-boyfriend-t-shirt-687587-1758525046-1.jpg",
        fit: "BOYFRIEND FIT",
        rating: 4.4,
        price: 499,
        mrp: 1299,
        discount: "62% OFF",
        offer: "Buy 3 for 1199",
        category: "t-shirt",
        isNew: true
      },
      {
        id: "w5",
        brand: "FRANSONO",
        name: "Women's Beige Sarcasm Typography Boyfriend T-shirt",
        image: "https://images.bewakoof.com/t640/women-s-beige-sarcasm-graphic-printed-boyfriend-t-shirt-685185-1752228595-1.jpg",
        fit: "BOYFRIEND FIT",
        rating: 4.3,
        price: 599,
        mrp: 1299,
        discount: "54% OFF",
        offer: "Buy 2 for 1099",
        category: "top",
        isNew: false
      },
      {
        id: "w6",
        brand: "FRANSONO",
        name: "Women's Caramel Orange Vibe Garden Graphic Printed Boyfriend T-shirt",
        image: "https://images.bewakoof.com/t640/women-s-caramel-orange-vibe-garden-graphic-printed-boyfriend-t-shirt-666782-1744194441-1.jpg",
        fit: "BOYFRIEND FIT",
        rating: 4.6,
        price: 699,
        mrp: 1499,
        discount: "53% OFF",
        offer: "Buy 2 for 1099",
        category: "t-shirt",
        isNew: true
      }
    ]
  }
};

const state = {
  section: "men",
  query: "",
  category: "all",
  sort: "popular",
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
  cartTotal: document.querySelector("#cartTotal")
};

function rupees(value) {
  return `\u20B9${value.toLocaleString("en-IN")}`;
}

function productsForView() {
  let items = [...DATA[state.section].products];
  if (state.category !== "all") {
    items = items.filter((item) => item.category === state.category);
  }
  if (state.query) {
    const query = state.query.toLowerCase();
    items = items.filter((item) => `${item.brand} ${item.name}`.toLowerCase().includes(query));
  }
  if (state.sort === "high") items.sort((a, b) => b.price - a.price);
  if (state.sort === "low") items.sort((a, b) => a.price - b.price);
  if (state.sort === "new") items.sort((a, b) => Number(b.isNew) - Number(a.isNew));
  return items;
}

function renderFilters() {
  const groups = DATA[state.section].filters;
  nodes.filterGroups.innerHTML = Object.entries(groups)
    .map(([group, values]) => `
      <section class="filter-group">
        <button class="filter-title" type="button">${group}<span>&#8963;</span></button>
        <div class="filter-options">
          ${values.map((value) => `
            <label>
              <input type="checkbox" />
              <span>${value}</span>
            </label>
          `).join("")}
        </div>
      </section>
    `)
    .join("");
}

function renderChips() {
  const categories = ["all", ...DATA[state.section].categories];
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
  nodes.count.textContent = `${items.length || DATA[state.section].total} Products`;
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
}

function renderCollection() {
  const collection = DATA[state.section];
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

function buildWhatsAppOrderMessage() {
  const total = state.cart.reduce((sum, item) => sum + item.price, 0);
  const lines = [
    "Hello FRANSONO, I want to place this order:",
    ""
  ];

  state.cart.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.brand}`);
    lines.push(item.name);
    lines.push(`Price: ${rupees(item.price)}`);
    lines.push(`Image: ${item.image}`);
    lines.push("");
  });

  lines.push(`Total: ${rupees(total)}`);
  lines.push("");
  lines.push("Please confirm availability and delivery details.");
  return lines.join("\n");
}

function redirectToWhatsAppOrder() {
  if (!state.cart.length) {
    alert("Your bag is empty. Add products before placing an order.");
    return;
  }

  const phoneNumber = "919573424486";
  const message = encodeURIComponent(buildWhatsAppOrderMessage());
  window.location.href = `https://wa.me/${phoneNumber}?text=${message}`;
}

function setSection(section) {
  if (!DATA[section]) return;
  state.section = section;
  state.category = "all";
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

  const wishlistButton = event.target.closest("[data-wishlist]");
  if (wishlistButton) {
    const id = wishlistButton.dataset.wishlist;
    state.wishlist.has(id) ? state.wishlist.delete(id) : state.wishlist.add(id);
    renderProducts();
  }

  const cartButton = event.target.closest("[data-cart]");
  if (cartButton) {
    const allProducts = Object.values(DATA).flatMap((collection) => collection.products);
    const product = allProducts.find((item) => item.id === cartButton.dataset.cart);
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
    if (DATA[section]) {
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
document.querySelector("#menuToggle").addEventListener("click", () => nodes.mainNav.classList.toggle("is-open"));
document.querySelector("#cartButton").addEventListener("click", () => document.body.classList.add("drawer-open"));
document.querySelector("#closeCart").addEventListener("click", () => document.body.classList.remove("drawer-open"));
document.querySelector("#drawerBackdrop").addEventListener("click", () => document.body.classList.remove("drawer-open"));
document.querySelector("#checkoutButton").addEventListener("click", redirectToWhatsAppOrder);
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
  tick = Number(!tick);
  document.querySelector("#trustTicker").style.transform = `translateX(-${tick * 100}vw)`;
}, 2600);

renderCollection();
renderCart();
