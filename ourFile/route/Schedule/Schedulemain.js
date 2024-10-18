// 獲取 DOM 中用來顯示資料的容器
const userContainer = document.getElementById('user-container');//獲得id叫user-container的元素
const modal = document.getElementById('myModal');
const closeBtn = document.getElementsByClassName('close')[0];
const saveBtn = document.getElementById('saveBtn');
//這邊的 ID 一定要跟編輯行程的 ID 相對應才能取得value
const ship_id = document.getElementById('ship_id');
const route_id = document.getElementById('route_id');
const status = document.getElementById('status');
const shipping_time = document.getElementById('shipping_time');
const shipping_dock = document.getElementById('shipping_dock');
const rooms_booked = document.getElementById('rooms_booked');
// 當頁面載入完成後執行 fetchData 函式
window.addEventListener('DOMContentLoaded', (event) => {
    fetchData();
});

// 定義一個函式來獲取資料
async function fetchData() {
  // 使用 fetch API 獲取資料 , fetch對應Ships_scheduleServlet檔案路徑
    const response =  await fetch("http://localhost:8081/journey/schedule", {
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
    ['船隻編號', '航班編號','航班狀態', '出港時間', '駁船地點', '訂房總數', '更新航班', '刪除航班'].forEach(text => {
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

      const ship_idCell = document.createElement('td');
      ship_idCell.textContent = user.ship_id;
      row.appendChild(ship_idCell);

      const route_idCell = document.createElement('td');
      route_idCell.textContent = user.route_id;
      row.appendChild(route_idCell);

      const statusCell = document.createElement('td');
      statusCell.textContent = user.status;
      row.appendChild(statusCell);

      const shipping_timeCell = document.createElement('td');
      shipping_timeCell.textContent = user.shipping_time;
      row.appendChild(shipping_timeCell);

      const shipping_dockCell = document.createElement('td');
      shipping_dockCell.textContent = user.shipping_dock;
      row.appendChild(shipping_dockCell);

      const rooms_bookedCell = document.createElement('td');
      rooms_bookedCell.textContent = user.rooms_booked;
      row.appendChild(rooms_bookedCell);

      const updateCell = document.createElement('td');
      
      // 创建一个按钮元素
      var button1  = document.createElement('button');
      // 使用 addEventListener 绑定点击事件
      button1.addEventListener('click',async function() {
         // 设置输入框初始值
        ship_id.value = user.ship_id;//左邊會變動,右邊是原本的值
        route_id.value = user.route_id;
        status.value = user.status;
        shipping_time.value = user.shipping_time;
        shipping_dock.value = user.shipping_dock;
        rooms_booked.value = user.rooms_booked;
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
        const ship_id = user.ship_id;
        try {
            const response = await fetch('http://localhost:8081/journey/deleteschedulefetchservlet', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ship_id: ship_id  })
            });
            // 检查响应状态
            if (response.ok) {
                const result = await response.text(); // 获取响应文本
                alert("航班刪除成功！" + result); // 显示成功消息
                history.go(0);
            } else {
                alert("航班刪除失败，状态码：" + response.status);
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
          const response = await fetch('http://localhost:8081/journey/updateschedulefetchservlet', {
              method: 'POST',
              headers: {
                  "Content-Type": "application/json"
              },
              //JSON{id: route_id.value }id對應VO的設定
              body: JSON.stringify({ship_id: ship_id.value, route_id: route_id.value, status:status.value, shipping_time:shipping_time.value, shipping_dock:shipping_dock.value, rooms_booked:rooms_booked.value })
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



