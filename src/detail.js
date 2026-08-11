const params = new URLSearchParams(window.location.search);

const id = parseInt(params.get("id"));

const container = document.getElementById("detail");

const recommendationList = document.getElementById("recommendationList");

let qty = 1;
let currentProduct = null;

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("user"));
}

function getStorageKey(name) {
  const user = getCurrentUser();

  if (!user) return name;

  return `${name}_${user.email}`;
}

// ======================
// FORMAT RUPIAH
// ======================

function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price * 16000);
}

// ======================
// LOGIN CHECK
// ======================

function isLogin() {
  return localStorage.getItem("user") !== null;
}

// ======================
// LOGIN OVERLAY
// ======================

function showOverlay() {
  const overlay = document.getElementById("loginOverlay");

  overlay.classList.remove("hidden");

  overlay.classList.add("flex");
}

function closeOverlay() {
  document.getElementById("loginOverlay").classList.add("hidden");
}

// ======================
// SUCCESS CART
// ======================

function showSuccessOverlay() {
  const overlay = document.getElementById("successOverlay");

  overlay.classList.remove("hidden");

  overlay.classList.add("flex");
}

// ======================
// SUCCESS WISHLIST
// ======================

function showWishlistOverlay() {
  const overlay = document.getElementById("wishlistOverlay");

  overlay.classList.remove("hidden");

  overlay.classList.add("flex");
}

function closeWishlistOverlay() {
  document.getElementById("wishlistOverlay").classList.add("hidden");
}

// ======================
// NAVIGATION
// ======================

function continueShopping() {
  window.location.href = "homepage.html";
}

function goCart() {
  window.location.href = "cart.html";
}

// ======================
// LOAD DETAIL
// ======================

async function loadDetail() {
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);

    const product = await res.json();

    currentProduct = product;

    // ======================
    // RECENT PRODUCTS
    // ======================

    let recent =
      JSON.parse(localStorage.getItem(getStorageKey("recentProducts"))) || [];

    recent = recent.filter((p) => p.id !== product.id);

    recent.push({
      id: product.id,
      title: product.title,
      image: product.image,
      price: product.price,
    });

    if (recent.length > 20) {
      recent = recent.slice(-20);
    }

    localStorage.setItem(
      getStorageKey("recentProducts"),
      JSON.stringify(recent),
    );

    // ======================

    renderDetail(product);

    loadRecommendations(product.category, product.id);
  } catch (err) {
    console.error(err);

    container.innerHTML = `
      <div class="text-center text-red-500">
        Gagal memuat produk
      </div>
    `;
  }
}

// ======================
// RENDER DETAIL
// ======================

function renderDetail(item) {
  container.innerHTML = `

<div class="grid md:grid-cols-2 gap-10">

  <div class="bg-gray-100 rounded-3xl p-8">

    <img
      src="${item.image}"
      class="w-full h-[420px] object-contain">

  </div>

  <div>

    <div class="flex justify-between items-start mb-3">

      <span
        class="bg-gray-100 px-3 py-1 rounded-full text-sm capitalize">

        ${item.category}

      </span>

      <button
      id="wishlistBtn"
      onclick="toggleWishlist(${item.id})"
      class="
      w-15
      h-15
      flex
      items-center
      justify-center
      hover:bg-gray-50
      transition-all
      duration-300"
    >

      <iconify-icon
        icon="solar:heart-linear"
        class="text-[40px] text-gray-700"
      ></iconify-icon>

    </button>

    </div>

    <h1
      class="text-3xl font-bold mb-4">

      ${item.title}

    </h1>

    <div class="flex gap-3 mb-5">

      <span
        class="
        bg-yellow-100
        text-yellow-700
        px-3
        py-1
        rounded-full
        text-sm
        flex
        items-center
        gap-1
        w-fit"
      >

        <iconify-icon
          icon="material-symbols:star-rounded"
          class="text-[16px]"
        ></iconify-icon>

        ${item.rating.rate}

      </span>

      <span
        class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">

        Stok Tersedia

      </span>

      <span
        class="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">

        ${item.rating.count} Review

      </span>

    </div>

    <h2
      class="text-4xl font-bold mb-5">

      ${formatPrice(item.price)}

    </h2>

    <p
      class="text-gray-500 leading-relaxed mb-8">

      ${item.description}

    </p>

    <div
      class="flex items-center gap-4 mb-5">

      <button
        onclick="decreaseQty()"
        class="w-10 h-10 border border-gray-200 rounded-xl">

        -

      </button>

      <span
        id="qty"
        class="text-lg font-semibold">

        1

      </span>

      <button
        onclick="increaseQty()"
        class="w-10 h-10 border border-gray-200 rounded-xl">

        +

      </button>

    </div>

    <div class="mb-8">

      <p class="text-gray-400 text-sm">

        Total

      </p>

      <h2
        id="totalPrice"
        class="text-3xl font-bold">

        ${formatPrice(item.price)}

      </h2>

    </div>


    <div class="flex gap-4">

      <button
        onclick="addToCart(${item.id})"
        class="flex-1 bg-black text-white py-4 rounded-2xl">

        + Keranjang

      </button>

      <button
        onclick="buyNow(${item.id})"
        class="flex-1 border py-4 rounded-2xl">

        Beli Sekarang

      </button>

    </div>

  </div>

</div>

`;

  updateWishlistButton();
}

