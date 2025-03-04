// 컨텍스트 메뉴 생성
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "generateReply",
    title: "AI로 답장 생성하기",
    contexts: ["selection"]
  });
});

// 컨텍스트 메뉴 클릭 처리
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "generateReply") {
    chrome.storage.local.set({ selectedText: info.selectionText }, () => {
      chrome.windows.create({
        url: chrome.runtime.getURL("popup/popup.html"),
        type: "popup",
        width: 400,
        height: 600
      });
    });
  }
}); 