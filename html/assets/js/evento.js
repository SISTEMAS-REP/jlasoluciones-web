// ================================
// DETECTAR SUBDOMINIO
// ================================
window.addEventListener('load', () => {

    const host = window.location.hostname;
    const cliente = host.split('.')[0];

    // ================================
    // CARGAR CONFIG DEL CLIENTE
    // ================================
    fetch("/clientes/" + cliente + ".json")
    .then(res => {
        if (!res.ok) throw new Error("JSON no encontrado");
        return res.json();
    })
    .then(data => {

        // ===== TÍTULOS Y LOGO =====
        document.getElementById("tituloPagina").textContent = data.nombre;
        document.getElementById("tituloEvento").textContent = data.nombre;
        document.getElementById("logoEmpresa").src = "/logos/" + data.logo;

        // ===== AGENDA =====
        const agendaLista = document.getElementById("agendaLista");
        if (agendaLista) {
            agendaLista.innerHTML = "";
            data.agenda.forEach(item => {
                let li = document.createElement("li");
                li.textContent = item;
                agendaLista.appendChild(li);
            });
        }

        // ===== INICIAR REPRODUCTOR =====
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

        const btnLive = document.querySelector('.btn-live');
        const offlineMsg = document.getElementById('offlineMsg');

        console.log("btnLive encontrado:", btnLive);

        // ===== ERROR / OFFLINE =====
        player.on('error', function() {
            if (offlineMsg) {
                offlineMsg.innerHTML =
                    "<div class='offline-message'>🚫 La transmisión no está disponible.<br>Por favor intenta nuevamente más tarde.</div>";
            }
        });

        // ===== BOTÓN VOLVER AL DIRECTO =====
        player.on('timeupdate', function () {
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
            fetch('/stream/viewer_ping.php').catch(err => console.warn(err));
        }, 5000);

        console.log("estado btnLive:", btnLive);

    })
    .catch(err => {
        console.error(err);

        const titulo = document.getElementById("tituloEvento");
        if (titulo) titulo.textContent = "Evento";

        const agendaLista = document.getElementById("agendaLista");
        if (agendaLista) agendaLista.innerHTML = "";
    });

});