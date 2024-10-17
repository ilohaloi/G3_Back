// 獲取 DOM 中用來顯示資料的容器
const userContainer = document.getElementById('user-container');//獲得id叫user-container的元素
const modal = document.getElementById('myModal');
const closeBtn = document.getElementsByClassName('close')[0];
const saveBtn = document.getElementById('saveBtn');
//這邊的 ID 一定要跟編輯行程的 ID 相對應才能取得value
const id = document.getElementById('id');
const memb_id = document.getElementById('memb_id');
const ship_id = document.getElementById('ship_id');
const coup_id = document.getElementById('coup_id');
const trav_orde_status = document.getElementById('trav_orde_status');
const room_amount = document.getElementById('room_amount');
const trav_orde_amount = document.getElementById('trav_orde_amount');
// 當頁面載入完成後執行 fetchData 函式
window.addEventListener('DOMContentLoaded', (event) => {
    fetchData();
});

// 定義一個函式來獲取資料
async function fetchData() {
  // 使用 fetch API 獲取資料 , fetch對應Ships_scheduleServlet檔案路徑
    const response =  await fetch("http://localhost:8081/journey/travel_order", {
        method: "get",
        mode: 'cors'
    })
    .catch(error => {
        console.log("Error" ,error);
    });
    const info = await response.json();
    console.log(info);
    displayUsers(info);
}

// 定義顯示使用者資料的函式
function displayUsers(users) {
  // 檢查是否有使用者資料
    if (!users || users.length === 0) {
        userContainer.innerHTML = '<p>沒有使用者資料。</p>';
        return;
    }

  // 創建一個表格來顯示資料
    const table = document.createElement('table');


  // 創建表格標題
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['訂單編號', '會員編號','船隻編號', '優惠券編號', '訂單狀況', '訂房數量', '訂單總價', '更新訂單', '刪除訂單'].forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

  // 創建表格內容
  const tbody = document.createElement('tbody');
  users.forEach(user => {
      const row = document.createElement('tr');

      const idCell = document.createElement('td');
      idCell.textContent = user.id;
      row.appendChild(idCell);

      const memb_idCell = document.createElement('td');
      memb_idCell.textContent = user.memb_id;
      row.appendChild(memb_idCell);

      const ship_idCell = document.createElement('td');
      ship_idCell.textContent = user.ship_id;
      row.appendChild(ship_idCell);

      const coup_idCell = document.createElement('td');
      coup_idCell.textContent = user.coup_id;
      row.appendChild(coup_idCell);

      const trav_orde_statusCell = document.createElement('td');
      trav_orde_statusCell.textContent = user.trav_orde_status;
      row.appendChild(trav_orde_statusCell);

      const room_amountCell = document.createElement('td');
      room_amountCell.textContent = user.room_amount;
      row.appendChild(room_amountCell);

      const trav_orde_amountCell = document.createElement('td');
      trav_orde_amountCell.textContent = user.trav_orde_amount;
      row.appendChild(trav_orde_amountCell);

      const updateCell = document.createElement('td');
      
      // 创建一个按钮元素
      var button1  = document.createElement('button');
      // 使用 addEventListener 绑定点击事件
      button1.addEventListener('click',async function() {
         // 设置输入框初始值
        id.value = user.id;//左邊會變動,右邊是原本的值
        memb_id.value = user.memb_id;
        ship_id.value = user.ship_id;
        coup_id.value = user.coup_id;
        trav_orde_status.value = user.trav_orde_status;
        room_amount.value = user.room_amount;
        trav_orde_amount.value = user.trav_orde_amount;
        // 显示模态窗口
        modal.style.display = "block";
      });

      //设置按钮的文本
      button1.textContent = '更新';
      updateCell.appendChild(button1);
      row.appendChild(updateCell);
      

      const deleteCell = document.createElement('td');
      
      // 创建一个按钮元素
      var button = document.createElement('button');
      // 使用 addEventListener 绑定点击事件
      button.addEventListener('click',async function() {
        const id = user.id;
        try {
            const response = await fetch('http://localhost:8081/journey/deletetravel_orderfetchservlet', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id: id  })
            });
            // 检查响应状态
            if (response.ok) {
                const result = await response.text(); // 获取响应文本
                alert("訂單刪除成功！" + result); // 显示成功消息
                history.go(0);
            } else {
                alert("訂單刪除失败，状态码：" + response.status);
            }
        } catch (error) {
            console.error('发生错误:', error);
            alert("发生错误，请重试！");
        }
      });
      // 设置按钮的文本
      button.textContent = '刪除';
      //
      deleteCell.appendChild(button);
      row.appendChild(deleteCell);
     
      tbody.appendChild(row);//要全部cell都放完才能寫這行


      
  });
  table.appendChild(tbody);


// 將表格插入到容器中
  userContainer.appendChild(table);

        // 点击关闭按钮，关闭模态窗口
        closeBtn.onclick = function() {
          modal.style.display = "none";
      }

      // 点击保存按钮，保存数据并关闭窗口
      saveBtn.addEventListener('click', async function() {
        try {
          const response = await fetch('http://localhost:8081/journey/updatetravel_orderfetchservlet', {
              method: 'POST',
              headers: {
                  "Content-Type": "application/json"
              },
              //JSON{id: route_id.value }id對應VO的設定
              body: JSON.stringify({id: id.value, memb_id: memb_id.value, ship_id:ship_id.value, coup_id:coup_id.value, trav_orde_status:trav_orde_status.value, room_amount:room_amount.value, trav_orde_amount:trav_orde_amount.value })
          });
          // 检查响应状态
          if (response.ok) {
              const result = await response.text(); // 获取响应文本
              alert("行程更新成功！" + result); // 显示成功消息
              history.go(0);
          } else {
              alert("行程更新失败，状态码：" + response.status);
          }
        } catch (error) {
            console.error('发生错误:', error);
            alert("发生错误，请重试！");
        }
      });

      // 点击窗口外部区域时，关闭模态窗口
      window.onclick = function(event) {
          if (event.target == modal) {
              modal.style.display = "none";
          }
      }
}// ' + insertRouteFetch.html + '必須加上+變成字串不然看不懂



