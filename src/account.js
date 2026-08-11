// ======================
// FORMAT RUPIAH
// ======================

function formatRupiah(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

// ======================
// LOGIN CHECK
// ======================

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "login.html";
}

// ======================
// PROFILE
// ======================

document.getElementById("userName").innerText =
  user.nickname || user.name || "User";

document.getElementById("userEmail").innerText = user.email || "-";

if (user.photo) {
  document.getElementById("profileImage").src = user.photo;
}

// ======================
// STORAGE
// ======================

const userKey = user.email;

const transactions =
  JSON.parse(localStorage.getItem(`transactions_${userKey}`)) || [];

const wishlist = JSON.parse(localStorage.getItem(`wishlist_${userKey}`)) || [];

const recentProducts =
  JSON.parse(localStorage.getItem(`recentProducts_${userKey}`)) || [];

// ======================
// STATISTIK
// ======================

let totalSpent = 0;

transactions.forEach((trx) => {
  totalSpent += (trx.total || 0) * 16000;
});

document.getElementById("totalSpent").innerText = formatRupiah(totalSpent);

document.getElementById("wishlistCount").innerText = wishlist.length;

document.getElementById("orderCount").innerText = transactions.length;

document.getElementById("invoiceCount").innerText = transactions.length;

// ======================
// RECENT PRODUCTS
// ======================

const recentContainer = document.getElementById("recentProducts");

if (recentContainer) {
  if (recentProducts.length === 0) {
    recentContainer.innerHTML = `

      <div class="col-span-full text-center text-gray-400 py-5">

        Belum ada produk dilihat

      </div>

    `;
  } else {
    recentContainer.innerHTML = "";

    recentProducts
      .slice(-4)
      .reverse()
      .forEach((item) => {
        recentContainer.innerHTML += `

          <a
            href="detail.html?id=${item.id}"
            class="
            border border-gray-200
            rounded-2xl
            p-3
            hover:shadow
            transition
            bg-white">

            <img
              src="${item.image}"
              class="
              w-full
              h-24
              object-contain
              mb-3">

            <p
              class="
              text-xs
              line-clamp-2">

              ${item.title}

            </p>

          </a>

        `;
      });
  }
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
// CLOSE MODAL WHEN CLICK BACKDROP
// ======================

document.getElementById("logoutModal").addEventListener("click", (e) => {
  if (e.target.id === "logoutModal") {
    closeLogoutModal();
  }
});

// ======================
// ESC KEY CLOSE MODAL
// ======================

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeLogoutModal();
  }
});

// ======================
// LOGOUT
// ======================

function logout() {
  localStorage.removeItem("user");

  window.location.href = "index.html";
}
