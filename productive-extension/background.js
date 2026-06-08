// Danh sách đen các trang web gây phân tâm (Mày có thể thêm bớt tùy ý)
const BLACKLIST = ["facebook.com", "youtube.com", "tiktok.com", "reddit.com", "x.com", "instagram.com"];

// 1. LẮNG NGHE SỰ KIỆN CHUYỂN TAB
chrome.tabs.onActivated.addListener((activeInfo) => {
  // Lấy thông tin chi tiết (URL) của tab mà user vừa chuyển sang
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (!tab || !tab.url) return;

    // Đọc trạng thái Focus từ bộ nhớ ngầm của Chrome
    chrome.storage.local.get(["isFocusing"], (res) => {
      // Nếu chế độ Focus đang BẬT, mới bắt đầu quét danh sách đen
      if (res.isFocusing) {
        const isTrashTab = BLACKLIST.some(domain => tab.url.includes(domain));
        
        if (isTrashTab) {
          console.log(`[Productive OS] Blacklisted site detected: ${tab.url}`);
          
          // Bắn một tín hiệu (message) xuống tab đó để kích hoạt alert
          chrome.tabs.sendMessage(activeInfo.tabId, { action: "TRIGGER_ALERT" }, () => {
            // Nuốt lỗi nếu tab mới mở chưa kịp load xong content script
            if (chrome.runtime.lastError) {} 
          });
        }
      }
    });
  });
});

// 2. LẮNG NGHE LỆNH TRUYỀN TỪ WEB SAAS SANG (CẦU NỐI ĐỒNG BỘ)
chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  if (request.action === "START_FOCUS") {
    chrome.storage.local.set({ isFocusing: true });
    sendResponse({ success: true, status: "Focus Mode Engaged ⚔️" });
  }
  if (request.action === "STOP_FOCUS") {
    chrome.storage.local.set({ isFocusing: false });
    sendResponse({ success: true, status: "Focus Mode Disarmed 🛋️" });
  }
});