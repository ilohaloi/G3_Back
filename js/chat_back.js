var ws = new WebSocket('ws://localhost:8081/TIA103G3_Servlet/ChatWS/500'); // 替換為你的 WebSocket 伺服器端點
console.log(ws);

ws.onopen = function () {
	console.log("Connected to WebSocket");
	// document.getElementById("status").innerText = "已連接";
};

//測試
function displayMessage(message, messageType) {
	const chatBox = document.querySelector('.chat-box'); // 確認 chat box 容器是否存在
	const messageElement = document.createElement('p'); // 創建一個 p 元素來顯示訊息
	messageElement.textContent = message; // 將訊息的內容放入 p 元素
	messageElement.classList.add(messageType);
	chatBox.appendChild(messageElement); // 將訊息元素添加到 chat box 中
  
	// 讓 chat box 自動滾動到底部，以顯示最新訊息
	chatBox.scrollTop = chatBox.scrollHeight;
}

ws.onmessage = function (event) {
	if (event.data) {
		console.log("Received data:", event.data);
		const data = JSON.parse(event.data);
		
		if(data.id==="employ"){
			
			displayMessage(data.data,'right-message');
		}
		else if(data.id=="member"){
			displayMessage(data.data,'left-message');
		}
		
		

	} else {
		console.log("Received an empty message from the server.");
	}
};



ws.onclose = function (event) {
	sessionStorage.removeItem('ws');
	// 增加條件判斷使否重開WS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	// setTimeout(() => {
	// 	ws = new WebSocket('ws://localhost:8081/TIA103G3_Servlet/ChatWS/500'); 
	// }, 3000);
	ws = new WebSocket('ws://localhost:8081/TIA103G3_Servlet/ChatWS/500'); 
	console.log("WS CLOSE!!!!!!!!!!!!!!!!!1111");
};


// Send a message from the agent to the current customer
const sendMessage = async function () {
	let id = sessionStorage.getItem("ID");
	let messageInput = document.getElementById('message-input');
	let message = messageInput.value.trim();
	console.log("ID:"+id + "/MSG:"+ message+":");

	if(id != null && message != ''){
		console.log("wwwwwwwwwwwwwwwwwwwwwwwwwwww");
		
		const json_str = JSON.stringify({
			// receiver : Number(id),
			id : JSON.parse(sessionStorage.getItem("ID")),
			receiver :"member",
			sender :"employ",                  // member : 會員  / employ : 客服
			content:message,
			timestamp:new Date().toISOString() // 可選，附帶時間戳
		});
		// const send_str = `${id}:${json_str}`;
		
		try {
			await ws.send(json_str); // 發送 JSON 格式的訊息到 WebSocket 伺服器
			// displayMessage(messageContent, 'cus_Message'); // 顯示客戶端訊息
			messageInput.value = ''; // 清空輸入框
		} catch (error) {
			console.error('無法發送訊息:', error);
		}

	}else{
		console.log("weeeeeeeeeeeeew");
	}

	messageInput.addEventListener('keydown', function(event) {
		if (event.key === 'Enter') {
			event.preventDefault(); // 防止 Enter 鍵新增換行
			sendMessage();
		}
	});
}

const fetchChatById = (id) => {
	// 點擊後發送請求來取得聊天紀錄
	console.log(ws);
	fetch(`http://localhost:8081/TIA103G3_Servlet/api/chat/history?id=${id}`)
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			return response.json(); // 假設伺服器返回 JSON 格式的聊天紀錄
		})
		.then(historyMap => {
			console.log("Response JSON:", historyMap);
			// 找到顯示聊天紀錄的 <div class="chat-box">
			const chatBox = document.querySelector('.chat-box');
			chatBox.innerHTML = ""; // 清空舊的聊天紀錄
			//前端顯示ID
			document.getElementById("member-id-display").textContent = id;

			const targetKey = `chat:history:${id}`;
			const historyList = historyMap[targetKey];
			sessionStorage.setItem("ID", id);

			if(Array.isArray(historyList)) {

				historyList.forEach((message) => {
					const messageData = JSON.parse(message);//根據下面判斷邏輯而新增
					const pTag = document.createElement('p');
					pTag.textContent = JSON.parse(message).content;
					
					// //判斷誰是發出方及接收方
					if (messageData.sender === "employ") {
						pTag.classList.add('right-message'); // 發出的訊息
					} else {
						pTag.classList.add('left-message'); // 接收的訊息
					}

					chatBox.appendChild(pTag);

					
				});
				//滾動至底部
				chatBox.scrollTop = chatBox.scrollHeight;
			}
		})
  .catch(error => {
	console.error('Error fetching member list:', error);
  });
}


document.addEventListener("DOMContentLoaded", async function() {
	let memberList = document.getElementById('member-list');
	let chatBox = document.getElementById('chat-box');
	let messageInput = document.getElementById('message-input');
	let sendButton = document.getElementById('send-button');
	sendButton.onclick =  sendMessage;
		
	// 新增按下 Enter 鍵送出訊息的邏輯
		messageInput.addEventListener('keydown', function(event) {
			if (event.key === 'Enter') {
				event.preventDefault(); // 防止 Enter 鍵新增換行
				sendMessage();
			}
		});
	
	let currentMember = null;  // Store the currently selected member for chatting

	fetch('http://localhost:8081/TIA103G3_Servlet/api/chat/member', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		}
	})
	  .then(response => {
		if (!response.ok) {
		  throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json(); // 將回應解析為 JSON
	  })
	  .then(chatIdList => {

	// 排序 chatIdList，依據最後訊息的時間戳降序排列
	

		// 找到列表的 <ul> 元素
		const memberList = document.getElementById('member-list');
		memberList.innerHTML = ""; // 清空之前的內容
	
		// 遍歷數據並創建 <li> 元素
		chatIdList.forEach(chatId => {
			const li = document.createElement('li');
			li.textContent = chatId.name; // 將每個數據項設置為 <li> 的文本
			li.classList.add('member-item');
		  	li.addEventListener('click', () => {
			fetchChatById(chatId.id);
		  	});
			
			
			
			memberList.appendChild(li); // 添加 <li> 到列表中
		});

	  	})

	});

	//*********************************搜尋框功能:搜尋會員***************************************//
	document.getElementById("search-input").addEventListener("input", function() {
		const searchTerm = this.value.toLowerCase();
		const members = document.querySelectorAll("#member-list li");
		
		members.forEach(member => {
			const name = member.textContent.toLowerCase();
			if (name.includes(searchTerm)) {
				member.style.display = ""; // 顯示
			} else {
				member.style.display = "none"; // 隱藏
			}
		});
	});

