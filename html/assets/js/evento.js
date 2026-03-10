// ================================
// PLAYER PROFESIONAL COMPLETO
// ================================
const player = videojs('liveStream', {
    fluid: true,
    liveui: true,
    autoplay: true,
    muted: true
});

// Plugin selector de calidad (HLS)
if(player.httpSourceSelector) player.httpSourceSelector();

const overlay = document.getElementById("offlineOverlay");
const liveBadge = document.getElementById("liveBadge");
const brandingLogo = document.getElementById("brandingLogo");
const floatingChat = document.getElementById("floatingChat");
const viewerCount = document.getElementById("viewerCount");
const reconnectAlert = document.getElementById("reconnectAlert");

let currentStreamUrl = null;

// ================================
// FUNCIONES OVERLAY / ALERT
// ================================
function mostrarOverlay() { if(overlay) overlay.style.display="flex"; }
function ocultarOverlay() { if(overlay) overlay.style.display="none"; }
function showReconnectAlert(){
    if(!reconnectAlert) return;
    reconnectAlert.style.display='block';
    setTimeout(()=> reconnectAlert.style.display='none', 3000);
}

// ================================
// CHAT FLOTANTE
// ================================
function addFloatingMessage(msg, sender='Yo'){
    if(!floatingChat) return;
    const div = document.createElement('div');
    div.textContent = `${sender}: ${msg}`;
    div.style.marginBottom='4px';
    floatingChat.appendChild(div);
    floatingChat.scrollTop = floatingChat.scrollHeight;
}

// ================================
// VIEWER COUNT
// ================================
function updateViewers(count){
    if(!viewerCount) return;
    viewerCount.textContent = `${count} espectadores`;
}

// ================================
// CARGAR STREAM
// ================================
function cargarStream(url){
    if(!url || url===currentStreamUrl) return;
    currentStreamUrl = url;
    player.src({src: url, type:'application/x-mpegURL'});
    player.load();
}

// ================================
// CLICK CENTRAL PLAY/PAUSE
// ================================
player.el().addEventListener('click', function(e){
    if(!e.target.closest('.vjs-control')){
        if(player.paused()) player.play();
        else player.pause();
    }
});

// ================================
// DETECTAR SUBDOMINIO Y CARGAR JSON
// ================================
window.addEventListener('load', ()=>{
    const host = window.location.hostname;
    const cliente = host.split('.')[0];

    fetch(`/clientes/${cliente}.json`)
    .then(res=>{ if(!res.ok) throw new Error("JSON no encontrado"); return res.json(); })
    .then(data=>{
        // TITULOS Y LOGO
        const tituloPagina = document.getElementById("tituloPagina");
        const tituloEvento = document.getElementById("tituloEvento");
        const logoEmpresa = document.getElementById("logoEmpresa");

        if(tituloPagina) tituloPagina.textContent = data.nombre;
        if(tituloEvento) tituloEvento.textContent = data.nombre;
        if(logoEmpresa) logoEmpresa.src = `/logos/${data.logo}`;

        // AGENDA
        const agendaLista = document.getElementById("agendaLista");
        if(agendaLista && Array.isArray(data.agenda)){
            agendaLista.innerHTML="";
            data.agenda.forEach(item=>{
                const li=document.createElement("li");
                li.textContent=item;
                agendaLista.appendChild(li);
            });
        }

        // STREAM
        if(data.stream) cargarStream(data.stream);
    })
    .catch(err=>{
        console.error("Error cargando JSON del cliente:",err);
        const tituloEvento = document.getElementById("tituloEvento");
        if(tituloEvento) tituloEvento.textContent="Evento";
        const agendaLista = document.getElementById("agendaLista");
        if(agendaLista) agendaLista.innerHTML="";
    });

    // ================================
    // EVENTOS PLAYER
    // ================================
    player.on('playing', ()=>{
        ocultarOverlay();
        if(liveBadge) liveBadge.style.display='block';
    });
    player.on('pause', ()=>{
        if(liveBadge) liveBadge.style.display='none';
    });
    player.on('error', ()=>{
        mostrarOverlay();
        player.error(null);
        showReconnectAlert();
    });
    player.on('waiting', ()=>{ mostrarOverlay(); });
    player.on('stalled', ()=>{ mostrarOverlay(); });

    // ================================
    // RECONEXIÓN INTELIGENTE
    // ================================
    setInterval(()=>{
        if(!currentStreamUrl) return;
        const stuck = player.readyState()<3 || player.paused();
        if(stuck || player.error()){
            console.log("Reconectando stream...");
            showReconnectAlert();
            cargarStream(currentStreamUrl);
        }
    },3000);

    // ================================
    // HEARTBEAT / VIEWERS
    // ================================
    setInterval(()=>{
        fetch('/stream/viewer_ping.php').catch(err=>console.warn(err));
        fetch('/stream/viewer_count.php')
        .then(r=>r.json())
        .then(d=>updateViewers(d.count))
        .catch(()=>{});
    },5000);
});

// ================================
// HOTKEYS
// ================================
document.addEventListener('keydown',(e)=>{
    if(e.code==='Space'){ e.preventDefault(); if(player.paused()) player.play(); else player.pause(); }
    if(e.code==='KeyM'){ player.muted(!player.muted()); }
    if(e.code==='KeyF'){ if(player.isFullscreen()) player.exitFullscreen(); else player.requestFullscreen(); }
});

// ================================
// CHAT FLOTANTE DESDE EVENTO EXTERNO
// ================================
window.addEventListener('message', e=>{
    if(e.data && e.data.chatMsg) addFloatingMessage(e.data.chatMsg, e.data.sender||'Usuario');
});