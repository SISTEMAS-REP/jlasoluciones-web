// DETECTAR SUBDOMINIO
const host = window.location.hostname;
const cliente = host.split('.')[0];

// CARGAR CONFIG DEL CLIENTE
fetch("/clientes/" + cliente + ".json")
.then(res => {
    if (!res.ok) throw new Error("JSON no encontrado");
    return res.json();
})
.then(data => {

    // Títulos y logo
    document.getElementById("tituloPagina").textContent = data.nombre;
    document.getElementById("tituloEvento").textContent = data.nombre;
    document.getElementById("logoEmpresa").src = "/logos/" + data.logo;

    // Crear agenda
    const agendaLista = document.getElementById("agendaLista");
    agendaLista.innerHTML = "";

    data.agenda.forEach(item => {
        let li = document.createElement("li");
        li.textContent = item;
        agendaLista.appendChild(li);
    });

    // INICIAR REPRODUCTOR
    const player = videojs('liveStream', {
        fluid: true,
        liveui: true,
        autoplay: true,
        muted: true
    });

    player.src({
        src: data.stream,
        type: 'application/x-mpegURL'
    });

    // ===== ERROR / OFFLINE =====
    player.on('error', function() {
        const offlineMsg = document.getElementById('offlineMsg');
        if (offlineMsg) {
            offlineMsg.innerHTML =
                "<div class='offline-message'>⚠️ La transmisión no está disponible.</div>";
        }
    });

    // ===== BOTÓN VOLVER AL DIRECTO =====
    player.on('timeupdate', function () {
        const btnLive = document.querySelector('.btn-live');
        if (!btnLive) return;

        if (player.liveTracker && !player.liveTracker.atLiveEdge()) {
            btnLive.style.display = "inline-block";
        } else {
            btnLive.style.display = "none";
        }
    });

    window.volverAlDirecto = function() {
        if (player.liveTracker) {
            player.liveTracker.seekToLiveEdge();
        }
    };

    // ===== VIEWERS HEARTBEAT =====
    setInterval(() => {
        fetch('/stream/viewer_ping.php');
    }, 5000);

})
.catch(err => {
    console.error(err);

    // Fallback si JSON no existe
    document.getElementById("tituloEvento").textContent = "Evento";

    const agendaLista = document.getElementById("agendaLista");
    if (agendaLista) agendaLista.innerHTML = "";
});