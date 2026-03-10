window.addEventListener('load', () => {
    const chatArea = document.getElementById('floatingChat');
    if (!chatArea) return;

    // ================================
    // ESTILO FLUOTANTE
    // ================================
    chatArea.style.position = 'fixed';
    chatArea.style.bottom = '12px';
    chatArea.style.right = '12px';
    chatArea.style.width = '300px';
    chatArea.style.maxHeight = '50%';
    chatArea.style.background = 'rgba(0,0,0,0.55)';
    chatArea.style.color = '#fff';
    chatArea.style.borderRadius = '12px';
    chatArea.style.padding = '8px';
    chatArea.style.display = 'flex';
    chatArea.style.flexDirection = 'column-reverse';
    chatArea.style.zIndex = '1000';
    chatArea.style.overflow = 'hidden';
    chatArea.style.fontSize = '13px';

    // contenedor de mensajes
    const messagesContainer = document.createElement('div');
    messagesContainer.style.flex = '1';
    messagesContainer.style.overflowY = 'auto';
    messagesContainer.style.display = 'flex';
    messagesContainer.style.flexDirection = 'column-reverse';
    messagesContainer.style.padding = '4px 0';
    chatArea.appendChild(messagesContainer);

    // input + botón enviar
    const inputDiv = document.createElement('div');
    inputDiv.style.display = 'flex';
    inputDiv.style.marginTop = '4px';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Escribe tu mensaje...';
    input.style.flex = '1';
    input.style.padding = '6px 8px';
    input.style.borderRadius = '6px';
    input.style.border = '1px solid rgba(255,255,255,0.4)';
    input.style.background = 'rgba(0,0,0,0.3)';
    input.style.color = '#fff';
    inputDiv.appendChild(input);

    const btn = document.createElement('button');
    btn.textContent = 'Enviar';
    btn.style.marginLeft = '6px';
    btn.style.padding = '6px 10px';
    btn.style.borderRadius = '6px';
    btn.style.border = 'none';
    btn.style.background = '#3b82f6';
    btn.style.color = '#fff';
    btn.style.cursor = 'pointer';
    inputDiv.appendChild(btn);

    chatArea.appendChild(inputDiv);

    // ================================
    // FUNCION AGREGAR MENSAJE
    // ================================
    function addMessage(msg, sender='Yo'){
        const div = document.createElement('div');
        div.textContent = `${sender}: ${msg}`;
        div.style.margin = '2px 0';
        div.style.padding = '4px 6px';
        div.style.background = 'rgba(255,255,255,0.1)';
        div.style.borderRadius = '6px';
        messagesContainer.insertBefore(div, messagesContainer.firstChild);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // enviar mensaje
    btn.addEventListener('click', () => {
        if(input.value.trim() === '') return;
        addMessage(input.value);
        input.value = '';
    });

    input.addEventListener('keypress', e => {
        if(e.key === 'Enter') btn.click();
    });

    // recibir mensaje externo
    window.addEventListener('message', e => {
        if(e.data && e.data.chatMsg) addMessage(e.data.chatMsg, e.data.sender || 'Usuario');
    });
});