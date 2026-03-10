// ================================
// PLAYER PROFESIONAL INMEDIATO
// ================================
const player = videojs('liveStream', {
    fluid: true,
    liveui: true,
    autoplay: true,
    muted: true
});

const overlay = document.getElementById("offlineOverlay");
let currentStreamUrl = null; // track del stream actual

function mostrarOverlay() { if (overlay) overlay.style.display = "flex"; }
function ocultarOverlay() { if (overlay) overlay.style.display = "none"; }

function cargarStream(url) {
    if (!url || url === currentStreamUrl) return; // no recargar si es el mismo
    currentStreamUrl = url;
    player.src({ src: url, type: 'application/x-mpegURL' });
    player.load();
}

// ================================
// CLICK CENTRAL PARA PAUSE/PLAY
// ================================
player.el().addEventListener('click', function (e) {
    // Solo si no clickeas sobre los controles
    if (!e.target.closest('.vjs-control')) {
        if (player.paused()) {
            player.play();
        } else {
            player.pause();
        }
    }
});

// ================================
// DETECTAR SUBDOMINIO Y CARGAR CONFIG
// ================================
window.addEventListener('load', () => {
    const host = window.location.hostname;
    const cliente = host.split('.')[0];

    fetch(`/clientes/${cliente}.json`)
    .then(res => {
        if (!res.ok) throw new Error("JSON no encontrado");
        return res.json();
    })
    .then(data => {
        // TITULOS Y LOGO
        const tituloPagina = document.getElementById("tituloPagina");
        const tituloEvento = document.getElementById("tituloEvento");
        const logoEmpresa = document.getElementById("logoEmpresa");

        if (tituloPagina) tituloPagina.textContent = data.nombre;
        if (tituloEvento) tituloEvento.textContent = data.nombre;
        if (logoEmpresa) logoEmpresa.src = `/logos/${data.logo}`;

        // AGENDA
        const agendaLista = document.getElementById("agendaLista");
        if (agendaLista && Array.isArray(data.agenda)) {
            agendaLista.innerHTML = "";
            data.agenda.forEach(item => {
                const li = document.createElement("li");
                li.textContent = item;
                agendaLista.appendChild(li);
            });
        }

        // CARGAR STREAM SOLO SI CAMBIA
        if (data.stream) cargarStream(data.stream);
    })
    .catch(err => {
        console.error("Error cargando JSON del cliente:", err);
        const tituloEvento = document.getElementById("tituloEvento");
        if (tituloEvento) tituloEvento.textContent = "Evento";
        const agendaLista = document.getElementById("agendaLista");
        if (agendaLista) agendaLista.innerHTML = "";
    });

    // ================================
    // EVENTOS DEL PLAYER
    // ================================
    player.on('playing', () => {
        console.log("Stream activo");
        ocultarOverlay();
    });

    player.on('error', () => {
        console.log("Stream error");
        player.error(null);
        mostrarOverlay();
    });

    player.on('waiting', () => {
        console.log("Stream esperando...");
        mostrarOverlay();
    });

    player.on('stalled', () => {
        console.log("Stream bloqueado...");
        mostrarOverlay();
    });

    // ================================
    // REINTENTO INTELIGENTE ULTRA RÁPIDO
    // ================================
    setInterval(() => {
        if (!currentStreamUrl) return;
        const stuck = player.readyState() < 3 || player.paused(); // <3 = buffer no listo
        if (stuck || player.error()) {
            console.log("Reconectando stream profesional...");
            cargarStream(currentStreamUrl);
        }
    }, 3000); // cada 3s si hay problema → reconexión rápida sin molestar

    // ================================
    // VIEWERS HEARTBEAT
    // ================================
    setInterval(() => {
        fetch('/stream/viewer_ping.php').catch(err => console.warn(err));
    }, 5000);
});