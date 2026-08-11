const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "login.html";
}

let addresses = user.addresses || [];

const container = document.getElementById("addressList");

// ======================
// SAVE USER
// ======================

function saveUser() {
  user.addresses = addresses;

  localStorage.setItem("user", JSON.stringify(user));

  let users = JSON.parse(localStorage.getItem("users")) || [];

  users = users.map((u) => {
    if (u.email === user.email) {
      return user;
    }

    return u;
  });

  localStorage.setItem("users", JSON.stringify(users));
}

// ======================
// RENDER
// ======================

function render() {
  if (addresses.length === 0) {
    container.innerHTML = `

<div
class="
bg-white
border border-gray-200
rounded-3xl
p-8
text-center">

Belum ada alamat

</div>

`;

    return;
  }

  container.innerHTML = "";

  addresses.forEach((item, index) => {
    container.innerHTML += `

<div
class="
bg-white
border
rounded-3xl
p-5">

<div
class="
flex
justify-between
mb-2">

<h2
class="font-semibold">

${item.label}

</h2>

<button
onclick="deleteAddress(${index})"
class="text-red-500">

Hapus

</button>

</div>

<p class="text-sm text-gray-500">

${item.city}

</p>

<p class="mt-2">

${item.address}

</p>

</div>

`;
  });
}

// ======================
// ADD
// ======================

function addAddress() {
  const label = document.getElementById("label").value.trim();

  const city = document.getElementById("city").value.trim();

  const address = document.getElementById("address").value.trim();

  if (!label || !city || !address) {
    alert("Lengkapi data alamat");

    return;
  }

  addresses.push({
    label,
    city,
    address,
  });

  saveUser();

  render();

  document.getElementById("label").value = "";

  document.getElementById("city").value = "";

  document.getElementById("address").value = "";
}

// ======================
// DELETE
// ======================

function deleteAddress(index) {
  addresses.splice(index, 1);

  saveUser();

  render();
}

// ======================
// INIT
// ======================

render();
