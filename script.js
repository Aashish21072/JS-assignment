const API_URL =
  "https://crudcrud.com/api/869dc760806e47108e7bd57a92464a1e/vegetables";

const form = document.getElementById("vegForm");
const list = document.getElementById("vegList");
const total = document.getElementById("total");

const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const quantityInput = document.getElementById("quantity");

// Load vegetables when page loads
document.addEventListener("DOMContentLoaded", () => {
  loadVegetables();
});

// Add Vegetable
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const vegetable = {
    name: nameInput.value,
    price: priceInput.value,
    quantity: quantityInput.value,
  };

  axios
    .post(API_URL, vegetable)
    .then(() => {
      loadVegetables();
      form.reset();
    })
    .catch((err) => console.log(err));
});

// Load all vegetables
function loadVegetables() {
  axios
    .get(API_URL)
    .then((res) => {
      list.innerHTML = "";

      res.data.forEach((veg) => {
        displayVegetable(veg);
      });

      updateTotal(res.data.length);
    })
    .catch((err) => console.log(err));
}

// Display vegetable
function displayVegetable(veg) {
  const li = document.createElement("li");

  li.innerHTML = `
    <strong>${veg.name}</strong>
    &nbsp; Rs.${veg.price}
    &nbsp; Qty: ${veg.quantity}

    <input
      class="buyInput"
      type="number"
      placeholder="Qty"
      min="1"
      style="width:70px;"
    />

    <button class="buyBtn">Buy</button>
    <button class="deleteBtn">Delete</button>
  `;

  list.appendChild(li);

  const buyBtn = li.querySelector(".buyBtn");
  const deleteBtn = li.querySelector(".deleteBtn");
  const buyInput = li.querySelector(".buyInput");

  // Delete Vegetable
  deleteBtn.addEventListener("click", () => {
    axios
      .delete(`${API_URL}/${veg._id}`)
      .then(() => {
        loadVegetables();
      })
      .catch((err) => console.log(err));
  });

  // Buy Vegetable
  buyBtn.addEventListener("click", () => {
    const buyQty = Number(buyInput.value);

    if (buyQty <= 0) {
      alert("Enter a valid quantity");
      return;
    }

    if (buyQty > Number(veg.quantity)) {
      alert("Not enough stock");
      return;
    }

    const updatedVegetable = {
      name: veg.name,
      price: veg.price,
      quantity: Number(veg.quantity) - buyQty,
    };

    axios
      .delete(`${API_URL}/${veg._id}`)
      .then(() => {
        return axios.post(API_URL, updatedVegetable);
      })
      .then(() => {
        loadVegetables();
      })
      .catch((err) => console.log(err));
  });
}

// Update total items
function updateTotal(count) {
  total.textContent = count;
}