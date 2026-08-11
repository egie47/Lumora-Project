const container = document.getElementById("cartList");
const totalEl = document.getElementById("totalPrice");

// ======================
// USER
// ======================

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "login.html";
}

// ======================
// DATA
// ======================

let cart = JSON.parse(localStorage.getItem(`cart_${user.email}`)) || [];

let products = [];

let selectedItems = {};

// ======================
// FORMAT PRICE
// ======================

function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price * 16000);
}

// ======================
// LOAD CART
// ======================

async function loadCart() {
  try {
    const res = await fetch("https://fakestoreapi.com/products");

    products = await res.json();

    cart.forEach((item) => {
      selectedItems[item.id] = true;
    });

    renderCart();
  } catch (err) {
    console.error(err);
  }
}

// ======================
// RENDER CART
// ======================

function renderCart() {
  if (cart.length === 0) {
    container.innerHTML = `
    
     <div class="bg-white rounded-3xl p-10 text-center border border-gray-200">

  <div class="mb-4 flex justify-center">
    <div
      class="
      w-20
      h-20
      flex
      items-center
      justify-center"
    >
      <iconify-icon
        icon="solar:cart-large-2-bold"
        class="text-[40px] text-black"
      ></iconify-icon>
    </div>
  </div>

  <h2 class="text-xl font-semibold mb-2">
    Keranjang Kosong
  </h2>

  <p class="text-gray-500">
    Belum ada produk di keranjang
  </p>

</div>
    `;

    totalEl.innerText = "Rp0";

    return;
  }

  container.innerHTML = "";

  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.id);

    if (!product) return;

    const checked = selectedItems[item.id] ? "checked" : "";

    container.innerHTML += `
    
      <div
        class="
        bg-white
        rounded-3xl
        border border-gray-200
        p-5
        flex
        flex-col
        md:flex-row
        gap-5
        items-center">

        <input
          type="checkbox"
          ${checked}
          onchange="toggleItem(${item.id})"
          class="w-5 h-5 accent-black self-start">

        <img
          src="${product.image}"
          class="w-28 h-28 object-contain">

        <div class="flex-1 w-full">

          <p class="text-xs text-gray-400 capitalize mb-1">
            ${product.category}
          </p>

          <h2 class="font-medium leading-snug mb-2">
            ${product.title}
          </h2>

          <p class="font-semibold mb-4">
            ${formatPrice(product.price)}
          </p>

          <div class="flex items-center gap-3">

            <button
              onclick="decreaseQty(${item.id})"
              class="w-9 h-9 border border-gray-100 rounded-xl">

              −

            </button>

            <span class="font-medium">
              ${item.qty}
            </span>

            <button
              onclick="increaseQty(${item.id})"
              class="w-9 h-9 border  border-gray-100 rounded-xl">

              +

            </button>

          </div>

        </div>

        <div class="text-right">

          <p class="text-sm text-gray-400 mb-1">
            Subtotal
          </p>

          <h2 class="font-bold text-lg mb-4">
            ${formatPrice(product.price * item.qty)}
          </h2>

          <button
            onclick="removeItem(${item.id})"
            class="text-red-500 text-sm">

            Hapus

          </button>

        </div>

      </div>

    `;
  });

  calculateTotal();
}

// ======================
// CHECKBOX
// ======================

function toggleItem(id) {
  selectedItems[id] = !selectedItems[id];

  calculateTotal();
}

// ======================
// TOTAL
// ======================

function calculateTotal() {
  let total = 0;

  cart.forEach((item) => {
    if (selectedItems[item.id]) {
      const product = products.find((p) => p.id === item.id);

      if (!product) return;

      total += product.price * item.qty;
    }
  });

  totalEl.innerText = formatPrice(total);
}

// ======================
// QTY
// ======================

function increaseQty(id) {
  const item = cart.find((i) => i.id === id);

  if (!item) return;

  item.qty++;

  saveCart();
}

function decreaseQty(id) {
  const item = cart.find((i) => i.id === id);

  if (!item) return;

  if (item.qty > 1) {
    item.qty--;
  }

  saveCart();
}

// ======================
// REMOVE
// ======================

function removeItem(id) {
  cart = cart.filter((item) => item.id !== id);

  delete selectedItems[id];

  saveCart();
}

// ======================
// SAVE CART
// ======================

function saveCart() {
  localStorage.setItem(`cart_${user.email}`, JSON.stringify(cart));

  renderCart();
}

// ======================
// CHECKOUT
// ======================

function goCheckout() {
  const selectedCart = cart.filter((item) => selectedItems[item.id]);

  if (selectedCart.length === 0) {
    alert("Pilih minimal 1 produk");

    return;
  }

  localStorage.setItem(
    `checkoutItems_${user.email}`,
    JSON.stringify(selectedCart),
  );

  window.location.href = "checkout.html";
}

// ======================
// INIT
// ======================

loadCart();
