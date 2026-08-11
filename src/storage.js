function getCurrentUser() {
  return JSON.parse(localStorage.getItem("user"));
}

function getStorageKey(name) {
  const user = getCurrentUser();

  if (!user) return name;

  return `${name}_${user.email}`;
}

function getData(name, defaultValue = []) {
  return JSON.parse(localStorage.getItem(getStorageKey(name))) || defaultValue;
}

function setData(name, value) {
  localStorage.setItem(getStorageKey(name), JSON.stringify(value));
}
