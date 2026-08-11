// ======================
// POPUP
// ======================

function showPopup(icon, title, message, callback = null) {
  const overlay = document.getElementById("popupOverlay");

  if (!overlay) return;

  const popupIcon = document.getElementById("popupIcon");

  // RESET CLASS

  popupIcon.className = "text-[52px]";

  // ======================
  // ICON + COLOR
  // ======================

  if (icon === "success") {
    popupIcon.setAttribute("icon", "ph:check-fill");

    popupIcon.classList.add("text-green-500");
  } else if (icon === "warning") {
    popupIcon.setAttribute("icon", "ph:warning-fill");

    popupIcon.classList.add("text-yellow-500");
  } else {
    popupIcon.setAttribute("icon", "ph:x-circle-fill");

    popupIcon.classList.add("text-red-500");
  }

  // ======================
  // TEXT
  // ======================

  document.getElementById("popupTitle").innerText = title;

  document.getElementById("popupMessage").innerText = message;

  // ======================
  // SHOW POPUP
  // ======================

  overlay.classList.remove("hidden");

  overlay.classList.add("flex");

  // ======================
  // BUTTON
  // ======================

  document.getElementById("popupButton").onclick = () => {
    overlay.classList.add("hidden");

    overlay.classList.remove("flex");

    if (callback) {
      callback();
    }
  };
}

// ======================
// DATABASE USER
// ======================

let users = JSON.parse(localStorage.getItem("users")) || [];

// ======================
// LOGIN
// ======================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value.trim();

    // VALIDASI

    if (!email || !password) {
      showPopup("warning", "Login Gagal", "Lengkapi email dan password");

      return;
    }

    // CARI USER

    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    // USER TIDAK ADA

    if (!user) {
      showPopup("error", "Login Gagal", "Email atau password salah");

      return;
    }

    // SAVE LOGIN

    localStorage.setItem("user", JSON.stringify(user));

    // SUCCESS

    showPopup("success", "Login Berhasil", "Selamat datang kembali", () => {
      window.location.href = "homepage.html";
    });
  });
}

// ======================
// REGISTER
// ======================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value.trim();

    const confirmPassword = document
      .getElementById("confirmPassword")
      .value.trim();

    // ======================
    // VALIDASI NAMA
    // ======================

    if (name.length < 3) {
      showPopup("warning", "Registrasi Gagal", "Nama minimal 3 karakter");

      return;
    }

    // ======================
    // VALIDASI EMAIL
    // ======================

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      showPopup("warning", "Registrasi Gagal", "Format email tidak valid");

      return;
    }

    // ======================
    // VALIDASI PASSWORD
    // ======================

    if (password.length < 8) {
      showPopup("warning", "Registrasi Gagal", "Password minimal 8 karakter");

      return;
    }

    // PASSWORD TIDAK SAMA

    if (password !== confirmPassword) {
      showPopup(
        "warning",
        "Registrasi Gagal",
        "Konfirmasi password tidak sama",
      );

      return;
    }

    // ======================
    // EMAIL SUDAH ADA
    // ======================

    const exist = users.find((u) => u.email === email);

    if (exist) {
      showPopup("error", "Registrasi Gagal", "Email sudah digunakan");

      return;
    }

    // ======================
    // USER BARU
    // ======================

    const user = {
      // LOGIN

      name: name,

      email: email,

      password: password,

      // PROFILE

      nickname: name,

      photo: "",

      // BIODATA

      birthDate: "",

      phone: "",

      // ALAMAT

      address: "",

      city: "",

      province: "",

      postalCode: "",

      // MULTI ADDRESS

      addresses: [],

      // VOUCHER

      vouchers: [
        {
          code: "HEMAT10",

          type: "percent",

          value: 10,
        },

        {
          code: "TOKOKO50",

          type: "fixed",

          value: 50000,
        },

        {
          code: "GRATISONGKIR",

          type: "shipping",

          value: 0,
        },
      ],
    };

    // PUSH USER

    users.push(user);

    // SAVE

    localStorage.setItem("users", JSON.stringify(users));

    // SUCCESS

    showPopup(
      "success",
      "Registrasi Berhasil",
      "Silakan login menggunakan akun baru",
      () => {
        window.location.href = "login.html";
      },
    );
  });
}
