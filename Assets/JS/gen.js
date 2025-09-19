fetch("/navbar.html")
  .then((response) => response.text())
  .then((data) => {
    document.querySelector(".navbar").innerHTML = data;
    updateCartBadge();
  });

fetch("/footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.querySelector(".flayout").innerHTML = data;
  });

function updateCartBadge() {
  const badge = document.querySelector(".cart-badge");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  if (badge) badge.textContent = total;
}
