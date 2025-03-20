function signin() {
  const isCleaner = false;
  if (isCleaner) {
    window.location.href = "/pages/home/cleanerhome.html";
  } else {
    window.location.href = "/pages/home/clienthome.html";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("signinButton")
    .addEventListener("click", function (event) {
      event.preventDefault();
      signin();
    });
});
