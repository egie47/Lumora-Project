const container = document.getElementById("wishlistContainer");

// ======================
// LOGIN CHECK
// ======================

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "login.html";
}

// ======================
// STORAGE
// ======================

const wishlistKey = `wishlist_${user.email}`;

let wishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];

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
// LOAD WISHLIST
// ======================

async function loadWishlist() {
  try {
    const res = await fetch("https://fakestoreapi.com/products");

    const products = await res.json();

    const favoriteProducts = products.filter((product) =>
      wishlist.includes(product.id),
    );

    renderWishlist(favoriteProducts);
  } catch (err) {
    console.error(err);

    container.innerHTML = `
      <div class="col-span-full">
        <div class="bg-white border border-gray-200 rounded-3xl p-10 text-center">

          <div class="text-5xl mb-4">
            ⚠️
          </div>

          <h2 class="font-semibold text-lg mb-2">
            Gagal Memuat Wishlist
          </h2>

        </div>
      </div>
    `;
  }
}

// ======================
// RENDER
// ======================

function renderWishlist(products) {
  if (products.length === 0) {
    container.innerHTML = `

      <div class="col-span-full">

        <div class="bg-white border border-gray-200 rounded-3xl p-10 text-center">


          <h2 class="font-semibold text-lg mb-2">
            Wishlist Kosong
          </h2>

          <p class="text-gray-500 mb-4">
            Tambahkan produk favoritmu terlebih dahulu
          </p>

          <a
            href="homepage.html"
            class="inline-block bg-black text-white px-5 py-3 rounded-xl">

            Mulai Belanja

          </a>

        </div>

      </div>

    `;

    return;
  }

  container.innerHTML = "";

  products.forEach((product) => {
    container.innerHTML += `

      <div
        class="
        bg-white
        rounded-3xl
        border border-gray-200
        p-4
        hover:shadow-lg
        transition">

        <img
          src="${product.image}"
          class="
          w-full
          h-40
          object-contain
          mb-4">

        <h2
          class="
          text-sm
          font-medium
          line-clamp-2
          h-10
          mb-2">

          ${product.title}

        </h2>

        <p
          class="
          text-xs
          text-gray-400
          capitalize
          mb-3">

          ${product.category}

        </p>

        <div
          class="
          flex
          justify-between
          items-center
          mb-3">

          <p class="font-semibold">

            ${formatRupiah(product.price)}

          </p>

          <span class="text-yellow-500 text-xs">

            ⭐ ${product.rating.rate}

          </span>

        </div>

        <div class="flex gap-2">

          <button
            onclick="viewProduct(${product.id})"
            class="
            flex-1
            bg-black
            text-white
            py-2
            rounded-xl
            text-sm">

            Detail

          </button>

          <button
            onclick="removeWishlist(${product.id})"
            class="
            px-4
            border border-gray-200
            rounded-xl">

            🗑️

          </button>

        </div>

      </div>

    `;
  });
}

// ======================
// DETAIL
// ======================

function viewProduct(id) {
  window.location.href = `detail.html?id=${id}`;
}

// ======================
// REMOVE
// ======================

function removeWishlist(id) {
  wishlist = wishlist.filter((item) => item !== id);

  localStorage.setItem(wishlistKey, JSON.stringify(wishlist));

  loadWishlist();
}

// ======================
// INIT
// ======================

loadWishlist();
