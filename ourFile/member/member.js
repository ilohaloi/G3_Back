document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "http://localhost:8081/TIA103G3_Servlet/getMember"; // 定義從後端 API 獲取會員資料的 URL

    // 動態填充表格內容
    const tableBody = document.querySelector("#memberTable tbody"); // 獲取表格的 <tbody> 元素，將資料填充到這裡

    function populateTable(data) {
        tableBody.innerHTML = ''; // 每次填充前清空表格內容
        data.forEach(member => {  // 遍歷從 API 獲取的每個會員資料
            const row = document.createElement("tr");  // 為每個會員創建一行
            row.innerHTML = `
                <td>${member.id}</td>
                <td>${member.name}</td>
                <td>${member.email}</td>
                <td>${member.tell}</td>
                <td>${member.address}</td>
                <td>${member.birthday}</td>
            `;
            tableBody.appendChild(row);  // 將該行插入表格
        });
    }

    // 部分加密
    function maskEmail(email) {
        const [localPart, domain] = email.split("@");  // 將信箱分為用戶名與域名
        const maskedLocalPart = localPart.slice(0, 2) + "****";  // 用戶名取前兩位字符，後面加****
        return maskedLocalPart + "@" + domain;  // 返回遮蔽後的信箱
    }

    function maskPhone(phone) {
        return phone.slice(0, 2) + "****" + phone.slice(-2);  // 返回前兩位數字與最後兩位數字之間用****代替的電話號碼
    }

    function maskAddress(address) {
        if (address.length <= 2) {
            return address; // 如果地址長度小於等於2，則不遮蔽
        }
        const firstChar = address.charAt(0); // 獲取地址的第一個字符
        const lastChar = address.charAt(address.length - 1); // 獲取地址的最後一個字符
        return `${firstChar}****${lastChar}`; // 返回遮蔽的地址
    }

    function populateTable(data) {
        tableBody.innerHTML = '';  // 清空表格
        data.forEach(member => {  // 遍歷每個會員資料
            const row = document.createElement("tr");  // 創建表格行
            row.innerHTML = `
            <td>${member.id}</td>  
            <td>${member.name}</td> 
            <td>${maskEmail(member.email)}</td> 
            <td>${maskPhone(member.tell)}</td>
            <td>${maskAddress(member.address)}</td>
            <td>${member.birthday}</td> 
        `;
            tableBody.appendChild(row);  // 將該行插入表格
        });
    }




    // 從 API 獲取會員資料
    function fetchMemberData() {
        fetch(apiUrl)  // 向 apiUrl 發送 GET 請求
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');  // 如果回應不正常，拋出錯誤
                }
                return response.json();  // 將回應轉換為 JSON 格式
            })
            .then(data => {
                populateTable(data);  // 將獲取到的會員資料填充到表格中
            })
            .catch(error => {
                console.error('Error fetching data:', error);  // 捕獲並顯示錯誤
            });
    }

    // 查詢功能
    const searchForm = document.getElementById("searchMemberForm");  // 獲取查詢表單元素
    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();  // 防止表單提交時頁面刷新
        const query = document.getElementById("member_name").value.toLowerCase();  // 獲取輸入的會員姓名，並轉為小寫以進行比對

        fetch(apiUrl)  // 再次發送 API 請求，獲取所有會員資料
            .then(response => response.json())
            .then(data => {
                // 篩選符合查詢條件的會員（依據姓名部分匹配）
                const filteredMembers = data.filter(member => member.name.toLowerCase().includes(query));
                populateTable(filteredMembers);  // 將篩選後的會員資料填充到表格中
            })
            .catch(error => {
                console.error('Error fetching data:', error);  // 捕獲並顯示錯誤
            });
    });

    // 顯示筆數變更功能
    const displayCountSelect = document.getElementById("displayCount");  // 獲取顯示筆數的下拉選單
    displayCountSelect.addEventListener("change", function () {
        const displayCount = parseInt(displayCountSelect.value);  // 獲取選中的顯示筆數並轉為整數

        fetch(apiUrl)  // 發送 API 請求，獲取所有會員資料
            .then(response => response.json())
            .then(data => {
                populateTable(data.slice(0, displayCount));  // 根據選擇的筆數顯示部分會員資料
            })
            .catch(error => {
                console.error('Error fetching data:', error);  // 捕獲並顯示錯誤
            });
    });

    // 初始加載會員資料
    fetchMemberData();  // 頁面加載完成後，自動從 API 獲取所有會員資料並顯示在表格中
});