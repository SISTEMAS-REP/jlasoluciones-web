// detectar subdominio
const host = window.location.hostname;
const cliente = host.split('.')[0];

// cargar config del cliente
fetch("/clientes/" + cliente + ".json")
.then(res => res.json())
.then(data => {

document.getElementById("tituloPagina").textContent = data.nombre;
document.getElementById("tituloEvento").textContent = data.nombre;

document.getElementById("logoEmpresa").src = "/logos/" + data.logo;

// crear agenda
const agendaLista = document.getElementById("agendaLista");

data.agenda.forEach(item => {

let li = document.createElement("li");
li.textContent = item;

agendaLista.appendChild(li);

});

// iniciar reproductor
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

});