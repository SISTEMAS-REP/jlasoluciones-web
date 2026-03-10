// PLAYER PROFESIONAL
const player = videojs('liveStream',{
    fluid:true,
    liveui:true,
    autoplay:true,
    muted:true
});

// Selector de calidad
player.httpSourceSelector();

const overlay = document.getElementById("offlineOverlay");
const liveBadge = document.getElementById("liveBadge");
let currentStreamUrl = null;

// Overlay functions
function mostrarOverlay(){ if(overlay) overlay.style.display="flex"; }
function ocultarOverlay(){ if(overlay) overlay.style.display="none"; }

// Click central play/pause
player.el().addEventListener('click', function(e){
    if(!e.target.closest('.vjs-control')){
        if(player.paused()) player.play();
        else player.pause();
    }
});

// Cargar stream
function cargarStream(url){
    if(!url || url===currentStreamUrl) return;
    currentStreamUrl=url;
    player.src({src:url,type:'application/x-mpegURL'});
    player.load();
}

// Detectar subdominio y cargar JSON
window.addEventListener('load',()=>{
    const host=window.location.hostname;
    const cliente=host.split('.')[0];

    fetch(`/clientes/${cliente}.json`)
    .then(res=>{ if(!res.ok) throw new Error("JSON no encontrado"); return res.json(); })
    .then(data=>{
        const tituloPagina=document.getElementById("tituloPagina");
        const tituloEvento=document.getElementById("tituloEvento");
        const logoEmpresa=document.getElementById("logoEmpresa");

        if(tituloPagina) tituloPagina.textContent=data.nombre;
        if(tituloEvento) tituloEvento.textContent=data.nombre;
        if(logoEmpresa) logoEmpresa.src=`/logos/${data.logo}`;

        const agendaLista=document.getElementById("agendaLista");
        if(agendaLista && Array.isArray(data.agenda)){
            agendaLista.innerHTML="";
            data.agenda.forEach(item=>{
                const li=document.createElement("li"); li.textContent=item; agendaLista.appendChild(li);
            });
        }

        if(data.stream) cargarStream(data.stream);
    })
    .catch(err=>{
        console.error("Error cargando JSON:",err);
        document.getElementById("tituloEvento").textContent="Evento";
        document.getElementById("agendaLista").innerHTML="";
    });

    // Player events
    player.on('playing',()=>{ ocultarOverlay(); liveBadge.style.display="block"; });
    player.on('pause',()=>{ liveBadge.style.display="none"; });
    player.on('error',()=>{ mostrarOverlay(); player.error(null); });
    player.on('waiting',()=>{ mostrarOverlay(); });
    player.on('stalled',()=>{ mostrarOverlay(); });

    // Reconexión rápida
    setInterval(()=>{
        if(!currentStreamUrl) return;
        const stuck = player.readyState()<3 || player.paused();
        if(stuck || player.error()){ console.log("Reconectando stream..."); cargarStream(currentStreamUrl); }
    },3000);

    // Heartbeat
    setInterval(()=>{ fetch('/stream/viewer_ping.php').catch(err=>console.warn(err)); },5000);
});

// Hotkeys básicos
document.addEventListener('keydown',(e)=>{
    if(e.code==='Space'){ e.preventDefault(); if(player.paused()) player.play(); else player.pause(); }
    if(e.code==='KeyM'){ player.muted(!player.muted()); }
    if(e.code==='KeyF'){ if(player.isFullscreen()) player.exitFullscreen(); else player.requestFullscreen(); }
});