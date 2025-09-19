const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
});

document.addEventListener("DOMContentLoaded", function () {
  const cartContainer = document.querySelector(".cart-container");

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart">
        <p class="empty-txt">Your cart is empty!</p> 
        <p class="txt-2">It seems you have not selected any items from the shop.</p>
        <button class="shop-btn">Continue shopping</button>
      </div>
    `;

    const shopBtn = cartContainer.querySelector(".shop-btn");
    shopBtn.addEventListener("click", () => {
      window.location.href = "/Shop.html";
    });
  } else {
    cart.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");

      cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <h2>${item.name}</h2>
      <h3>Qty: ${item.quantity || 1}</h3>
      <p class="price">${currencyFormatter.format(
        item.price * item.quantity
      )}</p>
      <button class="remove-btn" data-id="${item.id}">Remove</button>
    `;
      cartContainer.appendChild(cartItem);

      const removeBtn = cartItem.querySelector(".remove-btn");
      removeBtn.addEventListener("click", function () {
        const newCart = cart.filter((i) => i.id !== item.id);
        localStorage.setItem("cart", JSON.stringify(newCart));
        updateCartBadge();
        location.reload();
      });
    });

    const total = cart.reduce((sum, item) => {
      return sum + item.price * (item.quantity || 1);
    }, 0);

    const totalPrice = document.createElement("div");
    totalPrice.classList.add("total-price");

    totalPrice.innerHTML = `
    <p>Total: ${currencyFormatter.format(total)}</p>
    `;

    cartContainer.appendChild(totalPrice);

    const emailLabel = document.createElement("label");
    emailLabel.textContent = "Enter your email:";
    emailLabel.setAttribute("for", "customer-email");
    emailLabel.style.display = "block";
    emailLabel.style.marginTop = "1em";

    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.id = "customer-email";
    emailInput.required = true;
    emailInput.placeholder = "you@email.com";
    emailInput.style.marginBottom = "1em";
    emailInput.style.display = "block";

    cartContainer.appendChild(emailLabel);
    cartContainer.appendChild(emailInput);

    const checkoutBtn = document.createElement("button");
    checkoutBtn.classList.add("checkout-btn");
    checkoutBtn.textContent = "Checkout";

    cartContainer.appendChild(checkoutBtn);

    checkoutBtn.addEventListener("click", function () {
      const email = emailInput.value.trim();
      if (!email) {
        alert("Please enter your email.");
        emailInput.focus();
        return;
      }

      const paystackInstance = new PaystackPop();
      paystackInstance.newTransaction({
        key: "pk_test_0c63e46502a68cf1c5b97cac399457e65af5247b",
        email: email,
        amount: total * 100,
        reference: "" + Date.now(),
        onSuccess: function (transaction) {
          alert("Payment successful! Reference: " + transaction.reference);
          localStorage.removeItem("cart");
          updateCartBadge();
          window.location.href = "/thank-you.html";
        },
        onClose: function () {
          alert("Payment window closed.");
        },
      });
    });
  }
});
