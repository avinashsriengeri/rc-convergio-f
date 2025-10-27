/**
 * RC Convergio Live Chat Widget
 * Professional live chat widget for customer websites
 * Version: 1.0.0
 */

(function() {
  'use strict';

  // Configuration
  let config = window.RCLiveChatConfig || {};
  let tenantId = config.tenant || null;
  let baseUrl = config.baseUrl || (window.location.protocol + '//' + window.location.hostname + ':5173');
  let isOpen = false;
  let conversationId = null;
  let sessionId = null;
  let isTyping = false;
  let typingTimer = null;
  let messagePollingInterval = null;
  let lastMessageId = null;
  let seenMessageIds = new Set(); // Track all seen message IDs
  let isDevelopment = false; // Enable polling for testing

  // Widget Elements
  let widgetContainer = null;
  let chatWindow = null;
  let chatMessages = null;
  let messageInput = null;
  let sendButton = null;
  let toggleButton = null;

  // Generate unique session ID
  function generateSessionId() {
    return 'rc_livechat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Initialize widget
  function init() {
    if (!tenantId) {
      console.error('RC Live Chat: Tenant ID is required');
      return;
    }

    // Generate session ID if not exists
    if (!sessionId) {
      sessionId = generateSessionId();
    }

    createWidget();
    attachEventListeners();
    console.log('RC Live Chat Widget initialized for tenant:', tenantId, 'session:', sessionId);
  }

  // Create widget HTML structure
  function createWidget() {
    // Create main container
    widgetContainer = document.createElement('div');
    widgetContainer.id = 'rc-livechat-widget';
    widgetContainer.innerHTML = `
      <div class="rc-livechat-container">
        <!-- Toggle Button -->
        <div class="rc-livechat-toggle" id="rc-livechat-toggle">
          <div class="rc-livechat-toggle-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          </div>
          <div class="rc-livechat-toggle-text">Live Chat</div>
          <div class="rc-livechat-notification" id="rc-livechat-notification" style="display: none;"></div>
        </div>

        <!-- Chat Window -->
        <div class="rc-livechat-window" id="rc-livechat-window" style="display: none;">
          <!-- Header -->
          <div class="rc-livechat-header">
            <div class="rc-livechat-header-info">
              <div class="rc-livechat-header-title">Live Chat Support</div>
              <div class="rc-livechat-header-status" id="rc-livechat-status">Online</div>
            </div>
            <button class="rc-livechat-close" id="rc-livechat-close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Messages Area -->
          <div class="rc-livechat-messages" id="rc-livechat-messages">
            <div class="rc-livechat-welcome">
              <div class="rc-livechat-welcome-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <div class="rc-livechat-welcome-title">Welcome to Live Chat!</div>
              <div class="rc-livechat-welcome-text">How can we help you today?</div>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div class="rc-livechat-typing" id="rc-livechat-typing" style="display: none;">
            <div class="rc-livechat-typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span class="rc-livechat-typing-text">Agent is typing...</span>
          </div>

          <!-- Input Area -->
          <div class="rc-livechat-input-area">
            <div class="rc-livechat-input-container">
              <input 
                type="text" 
                class="rc-livechat-input" 
                id="rc-livechat-input" 
                placeholder="Type your message..."
                maxlength="1000"
              />
              <button class="rc-livechat-send" id="rc-livechat-send" disabled>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                </svg>
              </button>
            </div>
            <div class="rc-livechat-input-footer">
              <span class="rc-livechat-char-count" id="rc-livechat-char-count">0/1000</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add styles
    addStyles();

    // Append to body
    document.body.appendChild(widgetContainer);

    // Get references to elements
    toggleButton = document.getElementById('rc-livechat-toggle');
    chatWindow = document.getElementById('rc-livechat-window');
    chatMessages = document.getElementById('rc-livechat-messages');
    messageInput = document.getElementById('rc-livechat-input');
    sendButton = document.getElementById('rc-livechat-send');
    const closeButton = document.getElementById('rc-livechat-close');
    const notification = document.getElementById('rc-livechat-notification');
    const typingIndicator = document.getElementById('rc-livechat-typing');
    const charCount = document.getElementById('rc-livechat-char-count');

    // Store references
    window.rcLiveChatElements = {
      toggleButton,
      chatWindow,
      chatMessages,
      messageInput,
      sendButton,
      closeButton,
      notification,
      typingIndicator,
      charCount
    };
  }

  // Add CSS styles
  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #rc-livechat-widget {
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        line-height: 1.4;
      }

      .rc-livechat-container {
        position: relative;
      }

      /* Toggle Button */
      .rc-livechat-toggle {
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        border: none;
        border-radius: 50px;
        padding: 12px 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        transition: all 0.3s ease;
        position: relative;
        min-width: 120px;
        justify-content: center;
      }

      .rc-livechat-toggle:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
      }

      .rc-livechat-toggle-icon {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .rc-livechat-toggle-text {
        font-weight: 600;
        font-size: 14px;
      }

      .rc-livechat-notification {
        position: absolute;
        top: -5px;
        right: -5px;
        background: #ef4444;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
      }

      /* Chat Window */
      .rc-livechat-window {
        position: absolute;
        bottom: 70px;
        left: 0;
        width: 350px;
        height: 500px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        border: 1px solid #e5e7eb;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      /* Header */
      .rc-livechat-header {
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 16px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .rc-livechat-header-title {
        font-weight: 600;
        font-size: 16px;
      }

      .rc-livechat-header-status {
        font-size: 12px;
        opacity: 0.9;
      }

      .rc-livechat-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: background-color 0.2s;
      }

      .rc-livechat-close:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      /* Messages Area */
      .rc-livechat-messages {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
        background: #f9fafb;
      }

      .rc-livechat-welcome {
        text-align: center;
        padding: 20px 0;
      }

      .rc-livechat-welcome-icon {
        color: #10b981;
        margin-bottom: 12px;
      }

      .rc-livechat-welcome-title {
        font-weight: 600;
        font-size: 16px;
        color: #111827;
        margin-bottom: 8px;
      }

      .rc-livechat-welcome-text {
        color: #6b7280;
        font-size: 14px;
      }

      .rc-livechat-message {
        margin-bottom: 16px;
        display: flex;
        align-items: flex-start;
        gap: 8px;
      }

      .rc-livechat-message.customer {
        flex-direction: row-reverse;
      }

      .rc-livechat-message-bubble {
        max-width: 80%;
        padding: 12px 16px;
        border-radius: 18px;
        font-size: 14px;
        line-height: 1.4;
        word-wrap: break-word;
      }

      .rc-livechat-message.customer .rc-livechat-message-bubble {
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        border-bottom-right-radius: 4px;
      }

      .rc-livechat-message.agent .rc-livechat-message-bubble {
        background: white;
        color: #111827;
        border: 1px solid #e5e7eb;
        border-bottom-left-radius: 4px;
      }

      .rc-livechat-message-time {
        font-size: 11px;
        color: #9ca3af;
        margin-top: 4px;
        text-align: right;
      }

      .rc-livechat-message.agent .rc-livechat-message-time {
        text-align: left;
      }

      /* Typing Indicator */
      .rc-livechat-typing {
        padding: 12px 20px;
        background: #f9fafb;
        border-top: 1px solid #e5e7eb;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .rc-livechat-typing-dots {
        display: flex;
        gap: 4px;
      }

      .rc-livechat-typing-dots span {
        width: 6px;
        height: 6px;
        background: #10b981;
        border-radius: 50%;
        animation: rc-livechat-typing 1.4s infinite ease-in-out;
      }

      .rc-livechat-typing-dots span:nth-child(1) { animation-delay: -0.32s; }
      .rc-livechat-typing-dots span:nth-child(2) { animation-delay: -0.16s; }

      @keyframes rc-livechat-typing {
        0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
        40% { transform: scale(1); opacity: 1; }
      }

      .rc-livechat-typing-text {
        font-size: 12px;
        color: #6b7280;
      }

      /* Input Area */
      .rc-livechat-input-area {
        border-top: 1px solid #e5e7eb;
        background: white;
      }

      .rc-livechat-input-container {
        display: flex;
        align-items: center;
        padding: 16px 20px;
        gap: 12px;
      }

      .rc-livechat-input {
        flex: 1;
        border: 1px solid #d1d5db;
        border-radius: 20px;
        padding: 10px 16px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;
      }

      .rc-livechat-input:focus {
        border-color: #10b981;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
      }

      .rc-livechat-send {
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
      }

      .rc-livechat-send:hover:not(:disabled) {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      }

      .rc-livechat-send:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }

      .rc-livechat-input-footer {
        padding: 0 20px 12px;
        text-align: right;
      }

      .rc-livechat-char-count {
        font-size: 11px;
        color: #9ca3af;
      }

      /* Responsive */
      @media (max-width: 480px) {
        #rc-livechat-widget {
          bottom: 10px;
          left: 10px;
          right: 10px;
        }

        .rc-livechat-window {
          width: 100%;
          height: 400px;
          bottom: 60px;
        }

        .rc-livechat-toggle {
          width: 100%;
          justify-content: center;
        }
      }

      /* Scrollbar */
      .rc-livechat-messages::-webkit-scrollbar {
        width: 4px;
      }

      .rc-livechat-messages::-webkit-scrollbar-track {
        background: transparent;
      }

      .rc-livechat-messages::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 2px;
      }

      .rc-livechat-messages::-webkit-scrollbar-thumb:hover {
        background: #9ca3af;
      }
    `;
    document.head.appendChild(style);
  }

  // Attach event listeners
  function attachEventListeners() {
    const { toggleButton, chatWindow, messageInput, sendButton, closeButton, charCount } = window.rcLiveChatElements;

    // Toggle chat window
    toggleButton.addEventListener('click', toggleChat);

    // Close chat window
    closeButton.addEventListener('click', closeChat);

    // Send message
    sendButton.addEventListener('click', sendMessage);

    // Input events
    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    messageInput.addEventListener('input', (e) => {
      updateCharCount(e.target.value.length);
      updateSendButton(e.target.value.trim().length > 0);
      
      // Typing indicator
      if (!isTyping && e.target.value.trim().length > 0) {
        startTyping();
      } else if (isTyping && e.target.value.trim().length === 0) {
        stopTyping();
      }
    });

    // Click outside to close
    document.addEventListener('click', (e) => {
      if (isOpen && !widgetContainer.contains(e.target)) {
        closeChat();
      }
    });
  }

  // Toggle chat window
  function toggleChat() {
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  }

  // Open chat window
  function openChat() {
    isOpen = true;
    chatWindow.style.display = 'flex';
    messageInput.focus();
    
    // Start conversation if not already started
    if (!conversationId) {
      startConversation();
    }
  }

  // Close chat window
  function closeChat() {
    isOpen = false;
    chatWindow.style.display = 'none';
    stopTyping();
    stopMessagePolling();
  }

  // Start polling for new messages
  function startMessagePolling() {
    if (messagePollingInterval) {
      clearInterval(messagePollingInterval);
    }
    
    // Skip polling in development mode to reduce API calls
    if (isDevelopment) {
      console.log('Development mode: Message polling disabled to reduce API calls');
      return;
    }
    
    messagePollingInterval = setInterval(async () => {
      await checkForNewMessages();
    }, 5000); // Check every 5 seconds (less aggressive)
  }

  // Stop polling for new messages
  function stopMessagePolling() {
    if (messagePollingInterval) {
      clearInterval(messagePollingInterval);
      messagePollingInterval = null;
    }
  }

  // Reset message tracking for new conversation
  function resetMessageTracking() {
    lastMessageId = null;
    seenMessageIds.clear();
    console.log('Message tracking reset for new conversation');
  }

  // Check for new messages from agent
  async function checkForNewMessages() {
    if (!conversationId || !isOpen) return; // Only poll when chat is open

    try {
      const response = await fetch(`${baseUrl}/api/livechat/conversations/${conversationId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success && data.data.messages) {
        // Process new messages
        data.data.messages.forEach(message => {
          // Only show agent messages that we haven't seen before
          if (message.sender_type === 'agent' && !seenMessageIds.has(message.id)) {
            addMessage(message.message, 'agent');
            seenMessageIds.add(message.id); // Mark as seen
            lastMessageId = message.id; // Update last seen message ID
            console.log('New agent message received:', message.message, 'ID:', message.id);
          }
        });
      }
    } catch (error) {
      console.error('Error checking for new messages:', error);
    }
  }

  // Start new conversation
  async function startConversation() {
    // Reset message tracking for new conversation
    resetMessageTracking();
    
    try {
      const response = await fetch(`${baseUrl}/api/livechat/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          tenant_id: tenantId,
          customer_name: getCustomerName(),
          customer_email: getCustomerEmail(),
          session_id: sessionId
        })
      });

      const data = await response.json();
      
      if (data.success) {
        conversationId = data.data.conversation_id;
        sessionId = data.data.session_id;
        console.log('Conversation started:', conversationId);
        
        // Initialize seenMessageIds to prevent showing existing messages
        if (data.data.messages && data.data.messages.length > 0) {
          // Mark all existing messages as seen
          data.data.messages.forEach(message => {
            seenMessageIds.add(message.id);
          });
          // Set to the latest message ID
          const latestMessage = data.data.messages[data.data.messages.length - 1];
          lastMessageId = latestMessage.id;
          console.log('Initialized seenMessageIds with', seenMessageIds.size, 'messages, lastMessageId:', lastMessageId);
        }
        
        // Start polling for new messages
        startMessagePolling();
      } else {
        console.error('Failed to start conversation:', data.message);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  }

  // Send message
  async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    console.log('Send message - conversationId:', conversationId);

    // Start conversation if not already started
    if (!conversationId) {
      console.log('No conversation ID, starting new conversation...');
      await startConversation();
      if (!conversationId) {
        console.error('Failed to start conversation');
        return;
      }
    }

    console.log('Sending message to conversation:', conversationId);

    // Add message to UI
    addMessage(message, 'customer');
    
    // Clear input
    messageInput.value = '';
    updateCharCount(0);
    updateSendButton(false);
    stopTyping();

    // Show typing indicator
    showTypingIndicator();

    try {
      const response = await fetch(`${baseUrl}/api/livechat/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          message: message,
          sender_type: 'customer'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('Message sent successfully');
        // Update last message ID to track our own sent message
        if (data.data && data.data.message_id) {
          lastMessageId = data.data.message_id;
          seenMessageIds.add(data.data.message_id); // Mark our own message as seen
          console.log('Updated lastMessageId after sending:', lastMessageId);
        }
        // Hide typing indicator
        hideTypingIndicator();
      } else {
        console.error('Failed to send message:', data.message);
        hideTypingIndicator();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      hideTypingIndicator();
    }
  }

  // Add message to chat
  function addMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.className = `rc-livechat-message ${sender}`;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageElement.innerHTML = `
      <div class="rc-livechat-message-bubble">${escapeHtml(message)}</div>
      <div class="rc-livechat-message-time">${timeString}</div>
    `;
    
    chatMessages.appendChild(messageElement);
    scrollToBottom();
  }

  // Show typing indicator
  function showTypingIndicator() {
    const { typingIndicator } = window.rcLiveChatElements;
    typingIndicator.style.display = 'flex';
    scrollToBottom();
  }

  // Hide typing indicator
  function hideTypingIndicator() {
    const { typingIndicator } = window.rcLiveChatElements;
    typingIndicator.style.display = 'none';
  }

  // Start typing
  function startTyping() {
    isTyping = true;
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      stopTyping();
    }, 1000);
  }

  // Stop typing
  function stopTyping() {
    isTyping = false;
    clearTimeout(typingTimer);
  }

  // Update character count
  function updateCharCount(count) {
    const { charCount } = window.rcLiveChatElements;
    charCount.textContent = `${count}/1000`;
  }

  // Update send button state
  function updateSendButton(enabled) {
    sendButton.disabled = !enabled;
  }

  // Scroll to bottom
  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Get customer name (placeholder)
  function getCustomerName() {
    return 'Customer';
  }

  // Get customer email (placeholder)
  function getCustomerEmail() {
    return null;
  }

  // Escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Show notification
  function showNotification(count) {
    const { notification } = window.rcLiveChatElements;
    if (count > 0) {
      notification.textContent = count > 99 ? '99+' : count;
      notification.style.display = 'flex';
    } else {
      notification.style.display = 'none';
    }
  }

  // Public API
  window.RCLiveChat = {
    open: openChat,
    close: closeChat,
    toggle: toggleChat,
    showNotification: showNotification,
    isOpen: () => isOpen
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
