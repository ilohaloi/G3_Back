document.addEventListener('DOMContentLoaded', function() {
  const chatBox = document.querySelector('.chat-box');
  const inputField = document.querySelector('#message-input');
  const sendButton = document.querySelector('#send-button');
  const attachButton = document.querySelector('#attach-button');
  const fileInput = document.querySelector('#file-input');
  const memberList = document.querySelector('#member-list');
  const unreadButton = document.querySelector('#unread-button');
  let currentMember = '';  // 紀錄當前選中的會員

  // 各會員的歷史訊息及未讀計數
  const memberMessages = {
    "寶貝": {
      messages: [
        { user: 'you', text: 'Hi 寶貝!' },
        { user: 'other', text: '嗨，你好！', unread: true },
        { user: 'other', text: '最近怎麼樣？', unread: true }
      ],
      unreadCount: 2
    },
    "小賴": {
      messages: [
        { user: 'you', text: '小賴，你在嗎？' },
        { user: 'other', text: '在的，有事嗎？' }
      ],
      unreadCount: 0
    },
    "凱勛": {
      messages: [
        { user: 'you', text: '凱勛，我們開會嗎？' },
        { user: 'other', text: '是的，下午兩點。', unread: true }
      ],
      unreadCount: 1
    },
    "瑋婷": {
      messages: [
        { user: 'you', text: '瑋婷，晚點見。' },
        { user: 'other', text: '好，沒問題。' }
      ],
      unreadCount: 0
    },
    "詩潔":{
      messages: [
        { user: 'you', text: '瑋婷，晚點見。' },
        { user: 'other', text: '好，沒問題。' }
      ],
    }
  };

  // 顯示會員的對話
  function renderMessages(member) {
    chatBox.innerHTML = ''; // 清空 chatBox 內容
    const messages = memberMessages[member].messages || [];
    messages.forEach(message => {
      const messageElement = document.createElement('div');
      messageElement.classList.add('message');
      
      // 根據發送者應用不同的樣式
      if (message.user === 'you') {
        messageElement.classList.add('message-sender'); // "你" 發送的訊息，靠右對齊
      } else {
        messageElement.classList.add('message-receiver'); // "對方" 發送的訊息，靠左對齊
      }
  
      // 顯示文字訊息
      if (message.text) {
        messageElement.textContent = message.text;
      }
  
      // 如果有夾帶檔案，顯示檔案名稱並提供下載連結
      if (message.file) {
        const fileLink = document.createElement('a');
        fileLink.href = URL.createObjectURL(message.file);
        fileLink.textContent = `檔案: ${message.file.name}`;
        fileLink.download = message.file.name; // 下載檔案時會保留檔案名稱
        messageElement.appendChild(fileLink);
      }
  
      chatBox.appendChild(messageElement);
    });
    chatBox.scrollTop = chatBox.scrollHeight; // 滾動到底部
  }

  // 渲染會員列表
  function renderMemberList(filterUnread = false) {
    memberList.innerHTML = '';  // 清空會員列表
    for (const member in memberMessages) {
      const unreadCount = memberMessages[member].unreadCount;
      if (!filterUnread || unreadCount > 0) {  // 檢查是否過濾未讀訊息
        const listItem = document.createElement('li');
        listItem.classList.add('member-item');
        listItem.textContent = member;

        if (unreadCount > 0) {
          const unreadBadge = document.createElement('span');
          unreadBadge.classList.add('unread-badge');
          unreadBadge.textContent = unreadCount;
          listItem.appendChild(unreadBadge);
        }

        listItem.addEventListener('click', function() {
          currentMember = member;
          renderMessages(currentMember);
          memberMessages[currentMember].unreadCount = 0;  // 清除未讀數量
          renderMemberList();  // 重新渲染列表，移除未讀標記
        });

        memberList.appendChild(listItem);
      }
    }
  }

  // 綁定「未讀訊息」按鈕的點擊事件
  unreadButton.addEventListener('click', function() {
    renderMemberList(true);  // 過濾出有未讀訊息的會員
  });

  // 初始顯示完整的會員列表
  renderMemberList();

  // 發送消息
  function sendMessage() {
    const text = inputField.value;
    if (text.trim() !== '' && currentMember) {
      memberMessages[currentMember].messages.push({ user: 'you', text: text });
      inputField.value = ''; // 清空輸入框
      renderMessages(currentMember); // 重新渲染訊息
    }
  }

  sendButton.addEventListener('click', sendMessage);

  inputField.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      sendMessage();
    }
  });

  // 設置夾帶檔案功能
  setupAttachFile(attachButton, fileInput, memberMessages, renderMessages);

  function setupAttachFile(attachButton, fileInput, memberMessages, renderMessages) {
    attachButton.addEventListener('click', function() {
      if (currentMember) {
        fileInput.click(); // 模擬點擊 file input
      }
    });

    fileInput.addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (file && currentMember) {
        memberMessages[currentMember].messages.push({
          user: 'you',
          text: '', // 留空文字部分
          file: file // 加入檔案資訊
        });
        renderMessages(currentMember); // 重新渲染訊息
      }
    });
  }
});
