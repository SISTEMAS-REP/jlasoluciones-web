window.addEventListener('load', ()=>{
    const recordingsList = document.getElementById('recordingsList');
    const materialsList = document.getElementById('materialsList');

    // Ejemplo estático (después lo puedes cargar desde JSON)
    const grabaciones = ['Grabación 1', 'Grabación 2', 'Grabación 3'];
    const materiales = ['Slide 1', 'PDF Manual', 'Documento extra'];

    grabaciones.forEach(r=>{
        const li = document.createElement('li'); li.textContent=r; recordingsList.appendChild(li);
    });

    materiales.forEach(m=>{
        const li = document.createElement('li'); li.textContent=m; materialsList.appendChild(li);
    });

    // Tabs funcionales
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(btn=>{
        btn.addEventListener('click',()=>{
            tabButtons.forEach(b=>b.classList.remove('active'));
            btn.classList.add('active');

            document.querySelectorAll('.tab-content').forEach(tc=>tc.style.display='none');
            const tabId = btn.dataset.tab;
            document.getElementById(tabId).style.display='block';
        });
    });
});