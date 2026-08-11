const container = document.getElementById("receipt");

// ======================
// LOGIN CHECK
// ======================

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "login.html";
}

// ======================
// GET TRANSACTION
// ======================

const trx = JSON.parse(localStorage.getItem(`lastTransaction_${user.email}`));

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
// DOWNLOAD RECEIPT
// ======================

function downloadReceipt() {
  window.print();
}

// ======================
// RENDER RECEIPT
// ======================

function renderReceipt() {
  if (!trx) {
    container.innerHTML = `
    
      <div class="text-center py-20">

        <h2 class="text-2xl font-bold mb-2">
          Tidak Ada Invoice
        </h2>

        <p class="text-gray-500">
          Belum ada transaksi
        </p>

      </div>

    `;

    return;
  }

  container.innerHTML = `
  
  <!-- SUCCESS -->

  <div class="text-center border-b border-gray-200 pb-8 mb-8">

    <div
      class="
      w-24
      h-24
      mx-auto
      bg-green-100
      rounded-3xl
      flex
      items-center
      justify-center
      mb-5"
    >

      <iconify-icon
        icon="ph:check-fill"
        class="text-[52px] text-green-500"
      ></iconify-icon>

    </div>

    <h1 class="text-3xl font-bold mb-2">
      Pembayaran Berhasil
    </h1>

    <p class="text-gray-500">
      Terima kasih telah berbelanja di Lumora
    </p>

  </div>

  <!-- INFO -->

  <div class="grid md:grid-cols-3 gap-4 mb-8">

    <div class="border border-gray-200 rounded-2xl p-4">

      <p class="text-gray-400 text-sm mb-1">
        Invoice
      </p>

      <p class="font-semibold break-all">
        ${trx.invoice}
      </p>

    </div>

    <div class="border border-gray-200 rounded-2xl p-4">

      <p class="text-gray-400 text-sm mb-1">
        Tanggal
      </p>

      <p class="font-semibold">
        ${trx.date}
      </p>

    </div>

    <div class="border border-gray-200 rounded-2xl p-4">

      <p class="text-gray-400 text-sm mb-1">
        Metode
      </p>

      <p class="font-semibold">
        ${trx.payment}
      </p>

    </div>

  </div>

  <!-- PRODUCT TABLE -->

  <div
    class="
    border
    border-gray-200
    rounded-3xl
    overflow-hidden
    mb-8"
  >

    <div
      class="
      bg-gray-50
      grid
      grid-cols-12
      p-4
      font-semibold"
    >

      <div class="col-span-6">
        Produk
      </div>

      <div class="col-span-2 text-center">
        Qty
      </div>

      <div class="col-span-4 text-right">
        Subtotal
      </div>

    </div>

    ${trx.items
      .map(
        (item) => `
      
      <div
        class="
        grid
        grid-cols-12
        items-center
        p-4
        border-t
        border-gray-200"
      >

        <div
          class="
          col-span-6
          flex
          items-center
          gap-3"
        >

          <img
            src="${item.image}"
            class="
            w-14
            h-14
            object-contain"
          >

          <div>

            <h3 class="text-sm font-medium line-clamp-2">
              ${item.title}
            </h3>

            <p class="text-xs text-gray-400">
              ${formatRupiah(item.price)}
            </p>

          </div>

        </div>

        <div class="col-span-2 text-center">
          ${item.qty}
        </div>

        <div
          class="
          col-span-4
          text-right
          font-semibold"
        >
          ${formatRupiah(item.price * item.qty)}
        </div>

      </div>

    `,
      )
      .join("")}

  </div>

  <!-- TOTAL -->

  <div
    class="
    bg-green-50
    border
    border-green-200
    rounded-3xl
    p-6
    mb-8"
  >

    <div
      class="
      flex
      justify-between
      items-center
      mb-4"
    >

      <span class="text-gray-500">
        Status
      </span>

      <span
        class="
        bg-green-100
        text-green-700
        px-4
        py-1
        rounded-full
        text-sm"
      >
        ${trx.status}
      </span>

    </div>

    <div
      class="
      flex
      justify-between
      items-center"
    >

      <span
        class="
        text-lg
        font-medium"
      >
        Total Pembayaran
      </span>

      <span
        class="
        text-2xl
        md:text-4xl
        font-bold"
      >
        ${formatRupiah(trx.total)}
      </span>

    </div>

  </div>

  <!-- ACTION -->

  <div class="flex flex-col md:flex-row gap-4">

    

    

    <button
      onclick="downloadReceipt()"
      class="
      flex-1
      h-14
      rounded-2xl
      border
      border-gray-200
      hover:bg-gray-50
      transition"
    >

      Download Receipt

    </button>

  </div>
  `;
}

// ======================
// NAVIGATION
// ======================

function goHistory() {
  window.location.href = "history.html";
}

function goHome() {
  window.location.href = "homepage.html";
}

// ======================
// GLOBAL FUNCTION
// ======================

window.goHistory = goHistory;
window.goHome = goHome;
window.downloadReceipt = downloadReceipt;

// ======================
// INIT
// ======================

renderReceipt();
