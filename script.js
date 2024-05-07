let chistesMostrados = [];

document.getElementById('nuevoChisteBtn').addEventListener('click', function () {
    obtenerNuevoChiste();
});

// Función para mostrar el chiste
function mostrarChiste(data) {
    let chiste = data.joke;
    let categoria = data.category;

    // Verificar si el chiste devuelto no es undefined
    if (chiste !== undefined) {
        // Verificar si el chiste ya ha sido mostrado
        if (!chistesMostrados.includes(chiste)) {
            chistesMostrados.push(chiste);

            let numeroChiste = chistesMostrados.length;
            let active = (numeroChiste === 1) ? 'active' : '';
            let nuevoChiste = `<div class="carousel-item ${active}" id="chiste-${numeroChiste}"><div class="card"><div class="card-body"><h5 class="card-title">Chiste #${numeroChiste}</h5><p class="card-text">${chiste}</p><p class="card-text"><strong>Categoría:</strong> ${categoria}</p><button class="btn btn-primary enviarBtn" data-chiste="${chiste}" data-categoria="${categoria}" data-numero="${numeroChiste}">Enviar</button> <button class="btn btn-danger eliminarBtn" data-numero="${numeroChiste}">Eliminar</button></div></div></div>`;
            document.getElementById('chistes').innerHTML += nuevoChiste;

            // Traducir chiste al español
            traducirChiste(chiste, numeroChiste);

            // Agregar evento click al botón de enviar
            $('.enviarBtn').click(function () {
                let numeroChiste = $(this).data('numero');
                let chiste = $(this).data('chiste');
                let categoria = $(this).data('categoria');
                let traduccion = $(`#chiste-${numeroChiste} .card-text`).eq(1).text().replace('Traducción al español:', '').trim();
                console.log("ID del Chiste:", numeroChiste);
                console.log("Chiste:", chiste);
                console.log("Traducción al español:", traduccion);
                console.log("Categoría:", categoria);
            });

            // Agregar evento click al botón de eliminar
            $('.eliminarBtn').click(function () {
                let numeroChiste = $(this).data('numero');
                eliminarChiste(numeroChiste);
            });
        } else {
            // Si el chiste ya ha sido mostrado, obtener otro chiste nuevo
            obtenerNuevoChiste();
        }
    } else {
        // Si el chiste devuelto es undefined, obtener otro chiste nuevo
        obtenerNuevoChiste();
    }
}

// Función para traducir el chiste al español
function traducirChiste(chiste, numeroChiste) {
    fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=es&dt=t&q=${encodeURI(chiste)}`)
        .then(response => response.json())
        .then(data => mostrarTraduccion(data, numeroChiste))
        .catch(error => console.error('Error al traducir el chiste:', error));
}

// Función para mostrar la traducción del chiste
function mostrarTraduccion(data, numeroChiste) {
    let traduccion = "";
    for (let i = 0; i < data[0].length; i++) {
        traduccion += data[0][i][0];
    }
    if (traduccion !== undefined) {
        $(`#chiste-${numeroChiste} .card-text`).eq(0).after(`<p class="card-text"><strong>Traducción al español:</strong> ${traduccion}</p>`);
    }
}

// Función para eliminar un chiste
function eliminarChiste(numeroChiste) {
    $('#chiste-' + numeroChiste).remove();
    chistesMostrados.splice(numeroChiste - 1, 1);
}

// Función para obtener un nuevo chiste
function obtenerNuevoChiste() {
    fetch('https://v2.jokeapi.dev/joke/Any')
        .then(response => response.json())
        .then(data => mostrarChiste(data))
        .catch(error => mostrarError(error));
}

// Función para mostrar el error
function mostrarError(error) {
    document.getElementById('chistes').innerHTML += `<div class="col-md-6 offset-md-3 mb-3"><div class="alert alert-danger" role="alert">Ocurrió un error al obtener el chiste. Por favor, inténtalo de nuevo más tarde.</div></div>`;
}
