
// 獲取 DOM 中用來顯示資料的容器
const userContainer = document.getElementById('user-container');//獲得id叫user-container的元素
const modal = document.getElementById('myModal');
const closeBtn = document.getElementsByClassName('close')[0];
const saveBtn = document.getElementById('saveBtn');
//這邊的 ID 一定要跟編輯行程的 ID 相對應才能取得value
const route_id = document.getElementById('route_id');
const route_name = document.getElementById('route_name');
const route_price = document.getElementById('route_price');
const route_depiction = document.getElementById('route_depiction');
const route_days = document.getElementById('route_days');
// 當頁面載入完成後執行 fetchData 函式
window.addEventListener('DOMContentLoaded', (event) => {
    fetchData();
});

// 定義一個函式來獲取資料
async function fetchData() {
  // 使用 fetch API 獲取資料
    const response =  await fetch("http://localhost:8081/journey/route", {
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
    ['行程編號', '行程名稱', '行程價格', '行程描述', '行程天數','更新行程', '刪除行程'].forEach(text => {
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

        const nameCell = document.createElement('td');
        nameCell.textContent = user.name;
        row.appendChild(nameCell);

        const priceCell = document.createElement('td');
        priceCell.textContent = user.price;
        row.appendChild(priceCell);

        const depictionCell = document.createElement('td');
        depictionCell.textContent = user.depiction;
        row.appendChild(depictionCell);

        const dayCell = document.createElement('td');
        dayCell.textContent = user.days;
        row.appendChild(dayCell);

        const updateCell = document.createElement('td');
        
        // 创建一个按钮元素
        var button1  = document.createElement('button');
        // 使用 addEventListener 绑定点击事件
        button1.addEventListener('click',async function() {
           // 设置输入框初始值
          route_id.value = user.id;//左邊會變動,右邊是原本的值
          route_name.value = user.name;
          route_price.value = user.price;
          route_depiction.value = user.depiction;
          route_days.value = user.days;
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
          const route_id = user.id;
          try {
              const response = await fetch('http://localhost:8081/journey/deleteroutefetchservlet', {
                  method: 'POST',
                  headers: {
                      "Content-Type": "application/json"
                  },
                  body: JSON.stringify({id: route_id  })
              });
              // 检查响应状态
              if (response.ok) {
                  const result = await response.text(); // 获取响应文本
                  alert("行程刪除成功！" + result); // 显示成功消息
                  history.go(0);
              } else {
                  alert("行程刪除失败，状态码：" + response.status);
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
            const response = await fetch('http://localhost:8081/journey/updateroutefetchservlet', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                //JSON{id: route_id.value }id對應VO的設定
                body: JSON.stringify({id: route_id.value ,name: route_name.value,price: route_price.value, depiction: route_depiction.value, days:route_days.value })
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



