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

        // ================================
        // TITULOS Y LOGO
        // ================================
        document.getElementById("tituloPagina").textContent = data.nombre;
        document.getElementById("tituloEvento").textContent = data.nombre;
        document.getElementById("logoEmpresa").src = "/logos/" + data.logo;


        // ================================
        // AGENDA
        // ================================
        const agendaLista = document.getElementById("agendaLista");

        if (agendaLista) {

            agendaLista.innerHTML = "";

            data.agenda.forEach(item => {

                let li = document.createElement("li");

                li.textContent = item;

                agendaLista.appendChild(li);

            });

        }


        // ================================
        // INICIAR PLAYER
        // ================================
        const player = videojs('liveStream', {

            fluid: true,
            liveui: true,
            autoplay: true,
            muted: true

        });

        const overlay = document.getElementById("offlineOverlay");


        function cargarStream(){

            player.src({

                src: data.stream,
                type: 'application/x-mpegURL'

            });

        }

        cargarStream();


        // ================================
        // CUANDO EMPIEZA STREAM
        // ================================
        player.on('playing', function(){

            console.log("stream activo");

            if(overlay){

                overlay.style.display = "none";

            }

        });


        // ================================
        // STREAM OFF
        // ================================
        player.on('error', function(){

            console.log("stream offline");

            // ELIMINA ERROR DE VIDEO.JS
            player.error(null);

            if(overlay){

                overlay.style.display = "flex";

            }

        });


        // ================================
        // REINTENTAR CADA 15s
        // ================================
        setInterval(() => {

            if (player.paused() || player.error()) {

                console.log("intentando reconectar stream");

                cargarStream();

                player.load();

            }

        },15000);


        // ================================
        // VIEWERS HEARTBEAT
        // ================================
        setInterval(() => {

            fetch('/stream/viewer_ping.php')

            .catch(err => console.warn(err));

        },5000);


    })

    .catch(err => {

        console.error(err);

        const titulo = document.getElementById("tituloEvento");

        if (titulo) titulo.textContent = "Evento";

        const agendaLista = document.getElementById("agendaLista");

        if (agendaLista) agendaLista.innerHTML = "";

    });

});