document.addEventListener("DOMContentLoaded", () => {
  const bucketListElement = document.getElementById("bucketList");
  const bucketForm = document.getElementById("bucketForm");
  const bucketInput = document.getElementById("bucketInput");
  const deadlineInput = document.getElementById("deadlineInput");

  // Load existing bucket list from local storage
  chrome.storage.local.get("bucketList", (result) => {
    let bucketList = result.bucketList || [];

    // Function to re-render the bucket list
    function renderList() {
      bucketListElement.innerHTML = ""; // Clear existing items

      bucketList.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.className = "flex justify-between items-center text-lg";

        // Display item text with option to edit
        const itemText = document.createElement("span");
        itemText.textContent = item.text;
        itemText.style.textDecoration = item.done ? "line-through" : "none";

        itemText.contentEditable = true; // Enable editing
        itemText.addEventListener("blur", () => {
          item.text = itemText.textContent; // Update item text on blur
          chrome.storage.local.set({ bucketList }); // Store updated list
        });

        // Display deadline if it exists
        const deadlineText = document.createElement("span");
        deadlineText.className = "text-gray-600 text-sm";
        deadlineText.textContent = item.deadline ? `Due: ${item.deadline}` : "";

        // Button to mark as done/undone
        const doneButton = document.createElement("button");
        doneButton.className = "text-green-600";
        doneButton.innerHTML = item.done ? "✔️" : "⬜";
        doneButton.addEventListener("click", () => {
          item.done = !item.done;
          chrome.storage.local.set({ bucketList });
          renderList(); // Re-render to reflect changes
        });

        // Button to delete the item
        const deleteButton = document.createElement("button");
        deleteButton.className = "text-red-600";
        deleteButton.innerHTML = "❌";
        deleteButton.addEventListener("click", () => {
          bucketList.splice(index, 1);
          chrome.storage.local.set({ bucketList });
          renderList(); // Re-render after deletion
        });

        listItem.appendChild(itemText);
        listItem.appendChild(doneButton);
        listItem.appendChild(deleteButton);
        listItem.appendChild(deadlineText);

        bucketListElement.appendChild(listItem);
      });
    }

    renderList(); // Initial render

    // Handle form submission to add new items
    bucketForm.addEventListener("submit", (e) => {
      e.preventDefault(); // Prevent default form behavior

      const newItem = bucketInput.value.trim(); // Get the new item text
      const deadline = deadlineInput.value; // Get the deadline from the date picker

      if (newItem) {
        bucketList.push({
          text: newItem,
          done: false,
          deadline: deadline ? new Date(deadline).toLocaleString() : null, // Store the deadline if provided
        });

        chrome.storage.local.set({ bucketList }); // Store the updated list
        bucketInput.value = ""; // Clear the input field
        deadlineInput.value = ""; // Clear the deadline input
        renderList(); // Re-render the list
      }
    });
  });
});
