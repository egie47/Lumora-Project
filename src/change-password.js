let user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "login.html";
}

// ======================
// POPUP
// ======================

function showPopup(icon, title, message, callback = null) {
  const overlay = document.getElementById("popupOverlay");

  document.getElementById("popupIcon").innerHTML = icon;
  document.getElementById("popupTitle").innerText = title;
  document.getElementById("popupMessage").innerText = message;

  overlay.classList.remove("hidden");
  overlay.classList.add("flex");

  document.getElementById("popupButton").onclick = () => {
    overlay.classList.add("hidden");

    if (callback) callback();
  };
}

// ======================
// CHANGE PASSWORD
// ======================

function changePassword() {
  const oldPassword = document.getElementById("oldPassword").value;

  const newPassword = document.getElementById("newPassword").value;

  const confirmPassword = document.getElementById("confirmPassword").value;

  if (oldPassword !== user.password) {
    return showPopup("❌", "Gagal", "Password lama salah");
  }

  if (newPassword.length < 8) {
    return showPopup("⚠️", "Gagal", "Password minimal 8 karakter");
  }

  if (newPassword !== confirmPassword) {
    return showPopup("⚠️", "Gagal", "Konfirmasi password tidak sama");
  }

  user.password = newPassword;

  localStorage.setItem("user", JSON.stringify(user));

  let users = JSON.parse(localStorage.getItem("users")) || [];

  users = users.map((u) => {
    if (u.email === user.email) {
      u.password = newPassword;
    }

    return u;
  });

  localStorage.setItem("users", JSON.stringify(users));

  showPopup("✅", "Berhasil", "Password berhasil diperbarui", () => {
    window.location.href = "account.html";
  });
}
