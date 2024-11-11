// 新增函數：從後端加載優惠券 ID 到下拉選單
function loadCouponIds() {
    fetch('/getCouponIds') // 確保此 URL 正確指向獲取優惠券 ID 的 Servlet
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('couponId');
            data.forEach(id => {
                const option = document.createElement('option');
                option.value = id;
                option.text = `優惠券 ID: ${id}`;
                select.add(option);
            });
        })
        .catch(error => console.error('Error fetching coupon IDs:', error));
}

// 調用 loadCouponIds 函數來載入優惠券 ID
document.addEventListener('DOMContentLoaded', loadCouponIds);

// 原始 updateSchedule 函數保持不變
function updateSchedule() {
    // 取得表單中的值
    const couponId = document.getElementById("couponId").value.trim();
    const issueDate = document.getElementById("issueDate").value;
    const expiryDate = document.getElementById("expiryDate").value;

    // 檢查優惠券 ID 是否為數字格式
    if (!/^\d+$/.test(couponId)) {
        alert("優惠券 ID 必須為數字格式");
        return;
    }

    // 檢查日期格式是否有效
    if (!issueDate || !expiryDate) {
        alert("請選擇有效的發放日期和結束日期");
        return;
    }

    // 檢查開始日期是否早於結束日期
    const issueDateTime = new Date(issueDate);
    const expiryDateTime = new Date(expiryDate);
    if (issueDateTime >= expiryDateTime) {
        alert("發放開始日期必須早於結束日期");
        return;
    }

    // 格式化日期並準備要發送的資料
    const formattedIssueDate = issueDate.replace("T", " ");
    const formattedExpiryDate = expiryDate.replace("T", " ");
    const formData = `coup_id=${encodeURIComponent(couponId)}&issueDate=${encodeURIComponent(formattedIssueDate)}&expiryDate=${encodeURIComponent(formattedExpiryDate)}`;

    // 發送請求到後端
    fetch("http://localhost:8081/TIA103G3_Servlet/couponUpdate", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
        })
        .catch(error => console.error("Error:", error));
}
