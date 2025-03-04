// 선택된 텍스트 처리
document.addEventListener('mouseup', () => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    chrome.storage.local.set({ selectedText });
  }
}); 