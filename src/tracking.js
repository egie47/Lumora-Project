const container = document.getElementById("trackingContainer");

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
// FORMAT DATE
// ======================

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString("id-ID");
}

// ======================
// SHIPPING STATUS
// ======================

function getShippingStatus(transaction) {
  if (!transaction.createdAt) return 1;

  const elapsed = (Date.now() - transaction.createdAt) / 1000;

  if (elapsed >= 90) return 4;

  if (elapsed >= 60) return 3;

  if (elapsed >= 30) return 2;

  return 1;
}

// ======================
// RENDER
// ======================

function renderTracking() {
  container.innerHTML = "";

  if (transactions.length === 0) {
    container.innerHTML = `

      <div
      class="
      bg-white
      rounded-3xl
      border border-gray-200
      p-10
      text-center">

        <div class="text-6xl mb-4">
          📦
        </div>

        <h2
        class="
        text-xl
        font-semibold
        mb-2">

          Belum Ada Pesanan

        </h2>

        <p class="text-gray-500">

          Pesanan akan muncul di sini

        </p>

      </div>

    `;

    return;
  }

  const latest = transactions[0];

  const status = getShippingStatus(latest);

  const timeline = [
    {
      icon: "💳",
      title: "Pesanan Dibayar",
    },
    {
      icon: "📦",
      title: "Pesanan Dikemas",
    },
    {
      icon: "🚚",
      title: "Dalam Pengiriman",
    },
    {
      icon: "🏠",
      title: "Sampai Tujuan",
    },
  ];

  container.innerHTML = `

    <div
    class="
    bg-white
    rounded-3xl
    border border-gray-200
    p-6
    mb-6">

      <h2
      class="
      font-bold
      text-xl
      mb-2">

        ${latest.invoice}

      </h2>

      <p class="text-gray-500">

        ${latest.date}

      </p>

      <div class="mt-4">

        <span
        class="
        bg-green-100
        text-green-700
        px-4
        py-2
        rounded-full
        text-sm">

          Pembayaran Berhasil

        </span>

      </div>

    </div>

    <div
    class="
    bg-white
    rounded-3xl
    border border-gray-200
    p-6">

      <h2
      class="
      font-semibold
      text-lg
      mb-8">

        Status Pengiriman

      </h2>

      <div class="space-y-8">

        ${timeline
          .map((item, index) => {
            const active = index + 1 <= status;

            return `

                <div class="flex gap-4">

                  <div
                  class="
                  w-12
                  h-12
                  rounded-full
                  flex
                  items-center
                  justify-center
                  ${active ? "bg-green-100" : "bg-gray-100"}">

                    ${item.icon}

                  </div>

                  <div>

                    <h3
                    class="
                    font-semibold
                    ${active ? "text-green-600" : "text-gray-400"}">

                      ${item.title}

                    </h3>

                    <p
                    class="
                    text-sm
                    text-gray-500">

                      ${active ? "Selesai" : "Menunggu"}

                    </p>

                  </div>

                </div>

              `;
          })
          .join("")}

      </div>

    </div>

  `;
}

// ======================
// INIT
// ======================

renderTracking();

// update tiap 5 detik
setInterval(() => {
  renderTracking();
}, 5000);
