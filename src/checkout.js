const container = document.getElementById("checkoutList");
const grandTotalEl = document.getElementById("grandTotal");

let appliedVoucher = null;
let products = [];

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "login.html";
}

let checkoutItems =
  JSON.parse(localStorage.getItem(`checkoutItems_${user.email}`)) || [];

// ======================
// HAPUS DUPLIKAT
// ======================

checkoutItems = checkoutItems.filter(
  (item, index, self) => index === self.findIndex((i) => i.id === item.id),
);

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
// LOAD DATA
// ======================

async function loadCheckout() {
  try {
    const res = await fetch("https://fakestoreapi.com/products");

    products = await res.json();

    renderCheckout();
  } catch (err) {
    console.error(err);

    container.innerHTML = `
      <div class="bg-white border border-gray-200 rounded-3xl p-8 text-center">

        <h2 class="text-xl font-semibold mb-2">
          Gagal Memuat Produk
        </h2>

        <p class="text-gray-500">
          Silakan coba lagi nanti
        </p>

      </div>
    `;
  }
}

// ======================
// RENDER CHECKOUT
// ======================

function renderCheckout() {
  if (checkoutItems.length === 0) {
    container.innerHTML = `
      <div class="bg-white border border-gray-200 rounded-3xl p-8 text-center">

        <h2 class="text-xl font-semibold mb-2">
          Tidak Ada Produk
        </h2>

        <p class="text-gray-500">
          Pilih produk terlebih dahulu
        </p>

      </div>
    `;

    grandTotalEl.innerText = "Rp0";

    return;
  }

  container.innerHTML = "";

  let grandTotal = 0;

  checkoutItems.forEach((item) => {
    const product = products.find((p) => p.id == item.id);

    if (!product) return;

    const subtotal = product.price * item.qty;

    grandTotal += subtotal;

    container.innerHTML += `
      <div
        class="
        bg-white
        border
        border-gray-200
        rounded-3xl
        p-5
        flex
        gap-5
        items-center">

        <img
          src="${product.image}"
          class="w-24 h-24 object-contain"
        />

        <div class="flex-1">

          <h2 class="font-medium mb-2 line-clamp-2">
            ${product.title}
          </h2>

          <p class="text-sm text-gray-400">
            ${formatRupiah(product.price)}
          </p>

          <p class="mt-2">
            Qty :
            <b>${item.qty}</b>
          </p>

        </div>

        <div class="text-right">

          <p class="text-xs text-gray-400 mb-1">
            Subtotal
          </p>

          <h2 class="font-bold">
            ${formatRupiah(subtotal)}
          </h2>

        </div>

      </div>
    `;
  });

  let finalTotal = grandTotal;

  // ======================
  // DISKON PERCENT
  // ======================

  if (appliedVoucher && appliedVoucher.type === "percent") {
    finalTotal = finalTotal - (finalTotal * appliedVoucher.value) / 100;
  }

  // ======================
  // DISKON FIXED
  // ======================

  if (appliedVoucher && appliedVoucher.type === "fixed") {
    finalTotal = finalTotal - appliedVoucher.value / 16000;
  }

  // ======================
  // MINIMAL TOTAL
  // ======================

  if (finalTotal < 0) {
    finalTotal = 0;
  }

  grandTotalEl.innerText = formatRupiah(finalTotal);
}

// ======================
// APPLY VOUCHER
// ======================

function applyVoucher() {
  const code = document
    .getElementById("voucherInput")
    .value.trim()
    .toUpperCase();

  if (!code) {
    alert("Masukkan kode voucher");
    return;
  }

  const vouchers = user.vouchers || [];

  const found = vouchers.find((v) => v.code === code);

  if (!found) {
    alert("Voucher tidak ditemukan");
    return;
  }

  appliedVoucher = found;

  const info = document.getElementById("voucherInfo");

  info.classList.remove("hidden");

  if (found.type === "percent") {
    info.innerText = `Voucher ${found.code} aktif (${found.value}% OFF)`;
  } else if (found.type === "fixed") {
    info.innerText = `Voucher ${found.code} aktif`;
  } else {
    info.innerText = `Voucher Gratis Ongkir aktif`;
  }

  renderCheckout();
}

// ======================
// PAY NOW
// ======================

