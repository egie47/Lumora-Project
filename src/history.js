const container = document.getElementById("historyList");

// ======================
// LOGIN CHECK
// ======================

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "login.html";
}

// ======================
// TRANSACTIONS
// ======================

const transactions =
  JSON.parse(localStorage.getItem(`transactions_${user.email}`)) || [];

// ======================
// FORMAT
// ======================

function formatRupiah(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price * 16000);
}

// ======================
// VIEW RECEIPT
// ======================

function viewReceipt(invoice) {
  const trx = transactions.find((item) => item.invoice === invoice);

  if (!trx) return;

  localStorage.setItem(`lastTransaction_${user.email}`, JSON.stringify(trx));

  window.location.href = "receipt.html";
}

// ======================
// RENDER
// ======================

function render() {
  container.innerHTML = "";

  if (transactions.length === 0) {
    container.innerHTML = `

      <div
        class="
        bg-white
        p-10
        rounded-3xl
        border
        text-center">

        <div class="text-5xl mb-4">
          📦
        </div>

        <h2
          class="
          text-xl
          font-semibold
          mb-2">

          Belum Ada Transaksi

        </h2>

        <p class="text-gray-500">

          Pesananmu akan muncul di sini

        </p>

      </div>

    `;

    return;
  }

  transactions.forEach((trx) => {
    container.innerHTML += `

      <div
        class="
        bg-white
        rounded-3xl
        border border-gray-200
        p-6
        mb-4">

        <div
          class="
          flex
          justify-between
          items-start
          mb-5">

          <div>

            <h2 class="font-bold">

              ${trx.invoice}

            </h2>

            <p
              class="
              text-sm
              text-gray-500">

              ${trx.date}

            </p>

          </div>

          <span
            class="
            bg-green-100
            text-green-700
            px-4
            py-2
            rounded-full
            text-sm">

            ${trx.status || "Berhasil"}

          </span>

        </div>

        <div
          class="
          flex
          justify-between
          items-center">

          <div>

            <p class="text-gray-500">

              ${trx.payment}

            </p>

          </div>

          <div
            class="
            text-right">

            <p
              class="
              font-bold
              text-lg">

              ${formatRupiah(trx.total)}

            </p>

          </div>

        </div>

        <button
          onclick="viewReceipt('${trx.invoice}')"
          class="
          mt-4
          w-full
          border border-gray-200
          py-3
          rounded-xl
          hover:bg-gray-50">

          Lihat Invoice

        </button>

      </div>

    `;
  });
}

// ======================
// INIT
// ======================

render();
