const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
});

fetch("/products.json")
  .then((response) => response.json())
  .then((products) => {
    const gallery = document.querySelector(".product-gallery");
    gallery.innerHTML = "";

    products.forEach((product) => {
      const productTile = document.createElement("div");
      productTile.classList.add("product-tile");

      if (product.class) {
        productTile.classList.add(product.class);
      }

      let hoverImage = "";
      if (product.class === "h-jersey") {
        hoverImage = "/Assets/Images/modl 4i.webp";
      } else if (product.class === "friends") {
        hoverImage = "/Assets/Images/modl 2.jpeg";
      } else if (product.class === "jorts") {
        hoverImage = "/Assets/Images/skies2i.webp";
      }

      productTile.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p class="price">${currencyFormatter.format(product.price)}</p>
            <button class="btn-add-to-cart" data-id="${
              product.id
            }" >Add to Cart</button>
            `;

      if (hoverImage) {
        const img = productTile.querySelector("img");
        productTile.addEventListener("mouseenter", () => {
          img.src = hoverImage;
        });
        productTile.addEventListener("mouseleave", () => {
          img.src = product.image;
        });
      }

      productTile.addEventListener("click", () => {
        window.location.href = `/product.html?id=${product.id}`;
      });

      const btn = productTile.querySelector(".btn-add-to-cart");
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingProduct = cart.find((item) => item.id === product.id);

        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartBadge();
        // alert(`${product.name} has been added to your cart.`);
      });

      gallery.appendChild(productTile);
    });
  });
