class AnimationManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.initBackgroundAnimation();
        this.initScrollAnimations();
        this.initHoverEffects();
        this.startFloatingHearts();
    }
    
    initBackgroundAnimation() {
        // Subtle gradient animation
        const appContainer = document.querySelector('.app-container');
        if (appContainer) {
            this.animateGradient();
        }
    }
    
    animateGradient() {
        let hue = 0;
        setInterval(() => {
            hue = (hue + 0.5) % 360;
            document.body.style.background = `
                linear-gradient(135deg, 
                hsl(${260 + Math.sin(hue * 0.01) * 20}, 70%, 65%) 0%, 
                hsl(${290 + Math.cos(hue * 0.01) * 15}, 60%, 70%) 100%)`;
        }, 100);
    }
    
    initScrollAnimations() {
        // Add scroll-based animations for messages
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'messageSlideIn 0.4s ease-out';
                }
            });
        }, { threshold: 0.1 });
        
        // Observe existing messages
        document.querySelectorAll('.message-bubble').forEach(message => {
            observer.observe(message);
        });
        
        // Observer for new messages (mutation observer)
        const chatMessages = document.getElementById('chatMessages');
        const messageObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && 
                        node.classList.contains('message-bubble')) {
                        observer.observe(node);
                    }
                });
            });
        });
        
        messageObserver.observe(chatMessages, { childList: true });
    }
    
    initHoverEffects() {
        // Add sparkle effect to buttons
        document.querySelectorAll('.send-btn, .action-btn').forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.createSparkles(button);
            });
        });
        
        // Message bubble hover effects
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.message-bubble')) {
                const bubble = e.target.closest('.message-bubble');
                bubble.style.transform = 'translateY(-2px)';
                bubble.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('.message-bubble')) {
                const bubble = e.target.closest('.message-bubble');
                bubble.style.transform = 'translateY(0)';
                bubble.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }
        });
    }
    
    createSparkles(element) {
        const sparkles = ['✨', '💫', '⭐', '🌟'];
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
                sparkle.style.position = 'absolute';
                sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
                sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
                sparkle.style.fontSize = '12px';
                sparkle.style.pointerEvents = 'none';
                sparkle.style.zIndex = '1000';
                sparkle.style.animation = 'sparkle 1s ease-out forwards';
                
                document.body.appendChild(sparkle);
                
                setTimeout(() => sparkle.remove(), 1000);
            }, i * 100);
        }
    }
    
    startFloatingHearts() {
        const heartsContainer = document.getElementById('floatingHearts');
        const heartTypes = ['💕', '💖', '🌸', '✨'];
        
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance every interval
                const heart = document.createElement('div');
                heart.className = 'heart';
                heart.textContent = heartTypes[Math.floor(Math.random() * heartTypes.length)];
                heart.style.left = Math.random() * 100 + '%';
                heart.style.fontSize = (Math.random() * 8 + 12) + 'px';
                heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
                heart.style.opacity = Math.random() * 0.4 + 0.2;
                
                heartsContainer.appendChild(heart);
                
                setTimeout(() => heart.remove(), 8000);
            }
        }, 3000);
    }
    
    // Method to trigger celebration animation
    triggerCelebration() {
        const celebrationEmojis = ['🎉', '🎊', '💖', '✨', '🌟', '💕', '🦋'];
        const container = document.body;
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const emoji = document.createElement('div');
                emoji.textContent = celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)];
                emoji.style.position = 'fixed';
                emoji.style.left = Math.random() * window.innerWidth + 'px';
                emoji.style.top = '-50px';
                emoji.style.fontSize = (Math.random() * 15 + 20) + 'px';
                emoji.style.pointerEvents = 'none';
                emoji.style.zIndex = '1000';
                emoji.style.animation = `celebration 3s ease-out forwards`;
                
                container.appendChild(emoji);
                
                setTimeout(() => emoji.remove(), 3000);
            }, i * 100);
        }
    }
    
    // Pulse animation for notifications
    pulseElement(element) {
        element.style.animation = 'pulse 0.6s ease-in-out 2';
    }
}

// Add CSS animations via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        50% {
            transform: scale(1) rotate(180deg);
            opacity: 0.8;
        }
        100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes celebration {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        50% {
            opacity: 0.8;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize animations when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AnimationManager();
});