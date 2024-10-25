document.addEventListener("DOMContentLoaded", async function () {
  let memberList = document.getElementById('member-list');
  let chatBox = document.getElementById('chat-box');
  let messageInput = document.getElementById('message-input');
  let sendButton = document.getElementById('send-button');

  const agentName = "Agent123";  // Example agent name (current logged-in user)
    let currentMember = null;  // Store the currently selected member for chatting

 // Fetch the initial member list and chat history
 async function fetchChatInfo(member_id) {
  try {
      let response = await fetch(`/TIA103G3_Servlet/chat-info?member_id=${member_id}`);
      let data = await response.json();

      currentMember = { id: member_id};

      // Render chat history for the selected member
      chatBox.innerHTML = '';  // Clear chat box
      data.chatHistory.forEach((message) => {
          appendMessage(message, message.sender === agentName ? 'you' : 'other');
      });
  } catch (error) {
      console.error('Error fetching chat info:', error);
  }
}

// WebSocket connection for real-time chat
let ws = new WebSocket('ws://localhost:8081/TIA103G3_Servlet/ChatWS/vicTest');
ws.onopen = function () {
  console.log('WebSocket connection established.');}
// Append messages to the chat box with sender/receiver distinction
function appendMessage(message, user) {
  let messageElem = document.createElement('div');
  messageElem.textContent = message.message;  // Display the message content

  if (user === 'you') {
      messageElem.classList.add('message-sender');
  } else {
      messageElem.classList.add('message-receiver');
  }

  chatBox.appendChild(messageElem);
  chatBox.scrollTop = chatBox.scrollHeight;  // Scroll to the bottom
}

// Send a message from the agent to the current customer
function sendMessage() {
  let message = messageInput.value.trim();
  if (message && currentMember) {
      const payload = { sender: agentName, message: message, to: currentMember.id };
      ws.send(JSON.stringify(payload));  // Send the message via WebSocket

      appendMessage(payload, 'you');  // Show the message immediately in the chat box
      messageInput.value = '';  // Clear input field
  }
}

// Send message on button click
sendButton.addEventListener('click', sendMessage);

// Send message on "Enter" key press
messageInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
      event.preventDefault();  // Prevent default behavior
      sendMessage();
  }
});

// Handle incoming WebSocket messages
ws.onmessage = function (event) {
  let data = JSON.parse(event.data);
  appendMessage(data, data.sender === agentName ? 'you' : 'other');
};

// Handle WebSocket errors
ws.onerror = function (error) {
  console.error('WebSocket error:', error);
};

// Event listener to switch members and load their chat history
memberList.addEventListener('click', function (event) {
  if (event.target.tagName === 'LI') {
      const selectedMemberName = event.target.textContent;
      // const selectedMemberId = event.target.dataset.memberId;  // Assume each <li> has a data-memberId attribute

      fetchChatInfo(selectedmember_id);  // Load chat for the selected member
  }
});
});
