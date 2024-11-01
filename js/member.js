document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "http://localhost:8081/TIA103G3_Servlet/getMember";
    const tableBody = document.querySelector("#memberTable tbody");
    const displayCountSelect = document.getElementById("displayCount");
    const paginationContainer = document.getElementById("pagination");

    let memberData = [];
    let currentPage = 1;
    let membersPerPage = parseInt(displayCountSelect.value);

    // 遮蔽處理函數
    function maskEmail(email) {
        const [localPart, domain] = email.split("@");
        const maskedLocalPart = localPart.slice(0, 2) + "****";
        return maskedLocalPart + "@" + domain;
    }

    function maskPhone(phone) {
        return phone.slice(0, 2) + "****" + phone.slice(-2);
    }

    function maskAddress(address) {
        if (address.length <= 2) return address;
        const firstChar = address.charAt(0);
        const lastChar = address.charAt(address.length - 1);
        return `${firstChar}****${lastChar}`;
    }

    // 渲染表格內容
    function renderTable(data) {
        tableBody.innerHTML = '';
        data.forEach(member => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${member.id}</td>
                <td>${member.name}</td>
                <td>${maskEmail(member.email)}</td>
                <td>${maskPhone(member.tell)}</td>
                <td>${maskAddress(member.address)}</td>
                <td>${member.birthday}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // 渲染分頁按鈕
    function renderPagination() {
        const totalPages = Math.ceil(memberData.length / membersPerPage);
        paginationContainer.innerHTML = '';

        ['第一頁', '上一頁', '下一頁', '最後一頁'].forEach((text, i) => {
            const page = i === 0 ? 1 : i === 1 ? currentPage - 1 : i === 2 ? currentPage + 1 : totalPages;
            const button = document.createElement('button');
            button.innerText = text;
            button.disabled = page < 1 || page > totalPages || page === currentPage;
            button.onclick = () => { 
                currentPage = page; 
                renderCurrentPage();
            };
            paginationContainer.appendChild(button);
        });
    }

    // 渲染當前頁數的資料
    function renderCurrentPage() {
        const start = (currentPage - 1) * membersPerPage;
        const end = currentPage * membersPerPage;
        renderTable(memberData.slice(start, end));
        renderPagination();
    }

    // 顯示筆數變更功能
    displayCountSelect.addEventListener("change", function () {
        membersPerPage = parseInt(displayCountSelect.value);
        currentPage = 1;
        renderCurrentPage();
    });

    // 查詢功能
    const searchForm = document.getElementById("searchForm");
    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const query = document.getElementById("member_name").value.toLowerCase();

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                memberData = data.filter(member => member.name.toLowerCase().includes(query));
                currentPage = 1;
                renderCurrentPage();
            })
            .catch(error => console.error('Error fetching data:', error));
    });

    // 初次加載會員資料
    function fetchMemberData() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                memberData = data;
                renderCurrentPage();
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    fetchMemberData();
});
