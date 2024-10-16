import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://realtime-database-26dbe-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

// Function to handle adding items to Firebase
let addToShoppingListDb = () => {
  let inputValue = inputFieldEl.value.trim(); // Trims white spaces
  if (inputValue !== "") {
    // Only push to the database if the input is not empty
    push(shoppingListInDB, inputValue);
    clearInputFieldEl();
  }
};

// Function to update the shopping list from database
onValue(shoppingListInDB, (snapshot) => {
  if (snapshot.exists()) {
    let listArray = Object.entries(snapshot.val());
    clearShoppingListEl();

    for (let i = 0; i < listArray.length; i++) {
      let currentItem = listArray[i];
      let currentItemId = currentItem[0];
      let currentItemVal = currentItem[1];

      addToShoppingListEl(currentItem);
    }
  } else {
    shoppingListEl.innerHTML = "No items here yet...";
  }
});

// Function to clear shopping list on page
let clearShoppingListEl = () => {
  shoppingListEl.innerHTML = "";
};

// Function to clear input field
let clearInputFieldEl = () => {
  inputFieldEl.value = "";
};

// Function to add an item to the shopping list
let addToShoppingListEl = (item) => {
  let itemId = item[0];
  let itemVal = item[1];
  let newEl = document.createElement("li");
  newEl.textContent = itemVal;

  // Add click event for item deletion confirmation
  newEl.addEventListener("click", () => {
    let userConfirmed = confirm("Do you want to delete this item?");

    // Delete the item from database
    if (userConfirmed) {
      let exactLocationOfItemInDb = ref(database, `shoppingList/${itemId}`);
      remove(exactLocationOfItemInDb);
    }
  });

  shoppingListEl.append(newEl);
};

// Listen for the 'Add to cart' button click
addButtonEl.addEventListener("click", addToShoppingListDb);

// Listen for the 'Enter' key press in the input field
inputFieldEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addToShoppingListDb(); // Call the add function when 'Enter' is pressed
  }
});
