document.addEventListener("DOMContentLoaded", () => {
  const bucketListElement = document.getElementById("bucketList");

  chrome.storage.local.get("bucketList", (result) => {
    const bucketList = result.bucketList || [];

    bucketList.forEach((item, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = item.text;
      listItem.className = "flex justify-between items-center text-lg w-50vw"; // Bigger text

      const doneButton = document.createElement("button");
      doneButton.className = "text-green-600"; // Green for checkmark
      doneButton.innerHTML = "✔️";
      doneButton.addEventListener("click", () => {
        item.done = !item.done;
        chrome.storage.local.set({ bucketList });
        listItem.style.textDecoration = item.done ? "line-through" : "none";
        doneButton.innerHTML = "✔️";
      });

      const deleteButton = document.createElement("button");
      deleteButton.className = "text-red-600"; // Red for delete
      deleteButton.innerHTML = "❌"; // Delete icon
      deleteButton.addEventListener("click", () => {
        bucketList.splice(index, 1);
        chrome.storage.local.set({ bucketList });
        listItem.remove(); // Remove item from the UI
      });

      listItem.appendChild(doneButton);
      listItem.appendChild(deleteButton);

      bucketListElement.appendChild(listItem);
    });
  });
});
