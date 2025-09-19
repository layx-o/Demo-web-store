const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
});

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

fetch("/products.json")
  .then((response) => response.json())
  .then((products) => {
    const product = products.find((p) => p.id === productId);
    const card = document.querySelector(".product-card");
    if (!product) {
      card.innerHTML = "<p>Product not found.</p>";
      return;
    }

    card.innerHTML = `
            <div class = "product-tile ${product.class || ""}">
              <div class="prod-img">
                <img src= "${product.image}" alt = "${product.name}">
              </div>
              <div class="prod-dets">
                <h1>${product.name}</h1>
                <h2>${product.description}</h2>
                <p class="price">${currencyFormatter.format(product.price)}</p>
                <button class="add-to-cart" data-id="${
                  product.id
                }">Add to Cart</button>
              </div>
            </div>
        `;

    const addToCartButton = document.querySelector(".add-to-cart");
    addToCartButton.addEventListener("click", () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingProduct = cart.find((item) => item.id === product.id);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartBadge();
    });
  });
