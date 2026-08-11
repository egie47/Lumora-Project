let user = JSON.parse(localStorage.getItem("user")) || {};

// ======================
// LOGIN CHECK
// ======================

if (!user.email) {
  window.location.href = "login.html";
}

// ======================
// POPUP
// ======================

function showPopup(icon, title, message, callback = null) {
  const overlay = document.getElementById("popupOverlay");

  const popupIcon = document.getElementById("popupIcon");

  popupIcon.setAttribute("icon", icon);

  popupIcon.className = "text-[52px]";

  // COLOR

  if (icon.includes("check")) {
    popupIcon.classList.add("text-green-500");
  } else if (icon.includes("warning")) {
    popupIcon.classList.add("text-yellow-500");
  } else {
    popupIcon.classList.add("text-red-500");
  }

  document.getElementById("popupTitle").innerText = title;

  document.getElementById("popupMessage").innerText = message;

  overlay.classList.remove("hidden");

  overlay.classList.add("flex");

  document.getElementById("popupButton").onclick = () => {
    overlay.classList.add("hidden");

    overlay.classList.remove("flex");

    if (callback) {
      callback();
    }
  };
}

// ======================
// ELEMENT
// ======================

const profilePreview = document.getElementById("profilePreview");

const nicknameInput = document.getElementById("nickname");

const fullnameInput = document.getElementById("fullname");

const emailInput = document.getElementById("email");

const phoneInput = document.getElementById("phone");

const addressInput = document.getElementById("address");

const cityInput = document.getElementById("city");

const provinceInput = document.getElementById("province");

const postalCodeInput = document.getElementById("postalCode");

// ======================
// LOAD DATA
// ======================

profilePreview.src = user.photo || "https://ui-avatars.com/api/?name=User";

nicknameInput.value = user.nickname || "";

fullnameInput.value = user.name || "";

emailInput.value = user.email || "";

phoneInput.value = user.phone || "";

addressInput.value = user.address || "";

cityInput.value = user.city || "";

provinceInput.value = user.province || "";

postalCodeInput.value = user.postalCode || "";

// ======================
// FOTO PROFIL
// ======================

document.getElementById("photoInput").addEventListener("change", function (e) {
  const file = e.target.files[0];

  if (!file) return;

  // VALIDASI IMAGE

  if (!file.type.startsWith("image/")) {
    return showPopup(
      "ph:warning-fill",
      "File Tidak Valid",
      "File harus berupa gambar",
    );
  }

  const img = new Image();

  const reader = new FileReader();

  reader.onload = function (event) {
    img.src = event.target.result;
  };

  img.onload = function () {
    const canvas = document.createElement("canvas");

    const ctx = canvas.getContext("2d");

    // MAX WIDTH

    const MAX_WIDTH = 300;

    let width = img.width;

    let height = img.height;

    // RESIZE

    if (width > MAX_WIDTH) {
      height = height * (MAX_WIDTH / width);

      width = MAX_WIDTH;
    }

    canvas.width = width;

    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);

    // KOMPRES IMAGE

    const compressed = canvas.toDataURL("image/jpeg", 0.5);

    // PREVIEW

    profilePreview.src = compressed;

    // SAVE TO USER

    user.photo = compressed;
  };

  reader.readAsDataURL(file);
});

// ======================
// SAVE PROFILE
// ======================

function saveProfile() {
  console.log("SAVE CLICKED");

  const nickname = nicknameInput.value.trim();

  const fullname = fullnameInput.value.trim();

  const phone = phoneInput.value.trim();

  const address = addressInput.value.trim();

  const city = cityInput.value.trim();

  const province = provinceInput.value.trim();

  const postalCode = postalCodeInput.value.trim();

  // ======================
  // VALIDATION
  // ======================

  if (!fullname) {
    return showPopup(
      "ph:warning-fill",
      "Nama Kosong",
      "Nama lengkap wajib diisi",
    );
  }

  // ======================
  // UPDATE USER
  // ======================

  user.nickname = nickname;

  user.name = fullname;

  user.phone = phone;

  user.address = address;

  user.city = city;

  user.province = province;

  user.postalCode = postalCode;

  // ======================
  // SAVE CURRENT USER
  // ======================

  try {
    localStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.error(error);

    return showPopup(
      "ph:warning-fill",
      "Storage Penuh",
      "Foto terlalu besar atau localStorage penuh",
    );
  }

  // ======================
  // SAFE USERS
  // ======================

  let users;

  try {
    users = JSON.parse(localStorage.getItem("users"));

    if (!Array.isArray(users)) {
      users = [];
    }
  } catch {
    users = [];
  }

  // ======================
  // FIND USER
  // ======================

  const index = users.findIndex((u) => u.email === user.email);

  // ======================
  // UPDATE / INSERT
  // ======================

  if (index !== -1) {
    users[index] = user;
  } else {
    users.push(user);
  }

  // ======================
  // SAVE USERS
  // ======================

  try {
    localStorage.setItem("users", JSON.stringify(users));
  } catch (error) {
    console.error(error);

    return showPopup(
      "ph:warning-fill",
      "Storage Penuh",
      "Data terlalu besar untuk disimpan",
    );
  }

  // ======================
  // SUCCESS
  // ======================

  showPopup(
    "ph:check-fill",
    "Profil Diperbarui",
    "Data akun berhasil disimpan",
    () => {
      window.location.href = "account.html";
    },
  );
}
