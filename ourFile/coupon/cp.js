document.addEventListener('DOMContentLoaded', function () {
    const couponTable = document.getElementById('couponTable').querySelector('tbody');
    const addCouponForm = document.getElementById('addCouponForm');
    const editCouponForm = document.getElementById('editCouponForm');
    const addCouponBtn = document.getElementById('addCouponBtn');
    const cancelAddBtn = document.getElementById('cancelAddBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const searchCouponForm = document.getElementById('searchCouponForm'); // 新增查詢表單
    const couponSearchNameInput = document.getElementById('couponSearchName'); // 查詢優惠券名稱輸入框
    let editingCouponId = null;
    const coupon_type = []; // 優惠券資料的陣列

    // 渲染優惠券列表
    function renderCoupons() {
        couponTable.innerHTML = '';
        coupon_type.forEach(coupon => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${coupon.coup_id}</td>
                <td>${coupon.coup_name || ''}</td>
                <td>${coupon.coup_description || ''}</td>
                <td>${coupon.coup_discount}%</td>
                <td>${new Date(coupon.coup_issue_date).toLocaleString()}</td>
                <td>${new Date(coupon.coup_expiry_date).toLocaleString()}</td>
                <td>
                    <button onclick="editCoupon(${coupon.coup_id})">編輯</button>
                    <button onclick="confirmDeleteCoupon(${coupon.coup_id})">刪除</button>
                </td>
            `;
            couponTable.appendChild(row);
        });
    }

    // 獲取優惠券
    function fetchCoupons(coup_name = '') {
        let url = 'http://localhost:8081/TIA103G3_Hibernate/getCoupon';
        if (coup_name) {
            url += `?coup_name=${encodeURIComponent(coup_name)}`; // 將查詢條件加到 URL
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
                renderCoupons(); // 渲染優惠券列表
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

        const coup_name = document.getElementById('coup_name').value;
        const coup_description = document.getElementById('coup_description').value;
        const coup_discount = parseFloat(document.getElementById('coup_discount').value);
        const coup_issue = document.getElementById('coup_issue_date').value;
        const coup_expiry = document.getElementById('coup_expiry_date').value;

        const newCoupon = {
            coup_name,
            coup_description,
            coup_discount,
            coup_issue_date: coup_issue,
            coup_expiry_date: coup_expiry,
        };

        // 假設有一個 API 對應於新增優惠券的請求
        fetch('http://localhost:8081/TIA103G3_Hibernate/addCoupon', {
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

                // 在這裡將新增的優惠券添加到本地數據（如果需要）
                coupon_type.push(data); // 可選，因為下面會重新獲取所有優惠券

                // 重新獲取優惠券列表
                fetchCoupons(); // 這一行會重新獲取所有優惠券
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
            document.getElementById('edit_coup_name').value = coupon.coup_name || '';
            document.getElementById('edit_coup_name').readOnly = true; // 設置名稱為只讀
            document.getElementById('edit_coup_description').value = coupon.coup_description || '';
            document.getElementById('edit_coup_discount').value = coupon.coup_discount || '';
            document.getElementById('edit_coup_issue_date').value = coupon.coup_issue_date || '';
            document.getElementById('edit_coup_expiry_date').value = coupon.coup_expiry_date || '';

            editingCouponId = coup_id; // 設置正在編輯的優惠券 ID
            editCouponForm.style.display = 'flex'; // 顯示編輯表單
            addCouponForm.style.display = 'none'; // 確保新增表單隱藏
        }
    };

    // 儲存編輯優惠券
    document.getElementById('editCouponFormDetails').addEventListener('submit', function (e) {
        e.preventDefault();

        const coup_name = document.getElementById('edit_coup_name').value; // 從只讀欄位獲取名稱
        const coup_description = document.getElementById('edit_coup_description').value;
        const coup_discount = parseFloat(document.getElementById('edit_coup_discount').value);
        const coup_issue = document.getElementById('edit_coup_issue_date').value;
        const coup_expiry = document.getElementById('edit_coup_expiry_date').value;

        const updatedCoupon = {
            coup_id: editingCouponId, // 將優惠券 ID 包含在請求中
            coup_name,
            coup_description,
            coup_discount,
            coup_issue_date: coup_issue,
            coup_expiry_date: coup_expiry,
        };

        // 假設有一個 API 對應於編輯優惠券的請求
        fetch('http://localhost:8081/TIA103G3_Hibernate/updateCoupon', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedCoupon) // 使用更新的優惠券數據
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                // 更新本地數據
                const index = coupon_type.findIndex(c => c.coup_id === editingCouponId);
                if (index !== -1) {
                    coupon_type[index] = { ...updatedCoupon }; // 更新本地數據
                }
                renderCoupons(); // 重新渲染列表
                editCouponForm.style.display = 'none'; // 隱藏編輯表單

                // 顯示成功的彈窗
                Swal.fire({
                    title: '成功',
                    text: '優惠券已成功編輯！',
                    icon: 'success',
                    confirmButtonText: '確定'
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });


    // 取消編輯優惠券
    cancelEditBtn.addEventListener('click', () => {
        editCouponForm.style.display = 'none'; // 隱藏編輯表單
    });

    // 確認刪除優惠券的函數
    window.confirmDeleteCoupon = function (coup_id) {
        Swal.fire({
            title: '確認刪除優惠券',
            text: '請輸入密碼以確認刪除',
            input: 'password',
            showCancelButton: true,
            confirmButtonText: '刪除',
            cancelButtonText: '取消',
            preConfirm: (inputValue) => {
                if (inputValue !== '123456') { // 輸入的密碼驗證
                    Swal.showValidationMessage('密碼錯誤，請再試一次');
                    return false;
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                deleteCoupon(coup_id); // 呼叫刪除函數
            }
        });
    };


    // 刪除優惠券的函數
    function deleteCoupon(coup_id) {
        fetch(`http://localhost:8081/TIA103G3_Hibernate/deleteCoupon/${coup_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // 彈出成功刪除的提示
                Swal.fire('成功', '優惠券已被刪除', 'success');
                location.reload(); // 刷新頁面
            })
            .catch(error => {
                console.error('Error deleting coupon:', error);
                Swal.fire('錯誤', '刪除優惠券時發生錯誤', 'error');
            });
    }


    // 查詢優惠券的函數
    document.getElementById('searchCouponForm').addEventListener('submit', function (e) {
        e.preventDefault(); // 防止表單的默認提交

        const coup_name = document.getElementById('coup_name').value; // 獲取輸入的折扣碼
        fetch(`http://localhost:8081/TIA103G3_Hibernate/getCouponByName/${coup_name}`) // 假設有這個API
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(coupon => {
                if (coupon && coupon.coup_name) { // 確保 coupon 有效且包含 coup_id
                    // 填充編輯表單
                    document.getElementById('edit_coup_id').value = coupon.coup_id; // 顯示ID，並設為只讀
                    document.getElementById('edit_coup_name').value = coupon.coup_name;
                    document.getElementById('edit_coup_description').value = coupon.coup_description;
                    document.getElementById('edit_coup_discount').value = coupon.coup_discount;
                    document.getElementById('edit_coup_issue_date').value = coupon.coup_issue_date;
                    document.getElementById('edit_coup_expiry_date').value = coupon.coup_expiry_date;

                    editingCouponId = coupon.coup_name; // 記錄編輯的優惠券 ID

                    // 顯示編輯表單，隱藏新增表單
                    editCouponForm.style.display = 'flex';
                    addCouponForm.style.display = 'none';
                } else {
                    Swal.fire('未找到優惠券', '您輸入的折扣碼不存在。', 'warning');
                }
            })
            .catch(error => {
                console.error('Error fetching coupon:', error);
                Swal.fire('查詢失敗', `無法查詢優惠券，請稍後再試。錯誤: ${error.message}`, 'error'); // 提供更多錯誤信息
            });

    });

    // 初始化
    fetchCoupons(); // 預設載入所有優惠券
});
