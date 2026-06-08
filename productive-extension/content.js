// Lắng nghe lệnh từ bộ não Background Script bắn qua
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "TRIGGER_ALERT") {
    
    // 1. Kiểm tra xem trên trang đã có Overlay chưa, tránh tạo trùng lặp
    if (document.getElementById("productive-os-overlay")) return;

    // Cụm từ bắt buộc phải gõ đúng
    const REQUIRED_TEXT = "I PROMISE TO GET BACK TO WORK";

    // 2. Tạo lớp phủ đen toàn màn hình
    const overlay = document.createElement("div");
    overlay.id = "productive-os-overlay";
    
    Object.assign(overlay.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(42, 40, 32, 0.97)", // Khóa toàn bộ tầm nhìn trang web gốc
      zIndex: "999999999", // Đè lên tất cả các thành phần Web
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "'Courier New', Courier, monospace",
      userSelect: "none"
    });

    // 3. Khởi tạo cấu trúc HTML chuẩn Brutalism
    overlay.innerHTML = `
      <div style="
        background-color: #F4F1E1;
        border: 6px solid #2A2820;
        padding: 40px;
        width: 450px;
        text-align: center;
        box-shadow: 12px 12px 0px #000;
      ">
        <header style="border-b: 4px solid #2A2820; padding-bottom: 10px; margin-bottom: 20px;">
          <h1 style="font-size: 26px; font-weight: 900; text-transform: uppercase; font-style: italic; margin: 0; color: #2A2820;">
            PRODUCTIVE OS ALERT
          </h1>
        </header>
        
        <p style="font-size: 15px; font-weight: bold; color: #2A2820; line-height: 1.6; margin: 0 0 15px 0;">
          YOU ARE IN A FOCUS SESSION!<br>
          Type the text below to temporarily unlock the tab.
        </p>
        
        <div style="font-size: 13px; font-weight: 900; letter-spacing: 0.5px; color: #FF6B6B; background-color: #2A2820; padding: 8px; margin-bottom: 20px; text-transform: uppercase; font-style: italic;">
          "${REQUIRED_TEXT}"
        </div>

        <input 
          id="productive-os-promise-input" 
          type="text" 
          placeholder="Type the text above... (capitalized)"
          autocomplete="off"
          style="
            width: 100%;
            padding: 12px;
            font-size: 13px;
            font-weight: 900;
            border: 3px solid #2A2820;
            background-color: #FFF;
            color: #2A2820;
            margin-bottom: 20px;
            outline: none;
            box-sizing: border-box;
          "
        />

        <button 
          id="productive-os-unlock-tab-btn" 
          disabled
          style="
            width: 100%;
            padding: 12px 0;
            background-color: #A0A0A0;
            color: #E0E0E0;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 1px;
            border: 3px solid #2A2820;
            cursor: not-allowed;
            box-shadow: 4px 4px 0px #2A2820;
            transition: all 0.1s;
          "
        >
          UNLOCK THIS TAB 🔓
        </button>
      </div>
    `;

    // 4. Bơm Overlay vào trang web
    document.body.appendChild(overlay);

    const promiseInput = document.getElementById("productive-os-promise-input");
    const unlockTabBtn = document.getElementById("productive-os-unlock-tab-btn");

    // Tự động nhảy con trỏ vào ô nhập ngay lập tức
    promiseInput.focus();

    // Lắng nghe sự kiện gõ chữ
    promiseInput.addEventListener("input", (e) => {
      // Nếu user gõ chuẩn đét đèn đẹt từng ký tự viết hoa
      if (e.target.value === REQUIRED_TEXT) {
        unlockTabBtn.removeAttribute("disabled");
        unlockTabBtn.style.backgroundColor = "#2A2820";
        unlockTabBtn.style.color = "#F4F1E1";
        unlockTabBtn.style.cursor = "pointer";
      } else {
        unlockTabBtn.setAttribute("disabled", "true");
        unlockTabBtn.style.backgroundColor = "#A0A0A0";
        unlockTabBtn.style.color = "#E0E0E0";
        unlockTabBtn.style.cursor = "not-allowed";
      }
    });

    // 5. LOGIC KHI BẤM NÚT UNLOCK
    unlockTabBtn.addEventListener("click", () => {
      if (!unlockTabBtn.hasAttribute("disabled")) {
        overlay.remove();
        console.log("[Productive OS] Tab đã được mở khóa tạm thời bằng cam kết.");
      }
    });
  }
});