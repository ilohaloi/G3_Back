document.addEventListener('DOMContentLoaded', () => {
    const couponTable = document.querySelector('#couponTable tbody');
    const displayCountSelect = document.getElementById('displayCount');
    const paginationContainer = document.getElementById('pagination');
    let couponData = [];
    let currentPage = 1;
    let couponsPerPage = parseInt(displayCountSelect.value);

    // 初次載入優惠券
    loadCoupons();

    // 加載優惠券資料
    async function loadCoupons(query = '') {
        try {
            const url = `http://localhost:8081/TIA103G3_Servlet/getUserCoup${query}`;
            const response = await fetch(url);
            if (response.ok) {
                couponData = await response.json();
                console.log(couponData);
        
                renderCoupons(couponData); // 傳遞數據到渲染函數
            } else {
                console.error('Error loading coupons:', response.statusText);
            }
        } catch (error) {
            console.error('Error loading coupons:', error);
        }
    }

    // 渲染優惠券列表及分頁
    function renderCoupons(data) {
        couponTable.innerHTML = data
            .slice((currentPage - 1) * couponsPerPage, currentPage * couponsPerPage)
            .map(coupon => `
                <tr>
                    <td>${coupon.coup_no}</td>
                    <td>${coupon.memb_id}</td>
                    <td>${coupon.coup_id}</td>
                    <td>${new Date(coupon.coup_issue_date).toLocaleDateString()}</td>
                    <td>${new Date(coupon.coup_expiry_date).toLocaleDateString()}</td>
                    <td>${coupon.coup_is_used === 1 ? '已使用' : '未使用'}</td>
                </tr>
            `).join('');
        renderPagination();
    }

    // 渲染分頁按鈕
    function renderPagination() {
        const totalPages = Math.ceil(couponData.length / couponsPerPage);
        paginationContainer.innerHTML = '';

        ['第一頁', '上一頁', '下一頁', '最後一頁'].forEach((text, i) => {
            const page = i === 0 ? 1 : i === 1 ? currentPage - 1 : i === 2 ? currentPage + 1 : totalPages;
            const button = document.createElement('button');
            button.innerText = text;
            button.disabled = page < 1 || page > totalPages || page === currentPage;
            button.onclick = () => { 
                currentPage = page; 
                renderCoupons(couponData); // 傳遞篩選後的數據進行渲染 
            };
            paginationContainer.appendChild(button);
        });
    }

    // 每頁顯示數量變更
    displayCountSelect.addEventListener('change', () => {
        couponsPerPage = parseInt(displayCountSelect.value);
        currentPage = 1;
        renderCoupons(couponData); // 傳遞數據到渲染函數
    });

    // 查詢功能
    document.getElementById('searchForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const queryData = {
            memberId: document.getElementById('memb_id').value,
            couponId: document.getElementById('coup_id').value,
            issueDateStart: document.getElementById('issue_date_start').value,
            issueDateEnd: document.getElementById('issue_date_end').value,
            isUsed: document.getElementById('coup_is_used').value
        };

        // 構建查詢字串，只包含有值的參數
        const query = Object.entries(queryData)
            .filter(([_, value]) => value)  // 只包含有值的參數
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');

        const fullQuery = query ? `?${query}` : ''; // 如果有查詢參數，則加上 '?'

        console.log("查詢 URL:", `http://localhost:8081/TIA103G3_Servlet/CouponsOwned${fullQuery}`);
        try {
            const response = await fetch(`http://localhost:8081/TIA103G3_Servlet/CouponsOwned${fullQuery}`);
            if (response.ok) {
                couponData = await response.json();
                console.log("查詢結果:", couponData); // 確認回應資料
                currentPage = 1;
                renderCoupons(couponData); // 渲染查詢結果
            } else {
                alert("查詢失敗，請稍後再試。");
            }
        } catch (error) {
            console.error("查詢發生錯誤:", error);
            alert("伺服器無回應，請稍後再試。");
        }
    });
});

