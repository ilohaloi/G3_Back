document.addEventListener('DOMContentLoaded', function () {
    const couponTable = document.getElementById('couponTable').querySelector('tbody');
    const addCouponForm = document.getElementById('addCouponForm');
    const editCouponForm = document.getElementById('editCouponForm');
    const addCouponBtn = document.getElementById('addCouponBtn');
    const cancelAddBtn = document.getElementById('cancelAddBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');

    const displayCountSelect = document.getElementById('displayCount'); // 更新下拉選單 ID
    const paginationContainer = document.getElementById('pagination'); // 分頁容器
    let editingCouponId = null;
    const coupon_type = []; // 優惠券資料的陣列
    let currentPage = 1; // 當前頁面
    let totalCoupons = 0; // 總優惠券數量
    let couponsPerPage = parseInt(displayCountSelect.value); // 使用下拉選單的初始值

    // 載入優惠券資料
    function loadCoupons() {
        fetch('http://localhost:8081/TIA103G3_Servlet/getCoupon') // 替換為您的 API 端點
            .then(response => response.json())
            .then(data => {
                coupon_type.length = 0; // 清空現有的優惠券數據
                coupon_type.push(...data); // 將從後端獲取的資料加入 coupon_type 陣列
                totalCoupons = coupon_type.length; // 總數量
                renderCoupons(); // 渲染優惠券
            })
            .catch(error => console.error('Error fetching coupons:', error));
    }


    // 渲染優惠券列表
    function renderCoupons() {
        couponTable.innerHTML = '';

        const startIndex = (currentPage - 1) * couponsPerPage;
        const endIndex = startIndex + couponsPerPage;

        // 取出當前頁面的優惠券
        const couponsToDisplay = coupon_type.slice(startIndex, endIndex);
        couponsToDisplay.forEach(coupon => {
          
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${coupon.coup_id}</td>
                <td>${coupon.coup_code}</td>
                <td>${coupon.coup_description || ''}</td>
                <td>${coupon.coup_discount}%</td>
                <td>
                    <button onclick="editCoupon(${coupon.coup_id})">編輯</button>
                    <button onclick="confirmDeleteCoupon(${coupon.coup_id})">刪除</button>
                </td>
            `;
            couponTable.appendChild(row);
        });


        // 渲染分頁按鈕
        renderPagination();
    }

    // 渲染分頁按鈕
    function renderPagination() {
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(totalCoupons / couponsPerPage);

        const createPageButton = (page, text) => {
            const button = document.createElement('button');
            button.innerText = text;
            button.disabled = page < 1 || page > totalPages || page === currentPage;
            button.onclick = () => {
                currentPage = page;
                renderCoupons();
            };
            return button;
        };

        paginationContainer.appendChild(createPageButton(1, '第一頁'));
        paginationContainer.appendChild(createPageButton(currentPage - 1, '上一頁'));
        paginationContainer.appendChild(createPageButton(currentPage + 1, '下一頁'));
        paginationContainer.appendChild(createPageButton(totalPages, '最後一頁'));

    }

    // 獲取優惠券
    function fetchCoupons(coup_code = '') {


        let url = 'http://localhost:8081/TIA103G3_Servlet/getCoupon';


        if (coup_code) {
            url += `?coup_code=${encodeURIComponent(coup_code)}`; // 將查詢條件加到 URL
        }
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                coupon_type.length = 0; // 清空現有的優惠券數據
                coupon_type.push(...data); // 將從後端獲取的資料加入 coupon_type 陣列

                totalCoupons = coupon_type.length; // 總數量
                renderCoupons(); // 渲染優惠券列表
                renderPagination(); // 渲染分頁

            })
            .catch(error => {
                console.error('Error fetching coupons:', error);
            });
    }

    // 新增優惠券
    addCouponBtn.addEventListener('click', () => {
        addCouponForm.style.display = 'flex';
        editCouponForm.style.display = 'none'; // 確保編輯表單隱藏
        document.getElementById('couponFormDetails').reset(); // 重置新增表單
    });

    // 儲存新增優惠券
    document.getElementById('couponFormDetails').addEventListener('submit', function (e) {
        e.preventDefault();


        const coup_code = document.getElementById('edit_coup_code').value; 

        const coup_description = document.getElementById('coup_description').value;
        const coup_discount = parseFloat(document.getElementById('coup_discount').value);

        const newCoupon = {
            coup_code,
            coup_description,
            coup_discount,
        };

        // 假設有一個 API 對應於新增優惠券的請求

        fetch('http://localhost:8081/TIA103G3_Servlet/addCoupon', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCoupon),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // 彈出成功提示
                Swal.fire({
                    icon: 'success',
                    title: '新增成功!',
                    text: '優惠券已成功新增!',
                });


                loadCoupons(); // 重新獲取所有優惠券

                addCouponForm.style.display = 'none'; // 隱藏新增表單
            })
            .catch(error => {
                console.error('Error adding coupon:', error);
            });
    });


    // 取消新增優惠券
    cancelAddBtn.addEventListener('click', () => {
        addCouponForm.style.display = 'none'; // 隱藏新增表單
    });

    // 編輯優惠券
    window.editCoupon = function (coup_id) {
        const coupon = coupon_type.find(c => c.coup_id === coup_id);
        if (coupon) {
            document.getElementById('edit_coup_code').value = coupon.coup_code;
            document.getElementById('edit_coup_code').readOnly = true; // 設置名稱為只讀
            document.getElementById('edit_coup_description').value = coupon.coup_description || '';
            document.getElementById('edit_coup_discount').value = coupon.coup_discount || '';

            editingCouponId = coup_id; // 設置正在編輯的優惠券 ID
            editCouponForm.style.display = 'flex'; // 顯示編輯表單
            addCouponForm.style.display = 'none'; // 確保新增表單隱藏
        }
    };

    // 儲存編輯優惠券
    document.getElementById('editCouponFormDetails').addEventListener('submit', function (e) {
        e.preventDefault();

        const coup_code = document.getElementById('edit_coup_code').value; // 從只讀欄位獲取名稱
        const coup_description = document.getElementById('edit_coup_description').value;
        const coup_discount = parseFloat(document.getElementById('edit_coup_discount').value);

        const updatedCoupon = {
            coup_id: editingCouponId, // 將優惠券 ID 包含在請求中
            coup_code,
            coup_description,
            coup_discount,
        };



        fetch('http://localhost:8081/TIA103G3_Servlet/updateCoupon', {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCoupon),

        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {

                Swal.fire({
                    icon: 'success',
                    title: '編輯成功!',
                    text: '優惠券已成功編輯!',
                });

                loadCoupons(); // 重新獲取所有優惠券
                editCouponForm.style.display = 'none'; // 隱藏編輯表單
            })
            .catch(error => {
                console.error('Error updating coupon:', error);
            });
    });


    // 取消編輯優惠券
    cancelEditBtn.addEventListener('click', () => {
        editCouponForm.style.display = 'none'; // 隱藏編輯表單
    });


    // 刪除優惠券
    window.confirmDeleteCoupon = function (coup_id) {
        Swal.fire({
            title: '確定刪除此優惠券嗎?',
            showCancelButton: true,
            confirmButtonText: '刪除',
            cancelButtonText: '取消',
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:8081/TIA103G3_Servlet/deleteCoupon/${coup_id}`, {
                    method: 'DELETE',
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        Swal.fire('已刪除!', '', 'success');
                        loadCoupons(); // 重新獲取所有優惠券
                    })
                    .catch(error => {
                        console.error('Error deleting coupon:', error);
                    });
            }
        });
    };

    // 更新每頁顯示的優惠券數量
    displayCountSelect.addEventListener('change', (e) => {
        couponsPerPage = parseInt(e.target.value); // 更新每頁顯示的數量
        currentPage = 1; // 重置當前頁碼
        renderCoupons(); // 重新渲染優惠券列表
    });

    // 初始加載優惠券
    loadCoupons();

});
