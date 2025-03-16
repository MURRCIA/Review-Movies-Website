const API_KEY = '17ad8714'; // Reemplaza con tu API Key
const API_URL = `http://www.omdbapi.com/?apikey=${API_KEY}`;

const detalleContainer = document.getElementById('detalle-container');

// Obtener el ID de la película de la URL
const urlParams = new URLSearchParams(window.location.search);
const peliculaId = urlParams.get('id');

// Función para obtener los detalles de la película
async function obtenerDetallePelicula(id) {
    try {
        const respuesta = await fetch(`${API_URL}&i=${id}`);
        const pelicula = await respuesta.json();

        if (pelicula.Response === 'True') {
            mostrarDetallePelicula(pelicula);
        } else {
            alert(pelicula.Error); // Muestra un mensaje de error
        }
    } catch (error) {
        console.error('Error al obtener los detalles:', error);
    }
}

// Función para mostrar los detalles de la película
function mostrarDetallePelicula(pelicula) {
    detalleContainer.innerHTML = `
        <h1>${pelicula.Title}</h1>
        <p class="lead">${pelicula.Year} • ${pelicula.Runtime} • ${pelicula.Genre}</p>
        <img src="${pelicula.Poster !== 'N/A' ? pelicula.Poster : 'https://via.placeholder.com/300x450'}" class="img-fluid mb-4">
        <p><strong>Director:</strong> ${pelicula.Director}</p>
        <p><strong>Actores:</strong> ${pelicula.Actors}</p>
        <p><strong>Sinopsis:</strong> ${pelicula.Plot}</p>
    `;
}

// Llamar a la función para obtener los detalles
obtenerDetallePelicula(peliculaId);