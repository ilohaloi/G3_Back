document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "http://localhost:8081/TIA103G3_Servlet/getMember";

    // 動態填充表格內容
    const tableBody = document.querySelector("#memberTable tbody");

    function populateTable(data) {
        tableBody.innerHTML = ''; // 清空表格
        data.forEach(member => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${member.id}</td>
                <td>${member.name}</td>
                <td>${member.email}</td>
                <td>${member.tell}</td>
                <td>${member.address}</td>
                <td>${member.birthday}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // 部分加密
    function maskEmail(email) {
        const [localPart, domain] = email.split("@");
        const maskedLocalPart = localPart.slice(0, 2) + "****";
        return maskedLocalPart + "@" + domain;
    }

    function maskPhone(phone) {
        return phone.slice(0, 2) + "****" + phone.slice(-2);
    }

    function populateTable(data) {
        tableBody.innerHTML = ''; // 清空表格
        data.forEach(member => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${member.id}</td>
                <td>${member.name}</td>
                <td>${maskEmail(member.email)}</td>
                <td>${maskPhone(member.tell)}</td>
                <td>${member.address}</td>
                <td>${member.birthday}</td>
            `;
            tableBody.appendChild(row);
        });
    }



    // 從 API 獲取會員資料
    function fetchMemberData() {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                populateTable(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    // 查詢功能
    const searchForm = document.getElementById("searchMemberForm");
    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const query = document.getElementById("member_name").value.toLowerCase();

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // 篩選符合查詢條件的會員
                const filteredMembers = data.filter(member => member.name.toLowerCase().includes(query));
                populateTable(filteredMembers);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    });

    // 顯示筆數變更功能
    const displayCountSelect = document.getElementById("displayCount");
    displayCountSelect.addEventListener("change", function () {
        const displayCount = parseInt(displayCountSelect.value);

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                populateTable(data.slice(0, displayCount));
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    });

    // 初始加載會員資料
    fetchMemberData();
});