// ======================
// WISHLIST
// ======================

function toggleWishlist(id) {
  const wishlistKey = getStorageKey("wishlist");

  let wishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];

  if (wishlist.includes(id)) {
    wishlist = wishlist.filter((item) => item !== id);
  } else {
    wishlist.push(id);

    showWishlistOverlay();
  }

  localStorage.setItem(wishlistKey, JSON.stringify(wishlist));

  updateWishlistButton();
}

function updateWishlistButton() {
  const btn = document.getElementById("wishlistBtn");

  if (!btn || !currentProduct) return;

  const wishlist =
    JSON.parse(localStorage.getItem(getStorageKey("wishlist"))) || [];

  if (wishlist.includes(currentProduct.id)) {
    btn.innerHTML = `
    
      <iconify-icon
        icon="solar:heart-bold"
        class="text-[32px] text-red-500"
      ></iconify-icon>

    `;
  } else {
    btn.innerHTML = `
    
      <iconify-icon
        icon="solar:heart-linear"
        class="text-[32px] text-gray-700"
      ></iconify-icon>

    `;
  }
}

// ======================
// QTY
// ======================

function increaseQty() {
  qty++;

  document.getElementById("qty").innerText = qty;

  updateTotal();
}

function decreaseQty() {
  if (qty > 1) {
    qty--;

    document.getElementById("qty").innerText = qty;

    updateTotal();
  }
}

function updateTotal() {
  document.getElementById("totalPrice").innerText = formatPrice(
    currentProduct.price * qty,
  );
}

// ======================
// CART
// ======================

function addToCart(id) {
  if (!isLogin()) {
    return showOverlay();
  }

  let cart = JSON.parse(localStorage.getItem(getStorageKey("cart"))) || [];

  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: id,
      qty: qty,
    });
  }

  localStorage.setItem(getStorageKey("cart"), JSON.stringify(cart));

  showSuccessOverlay();
}

// ======================
// BUY NOW
// ======================

function buyNow(id) {
  if (!isLogin()) {
    return showOverlay();
  }

  localStorage.setItem(
    getStorageKey("checkoutItems"),
    JSON.stringify([
      {
        id: id,
        qty: qty,
      },
    ]),
  );

  window.location.href = "checkout.html";
}

// ======================
// REKOMENDASI
// ======================

async function loadRecommendations(category, productId) {
  const res = await fetch("https://fakestoreapi.com/products");

  const products = await res.json();

  const related = products
    .filter((p) => p.category === category && p.id !== productId)
    .slice(0, 5);

  recommendationList.innerHTML = "";

  related.forEach((item) => {
    recommendationList.innerHTML += `

<div
onclick="location.href='detail.html?id=${item.id}'"
class="bg-white border border-gray-200 rounded-2xl p-4 cursor-pointer hover:shadow">

<img
src="${item.image}"
class="w-full h-32 object-contain mb-3">

<h2
class="text-sm line-clamp-2 mb-2">

${item.title}

</h2>

<p class="font-semibold">

${formatPrice(item.price)}

</p>

</div>

`;
  });
}


// ======================
// CLOSE SUCCESS OVERLAY
// ======================

function closeSuccessOverlay() {
  const overlay = document.getElementById("successOverlay");

  overlay.classList.add("hidden");
}

// ======================
// INIT
// ======================

loadDetail();
