document.addEventListener('DOMContentLoaded', () => {
    const couponTable = document.getElementById('couponTable').querySelector('tbody');
    const displayCountSelect = document.getElementById('displayCount');
    const paginationContainer = document.getElementById('pagination');
    let couponData = []; // 儲存優惠券資料
    let currentPage = 1;
    let couponsPerPage = parseInt(displayCountSelect.value);

    // 初始化載入所有優惠券
    loadCoupons();

    // 加載優惠券資料
    async function loadCoupons(query = {}) {
        try {
            const url = 'http://localhost:8081/TIA103G3_Servlet/getUserCoup';
            const response = await fetch(url, {
                method: query ? 'POST' : 'GET',
                headers: { 'Content-Type': 'application/json' },
                body: query ? JSON.stringify(query) : null
            });
            couponData = await response.json();
            renderCoupons();
        } catch (error) {
            console.error('載入優惠券發生錯誤:', error);
        }
    }

    // 渲染優惠券列表及分頁
    function renderCoupons() {
        const start = (currentPage - 1) * couponsPerPage;
        const pagedCoupons = couponData.slice(start, start + couponsPerPage);
        couponTable.innerHTML = pagedCoupons.map(coupon => `
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
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(couponData.length / couponsPerPage);

        // 分頁按鈕生成函數
        const createPageButton = (page, text) => {
            const button = document.createElement('button');
            button.innerText = text;
            button.disabled = page < 1 || page > totalPages || page === currentPage;
            button.addEventListener('click', () => changePage(page));
            return button;
        };

        paginationContainer.appendChild(createPageButton(1, '第一頁'));
        paginationContainer.appendChild(createPageButton(currentPage - 1, '上一頁'));
        paginationContainer.appendChild(createPageButton(currentPage + 1, '下一頁'));
        paginationContainer.appendChild(createPageButton(totalPages, '最後一頁'));
    }

    // 更新頁面顯示內容
    function changePage(page) {
        currentPage = page;
        renderCoupons();
    }

    // 更新每頁顯示的優惠券數量
    displayCountSelect.addEventListener('change', () => {
        couponsPerPage = parseInt(displayCountSelect.value);
        currentPage = 1;
        renderCoupons();
    });

    // 搜索優惠券
    document.getElementById('searchButton').addEventListener('click', () => {
        const query = {
            memb_id: document.getElementById('memb_id').value,
            coup_id: document.getElementById('coup_id').value,
            issue_date_start: document.getElementById('issue_date_start').value,
            issue_date_end: document.getElementById('issue_date_end').value,
            coup_is_used: document.getElementById('coup_is_used').value
        };
        loadCoupons(query);
    });
});
