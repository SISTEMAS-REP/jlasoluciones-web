window.addEventListener('load', () => {
    const chatArea = document.getElementById('chatArea');
    if (!chatArea) return;

    const inputDiv = document.createElement('div');
    inputDiv.style.display = 'flex'; inputDiv.style.marginTop = '8px';

    const input = document.createElement('input');
    input.type='text'; input.placeholder='Escribe tu mensaje...';
    input.style.flex='1'; input.style.padding='8px'; input.style.borderRadius='8px';
    input.style.border='1px solid #ccc'; inputDiv.appendChild(input);

    const btn = document.createElement('button');
    btn.textContent='Enviar'; btn.style.marginLeft='8px'; btn.style.padding='8px 12px';
    btn.style.borderRadius='8px'; btn.style.border='none'; btn.style.background='#3b82f6';
    btn.style.color='#fff'; btn.style.cursor='pointer';
    inputDiv.appendChild(btn);

    chatArea.appendChild(inputDiv);

    const messagesContainer = document.createElement('div');
    messagesContainer.style.marginTop='8px'; messagesContainer.style.maxHeight='200px';
    messagesContainer.style.overflowY='auto'; chatArea.appendChild(messagesContainer);

    function addMessage(text,sender='Yo'){
        const msg = document.createElement('div');
        msg.textContent=`${sender}: ${text}`;
        msg.style.padding='4px 8px';
        msg.style.marginBottom='4px';
        msg.style.background='#f1f5f9';
        msg.style.borderRadius='6px';
        messagesContainer.appendChild(msg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    btn.addEventListener('click',()=>{ if(input.value.trim()==='') return; addMessage(input.value); input.value=''; });
    input.addEventListener('keypress',(e)=>{ if(e.key==='Enter') btn.click(); });
});