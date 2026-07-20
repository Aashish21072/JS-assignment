const API_URL = "https://6a5df26a0ad09982aef7d08d.mockapi.io/vegetable";

const form = document.getElementById("vegForm");
const list = document.getElementById("vegList");
const total = document.getElementById("total");

const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const quantityInput = document.getElementById("quantity");

// Load vegetables on page load
document.addEventListener("DOMContentLoaded", loadVegetables);

// ---------------- ADD VEGETABLE ----------------

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const price = Number(priceInput.value);
  const quantity = Number(quantityInput.value);

  if (name === "" || price <= 0 || quantity <= 0) {
    alert("Please enter valid details.");
    return;
  }

  const vegetable = {
    name,
    price,
    quantity,
  };

  axios
    .post(API_URL, vegetable)
    .then(() => {
      form.reset();
      loadVegetables();
    })
    .catch((err) => console.log(err));
});

// ---------------- LOAD VEGETABLES ----------------

function loadVegetables() {
  axios
    .get(API_URL)
    .then((res) => {
      list.innerHTML = "";

      // Latest added vegetable at top
      res.data.reverse().forEach((veg) => {
        displayVegetable(veg);
      });

      updateTotal(res.data.length);
    })
    .catch((err) => console.log(err));
}

// ---------------- DISPLAY VEGETABLE ----------------

function displayVegetable(veg) {
  const li = document.createElement("li");

  li.innerHTML = `
        <strong>${veg.name}</strong>
        &nbsp; ₹${veg.price}
        &nbsp; Qty: ${veg.quantity} Kg

        <input
            type="number"
            class="buyInput"
            placeholder="Qty"
            min="1"
        />

        <button class="buyBtn">Buy</button>
        <button class="deleteBtn">Delete</button>
    `;

  list.appendChild(li);

  const buyBtn = li.querySelector(".buyBtn");
  const deleteBtn = li.querySelector(".deleteBtn");
  const buyInput = li.querySelector(".buyInput");

  // DELETE

  deleteBtn.addEventListener("click", function () {
    axios
      .delete(`${API_URL}/${veg.id}`)
      .then(() => {
        loadVegetables();
      })
      .catch((err) => console.log(err));
  });

  // BUY

  buyBtn.addEventListener("click", function () {
    const buyQty = Number(buyInput.value);

    if (buyQty <= 0) {
      alert("Enter valid quantity");
      return;
    }

    if (buyQty > Number(veg.quantity)) {
      alert("Not enough stock");
      return;
    }

    const updatedVegetable = {
      name: veg.name,
      price: Number(veg.price),
      quantity: Number(veg.quantity) - buyQty,
    };

    axios
      .put(`${API_URL}/${veg.id}`, updatedVegetable)
      .then(() => {
        buyInput.value = "";
        loadVegetables();
      })
      .catch((err) => console.log(err));
  });
}

// ---------------- TOTAL ----------------

function updateTotal(count) {
  total.textContent = count;
}