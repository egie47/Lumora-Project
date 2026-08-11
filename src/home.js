let user = null;

try {
  const userData = localStorage.getItem("user");

  if (userData) {
    user = JSON.parse(userData);
  }
} catch (err) {
  console.error(err);

  localStorage.removeItem("user");

  window.location.href = "login.html";
}

if (!user) {
  window.location.href = "login.html";
}

const searchInput = document.getElementById("searchInput");

const welcomeText = document.getElementById("welcomeText");

const loading = document.getElementById("loading");

const productCount = document.getElementById("productCount");

welcomeText.innerText = `Halo, ${user.name}`;

let allProducts = [];

let currentCategory = "all";

// ======================
// FORMAT RUPIAH
// ======================

function formatRupiah(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price * 16000);
}

// ======================
// LOAD PRODUCTS
// ======================

async function loadProducts() {
  try {
    const res = await fetch("https://fakestoreapi.com/products");

    allProducts = await res.json();

    renderProducts(allProducts);
  } catch (err) {
    console.error(err);
  }

  loading.remove();
}

// ======================
// RENDER PRODUCTS
// ======================

function renderProducts(products) {
  const container = document.getElementById("productList");

  productCount.innerText = `${products.length} Produk`;

  let html = "";

  products.forEach((item) => {
    html += `

    <div
      onclick="goToDetail(${item.id})"
      class="
      group
      relative
      bg-white
      rounded-2xl
      border
      border-gray-200
      p-4
      overflow-hidden
      cursor-pointer
      hover:shadow-2xl
      hover:-translate-y-1
      transition-all
      duration-300">

      <!-- OVERLAY -->

      <div
        class="
        absolute
        inset-0
        bg-black/80
        opacity-0
        group-hover:opacity-100
        transition
        duration-300
        flex
        items-center
        justify-center
        gap-3
        z-10">

        <!-- BUTTON CART -->

        <button
          onclick="event.stopPropagation(); addToCart(${item.id})"
          class="
          h-11
          px-4
          rounded-xl
          bg-white
          text-black
          font-medium
          hover:bg-gray-200
          transition">

          Keranjang

        </button>

        <!-- BUTTON DETAIL -->

        <button
          onclick="event.stopPropagation(); goToDetail(${item.id})"
          class="
          h-11
          px-4
          rounded-xl
          border
          border-white
          text-white
          hover:bg-white
          hover:text-black
          transition">

          Detail

        </button>

      </div>

      <!-- IMAGE -->

      <img
        loading="lazy"
        src="${item.image}"
        class="
        w-full
        h-40
        object-contain
        mb-4">

      <!-- TITLE -->

      <h2
        class="
        text-sm
        font-medium
        line-clamp-2
        h-10
        mb-2">

        ${item.title}

      </h2>

      <!-- CATEGORY -->

      <p
        class="
        text-xs
        text-gray-400
        capitalize
        mb-3">

        ${item.category}

      </p>

      <!-- FOOTER -->

      <div
        class="
        flex
        justify-between
        items-center">

        <p class="font-semibold">

          ${formatRupiah(item.price)}

        </p>

        <div
          class="
          flex
          items-center
          gap-1
          text-yellow-500
          text-sm">

          <iconify-icon
            icon="material-symbols:star-rounded"
            width="18"
            height="18"
          ></iconify-icon>

          <span>${item.rating.rate}</span>

        </div>

      </div>

    </div>

    `;
  });

  container.innerHTML = html;
}

// ======================
// ADD TO CART
// ======================

function addToCart(id) {
  // AMBIL PRODUK

  const product = allProducts.find((item) => item.id === id);

  if (!product) return;

  // AMBIL CART USER

  let cart = JSON.parse(localStorage.getItem(`cart_${user.email}`)) || [];

  // CEK SUDAH ADA BELUM

  const existingItem = cart.find((item) => item.id === id);

  // JIKA SUDAH ADA

  if (existingItem) {
    existingItem.qty += 1;
  }

  // JIKA BELUM ADA
  else {
    cart.push({
      id: product.id,
      qty: 1,
    });
  }

  // SIMPAN

  localStorage.setItem(`cart_${user.email}`, JSON.stringify(cart));

  // POPUP

  openCartPopup();
}

// ======================
// CART POPUP
// ======================

function openCartPopup() {
  const popup = document.getElementById("cartPopup");

  popup.classList.remove("hidden");
  popup.classList.add("flex");
}

function closeCartPopup() {
  const popup = document.getElementById("cartPopup");

  popup.classList.add("hidden");
  popup.classList.remove("flex");
}

function goToCartPage() {
  window.location.href = "cart.html";
}

// ======================
// FILTER CATEGORY
// ======================

function filterCategory(category) {
  currentCategory = category;

  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.className =
      "category-btn bg-white text-black border border-gray-200 px-5 py-2 rounded-xl whitespace-nowrap hover:bg-gray-100 transition";
  });

  const activeBtn = document.getElementById(category);

  activeBtn.className =
    "category-btn bg-black text-white border border-black px-5 py-2 rounded-xl whitespace-nowrap transition";

  let filtered = allProducts;

  if (category !== "all") {
    filtered = allProducts.filter((item) => item.category === category);
  }

  renderProducts(filtered);
}

// ======================
// SEARCH
// ======================

searchInput.addEventListener("input", function () {
  const keyword = this.value.toLowerCase();

  let filtered = allProducts;

  if (currentCategory !== "all") {
    filtered = filtered.filter((item) => item.category === currentCategory);
  }

  filtered = filtered.filter((item) =>
    item.title.toLowerCase().includes(keyword),
  );

  renderProducts(filtered);
});

// ======================
// NAVIGATION
// ======================

function goToDetail(id) {
  window.location.href = `detail.html?id=${id}`;
}

function goToCart() {
  window.location.href = "cart.html";
}

function goToAccount() {
  window.location.href = "account.html";
}

// ======================
// LOGOUT MODAL
// ======================

function openLogoutModal() {
  const modal = document.getElementById("logoutModal");

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeLogoutModal() {
  const modal = document.getElementById("logoutModal");

  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

// ======================
// LOGOUT
// ======================

function logout() {
  localStorage.removeItem("user");

  window.location.href = "index.html";
}

// ======================
// INIT
// ======================

loadProducts();
