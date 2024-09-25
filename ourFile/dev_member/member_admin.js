 // 查詢會員功能
document.getElementById('searchButton').addEventListener('click', function () {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#memberTable tbody tr');

    rows.forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        const id = row.cells[0].textContent.toLowerCase();

        if (name.includes(searchValue) || id.includes(searchValue)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

// 刪除會員功能
function deleteMember(button) {
    const row = button.parentElement.parentElement;
    row.remove();
}

// 上一頁按鈕功能
document.getElementById('frontpage-button').addEventListener('click', function () {
    if (currentPage > 1) {
        currentPage--;
        updatePagination();
    }
});

// 下一頁按鈕功能
document.getElementById('nextpage-button').addEventListener('click', function () {
    const rows = document.querySelectorAll('#memberTable tbody tr');
    const totalRows = rows.length;
    const totalPages = Math.ceil(totalRows / membersPerPage);

    if (currentPage < totalPages) {
        currentPage++;
        updatePagination();
    }
});