function payNow() {
  if (checkoutItems.length === 0) {
    alert("Tidak ada produk checkout");
    return;
  }

  const selectedPayment = document.querySelector(
    'input[name="payment"]:checked',
  );

  if (!selectedPayment) {
    alert("Pilih metode pembayaran");
    return;
  }

  const method = selectedPayment.value;

  // QRIS

  if (method === "QRIS") {
    const modal = document.getElementById("qrisModal");

    modal.classList.remove("hidden");
    modal.classList.add("flex");

    startCountdown();

    return;
  }

  // PAYMENT LAIN

  simulatePayment();
}

// ======================
// CLOSE QRIS
// ======================

function closeQris() {
  const modal = document.getElementById("qrisModal");

  modal.classList.add("hidden");
  modal.classList.remove("flex");

  clearInterval(window.qrisTimer);
}

// ======================
// COUNTDOWN
// ======================

function startCountdown() {
  clearInterval(window.qrisTimer);

  let time = 300;

  const countdownEl = document.getElementById("countdown");

  window.qrisTimer = setInterval(() => {
    const minutes = Math.floor(time / 60);

    const seconds = time % 60;

    countdownEl.innerText = `${String(minutes).padStart(2, "0")}:${String(
      seconds,
    ).padStart(2, "0")}`;

    time--;

    if (time < 0) {
      clearInterval(window.qrisTimer);

      closeQris();

      alert("QRIS expired");
    }
  }, 1000);
}

// ======================
// SIMULATE PAYMENT
// ======================

function simulatePayment() {
  closeQris();

  const loadingModal = document.getElementById("loadingModal");

  loadingModal.classList.remove("hidden");
  loadingModal.classList.add("flex");

  setTimeout(() => {
    finishPayment();
  }, 2500);
}

// ======================
// FINISH PAYMENT
// ======================

function finishPayment() {
  const loadingModal = document.getElementById("loadingModal");

  loadingModal.classList.add("hidden");
  loadingModal.classList.remove("flex");

  const selectedPayment = document.querySelector(
    'input[name="payment"]:checked',
  );

  const method = selectedPayment.value;

  let total = 0;

  const items = checkoutItems
    .map((item) => {
      const product = products.find((p) => p.id == item.id);

      if (!product) return null;

      total += product.price * item.qty;

      return {
        id: product.id,
        title: product.title,
        image: product.image,
        qty: item.qty,
        price: product.price,
      };
    })
    .filter(Boolean);

  // ======================
  // APPLY DISCOUNT
  // ======================

  let finalTotal = total;

  if (appliedVoucher?.type === "percent") {
    finalTotal = finalTotal - (finalTotal * appliedVoucher.value) / 100;
  }

  if (appliedVoucher?.type === "fixed") {
    finalTotal = finalTotal - appliedVoucher.value / 16000;
  }

  if (finalTotal < 0) {
    finalTotal = 0;
  }

  // ======================
  // TRANSACTION OBJECT
  // ======================

  const transaction = {
    invoice: "INV-" + Date.now(),

    date: new Date().toLocaleString("id-ID"),

    createdAt: Date.now(),

    payment: method,

    status: "Berhasil",

    shippingStatus: 1,

    total: finalTotal,

    voucher: appliedVoucher,

    items: items,
  };

  // ======================
  // SAVE TRANSACTION
  // ======================

  let transactions =
    JSON.parse(localStorage.getItem(`transactions_${user.email}`)) || [];

  transactions.unshift(transaction);

  localStorage.setItem(
    `transactions_${user.email}`,
    JSON.stringify(transactions),
  );

  // ======================
  // LAST RECEIPT
  // ======================

  localStorage.setItem(
    `lastTransaction_${user.email}`,
    JSON.stringify(transaction),
  );

  // ======================
  // REMOVE FROM CART
  // ======================

  let cart = JSON.parse(localStorage.getItem(`cart_${user.email}`)) || [];

  checkoutItems.forEach((item) => {
    cart = cart.filter((c) => c.id != item.id);
  });

  localStorage.setItem(`cart_${user.email}`, JSON.stringify(cart));

  // ======================
  // CLEAR CHECKOUT
  // ======================

  localStorage.removeItem(`checkoutItems_${user.email}`);

  // ======================
  // REDIRECT
  // ======================

  window.location.href = "receipt.html";
}

// ======================
// INIT
// ======================

loadCheckout();
