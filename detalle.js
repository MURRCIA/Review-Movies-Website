const API_KEY = '17ad8714'; // Reemplaza con tu API Key
const API_URL = `http://www.omdbapi.com/?apikey=${API_KEY}`;

// Obtener el ID de la película de la URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

// Función para cargar los detalles de la película
async function cargarDetallesPelicula() {
    try {
        const response = await fetch(`${API_URL}&i=${movieId}&plot=full`);
        const pelicula = await response.json();

        if (pelicula.Response === 'True') {
            // Actualizar el título de la página
            document.title = `${pelicula.Title} - Cine Murcia`;

            // Actualizar la información de la película
            document.getElementById('movie-poster').src = pelicula.Poster !== 'N/A' ? pelicula.Poster : 'https://via.placeholder.com/300x450';
            document.getElementById('movie-poster').alt = pelicula.Title;
            document.getElementById('movie-title').textContent = pelicula.Title;
            document.getElementById('movie-year').textContent = pelicula.Year;
            document.getElementById('movie-runtime').textContent = pelicula.Runtime;
            document.getElementById('movie-genre').textContent = pelicula.Genre;
            document.getElementById('movie-plot').textContent = pelicula.Plot;
            document.getElementById('movie-director').textContent = pelicula.Director;
            document.getElementById('movie-actors').textContent = pelicula.Actors;
            document.getElementById('movie-rating').textContent = `${pelicula.imdbRating}/10`;
            document.getElementById('movie-country').textContent = pelicula.Country;

            // Añadir animación de fade-in
            document.querySelector('.movie-info').style.opacity = '0';
            setTimeout(() => {
                document.querySelector('.movie-info').style.opacity = '1';
            }, 100);
        } else {
            alert('No se encontró la película');
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Error al cargar los detalles:', error);
        alert('Error al cargar los detalles de la película');
    }
}

// Cargar los detalles cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    if (movieId) {
        cargarDetallesPelicula();
    } else {
        alert('ID de película no proporcionado');
        window.location.href = 'index.html';
    }
});