chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "addToBucketList",
    title: "Add to Bucket List",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "addToBucketList" && info.selectionText) {
    const newItem = info.selectionText.trim();

    // Add the item to the bucket list in local storage
    chrome.storage.local.get("bucketList", (result) => {
      let bucketList = result.bucketList || [];

      bucketList.push({ text: newItem, done: false });

      chrome.storage.local.set({ bucketList: bucketList });
    });
  }
});
