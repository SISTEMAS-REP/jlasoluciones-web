// ================================
// INICIAR PLAYER INMEDIATAMENTE
// ================================
const player = videojs('liveStream', {
    fluid: true,
    liveui: true,
    autoplay: true,
    muted: true
});

const overlay = document.getElementById("offlineOverlay");

// Función para cargar o recargar el stream
function cargarStream(url) {
    if (!url) return;
    player.src({
        src: url,
        type: 'application/x-mpegURL'
    });
    player.load();
}

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
        // ================================
        // ACTUALIZAR TITULOS Y LOGO
        // ================================
        const tituloPagina = document.getElementById("tituloPagina");
        const tituloEvento = document.getElementById("tituloEvento");
        const logoEmpresa = document.getElementById("logoEmpresa");

        if (tituloPagina) tituloPagina.textContent = data.nombre;
        if (tituloEvento) tituloEvento.textContent = data.nombre;
        if (logoEmpresa) logoEmpresa.src = `/logos/${data.logo}`;

        // ================================
        // ACTUALIZAR AGENDA
        // ================================
        const agendaLista = document.getElementById("agendaLista");
        if (agendaLista && Array.isArray(data.agenda)) {
            agendaLista.innerHTML = "";
            data.agenda.forEach(item => {
                const li = document.createElement("li");
                li.textContent = item;
                agendaLista.appendChild(li);
            });
        }

        // ================================
        // CARGAR STREAM
        // ================================
        if (data.stream) {
            cargarStream(data.stream);
        }
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
        if (overlay) overlay.style.display = "none";
    });

    player.on('error', () => {
        console.log("Stream offline");
        player.error(null); // limpia el error de Video.js
        if (overlay) overlay.style.display = "flex";
    });

    // ================================
    // REINTENTAR CONEXIÓN SOLO SI FALLA STREAM
    // ================================
    setInterval(() => {
        const tech = player.tech({ IWillNotUseThisInPlugins: true });
        const currentSrc = player.src() ? player.src().src : null;

        // Solo recarga si hay error o si el stream está detenido
        if ((player.error()) || (player.paused() && player.currentTime() > 0 && !player.ended())) {
            console.log("Intentando reconectar stream");
            if (currentSrc) cargarStream(currentSrc);
        }
    }, 15000);

    // ================================
    // VIEWERS HEARTBEAT
    // ================================
    setInterval(() => {
        fetch('/stream/viewer_ping.php').catch(err => console.warn(err));
    }, 5000);
});