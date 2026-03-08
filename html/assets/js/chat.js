// TABS
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const tabId = btn.dataset.tab;
        document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
    });
});

// CHAT SIMPLE FRONT-END
const chatInput = document.getElementById('chatText');
const chatBtn = document.getElementById('sendChat');
const chatMessages = document.getElementById('chatMessages');

chatBtn.addEventListener('click', () => {
    const text = chatInput.value.trim();
    if(text) {
        const div = document.createElement('div');
        div.textContent = text;
        chatMessages.appendChild(div);
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') chatBtn.click();
});