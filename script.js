// Elements
const productListEl = document.getElementById('productList');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const profileSelect = document.getElementById('profileSelect');
const profileImage = document.getElementById('profileImage');
const searchInput = document.getElementById('searchInput');
const checkoutBtn = document.getElementById('checkoutBtn');
const clearCartBtn = document.getElementById('clearCartBtn');

// File input for profile image
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'image/*';
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

// Sample product data
let products = [
  { name: "Iphone", sku: "IP34", price: 23.00 },
  { name: "Samsung", sku: "SM45", price: 30.00 },
  { name: "Tecno", sku: "TC12", price: 18.50 },
  { name: "Infinix", sku: "IF22", price: 25.00 },
  { name: "Itel", sku: "IT11", price: 15.00 },
  { name: "Nokia", sku: "NK09", price: 27.00 }
];

// Load saved data
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let savedProfile = localStorage.getItem('userProfile');
let savedImage = localStorage.getItem('userImage');
if (savedProfile) profileSelect.value = savedProfile;
if (savedImage) profileImage.src = savedImage;

// Render products
function renderProducts(filter = "") {
  productListEl.innerHTML = "";
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.sku.toLowerCase().includes(filter.toLowerCase())
  );

  if (filtered.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="4" class="empty-row">No product found</td>`;
    productListEl.appendChild(tr);
    return;
  }

  filtered.forEach((p, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.name}</td>
      <td>${p.sku}</td>
      <td>${p.price.toFixed(2)}</td>
      <td><button class="btn" onclick="addToCart(${i})">Add</button></td>
    `;
    productListEl.appendChild(tr);
  });
}

// Add to cart
function addToCart(index) {
  const product = products[index];
  const found = cart.find(i => i.name === product.name);
  if (found) {
    found.subtotal += product.price;
  } else {
    cart.push({ name: product.name, subtotal: product.price });
  }
  updateCart();
}

// Delete single cart item
function deleteCartItem(name) {
  cart = cart.filter(item => item.name !== name);
  updateCart();
}

// Render cart
function renderCart() {
  cartItemsEl.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.subtotal;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>
        ${item.subtotal.toFixed(2)}
        <button class="delete-btn" onclick="deleteCartItem('${item.name}')">✖</button>
      </td>
    `;
    cartItemsEl.appendChild(tr);
  });

  cartTotalEl.textContent = total.toFixed(2);
}

// Update and persist cart
function updateCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// Clear cart
function clearCart() {
  if (cart.length === 0) return alert("Cart is already empty.");
  if (confirm("Remove all items from cart?")) {
    cart = [];
    updateCart();
  }
}

// Checkout
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) return alert("No items in cart.");
  alert("Checkout successful.");
  cart = [];
  updateCart();
});

// Clear cart button
clearCartBtn.addEventListener("click", clearCart);

// Search bar
searchInput.addEventListener("input", e => {
  renderProducts(e.target.value);
});

// Profile persistence
profileSelect.addEventListener("change", () => {
  localStorage.setItem("userProfile", profileSelect.value);
});

// Profile image upload
profileImage.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", event => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    profileImage.src = e.target.result;
    localStorage.setItem("userImage", e.target.result);
  };
  reader.readAsDataURL(file);
});

// Init
renderProducts();
renderCart();
