class ChatApp {
    constructor() {
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendBtn');
        this.chatMessages = document.getElementById('chatMessages');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.charCount = document.getElementById('charCount');
        this.emojiBtn = document.getElementById('emojiBtn');
        
        this.isTyping = false;
        this.messageHistory = [];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateCharCount();
        this.loadChatHistory();
        
        // Focus input on load
        setTimeout(() => {
            this.messageInput.focus();
        }, 500);
    }
    
    bindEvents() {
        // Message input events
        this.messageInput.addEventListener('input', () => {
            this.updateCharCount();
            this.toggleSendButton();
            this.autoResize();
        });
        
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Send button
        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });
        
        // Emoji button
        this.emojiBtn.addEventListener('click', () => {
            this.insertEmoji();
        });
        
        // Settings button
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.showSettings();
        });
    }
    
    updateCharCount() {
        const currentLength = this.messageInput.value.length;
        this.charCount.textContent = currentLength;
        
        // Color code based on length
        if (currentLength > 900) {
            this.charCount.style.color = '#e74c3c';
        } else if (currentLength > 800) {
            this.charCount.style.color = '#f39c12';
        } else {
            this.charCount.style.color = '#7f8c8d';
        }
    }
    
    toggleSendButton() {
        const hasText = this.messageInput.value.trim().length > 0;
        this.sendButton.disabled = !hasText || this.isTyping;
    }
    
    autoResize() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isTyping) return;
        
        // Clear input and update UI
        this.messageInput.value = '';
        this.updateCharCount();
        this.toggleSendButton();
        this.autoResize();
        
        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Show typing indicator
        this.showTyping();
        
        try {
            // Send message to backend
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            
            // Hide typing indicator
            this.hideTyping();
            
            // Add AI response
            this.addMessage(data.response, 'ai');
            
            // Save to history
            this.saveToHistory(message, data.response);
            
            // Trigger heart animation for positive messages
            this.triggerHeartAnimation();
            
        } catch (error) {
            console.error('Error sending message:', error);
            this.hideTyping();
            this.addMessage('I\'m sorry, something went wrong. Please try again! 💕', 'ai', true);
        }
    }
    
    addMessage(content, sender, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-bubble ${sender}`;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
        
        messageDiv.innerHTML = `
            <div class="message-content">${this.formatMessage(content)}</div>
            <div class="message-time">${timeString}</div>
        `;
        
        if (isError) {
            messageDiv.classList.add('error');
        }
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    formatMessage(message) {
        // Convert basic emojis and add some formatting
        return message
            .replace(/:\)/g, '😊')
            .replace(/:\(/g, '😢')
            .replace(/<3/g, '💖')
            .replace(/\n/g, '<br>');
    }
    
    showTyping() {
        this.isTyping = true;
        this.typingIndicator.style.display = 'flex';
        this.toggleSendButton();
        this.scrollToBottom();
    }
    
    hideTyping() {
        this.isTyping = false;
        this.typingIndicator.style.display = 'none';
        this.toggleSendButton();
    }
    
    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }
    
    insertEmoji() {
        const emojis = ['😊', '😍', '🥰', '💖', '💕', '🌸', '✨', '🌟', '💫', '🦋'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        
        const cursorPos = this.messageInput.selectionStart;
        const textBefore = this.messageInput.value.substring(0, cursorPos);
        const textAfter = this.messageInput.value.substring(cursorPos);
        
        this.messageInput.value = textBefore + randomEmoji + textAfter;
        this.messageInput.selectionStart = cursorPos + randomEmoji.length;
        this.messageInput.selectionEnd = cursorPos + randomEmoji.length;
        
        this.updateCharCount();
        this.toggleSendButton();
        this.messageInput.focus();
    }
    
    triggerHeartAnimation() {
        const heartsContainer = document.getElementById('floatingHearts');
        const heartEmojis = ['💖', '💕', '💗', '💓', '💝', '🌸', '✨'];
        
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'heart';
                heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
                heart.style.left = Math.random() * 100 + '%';
                heart.style.animationDelay = Math.random() * 2 + 's';
                heart.style.fontSize = (Math.random() * 10 + 15) + 'px';
                
                heartsContainer.appendChild(heart);
                
                // Remove heart after animation
                setTimeout(() => {
                    heart.remove();
                }, 6000);
            }, i * 200);
        }
    }
    
    saveToHistory(userMessage, aiResponse) {
        const historyItem = {
            userMessage,
            aiResponse,
            timestamp: new Date().toISOString()
        };
        
        this.messageHistory.push(historyItem);
        // localStorage.setItem('chatHistory', JSON.stringify(this.messageHistory));
    }
    
    loadChatHistory() {
        const saved = localStorage.getItem('chatHistory');
        if (saved) {
            try {
                this.messageHistory = JSON.parse(saved);
                // Load last 5 messages
                const recentMessages = this.messageHistory.slice(-5);
                recentMessages.forEach(item => {
                    this.addMessage(item.userMessage, 'user');
                    this.addMessage(item.aiResponse, 'ai');
                });
            } catch (error) {
                console.error('Error loading chat history:', error);
            }
        }
    }
    
    showSettings() {
        // Simple settings modal (could be expanded)
        const settings = prompt('Settings:\n\n1. Clear chat history\n2. Change theme\n\nEnter your choice (1 or 2):');
        
        if (settings === '1') {
            if (confirm('Are you sure you want to clear all chat history?')) {
                localStorage.removeItem('chatHistory');
                this.messageHistory = [];
                // Reload page to clear messages
                location.reload();
            }
        } else if (settings === '2') {
            alert('Theme customization coming soon! 💖');
        }
    }
}

// Initialize the chat app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
});