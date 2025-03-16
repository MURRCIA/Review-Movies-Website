const API_KEY = '17ad8714'; // Reemplaza con tu API Key
const API_URL = `http://www.omdbapi.com/?apikey=${API_KEY}`;
const POSTER_URL = `http://img.omdbapi.com/?apikey=${API_KEY}`;

const buscadorForm = document.getElementById('buscador-form');
const buscadorInput = document.getElementById('buscador-input');
const peliculasContainer = document.getElementById('peliculas-container');

// Escuchar el evento de búsqueda
buscadorForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evitar que el formulario se envíe
    const query = buscadorInput.value.trim();

    if (query) {
        const peliculas = await buscarPeliculas(query);
        mostrarPeliculas(peliculas);
    }
});

// Función para buscar películas
async function buscarPeliculas(query) {
    try {
        const respuesta = await fetch(`${API_URL}&s=${query}`);
        const datos = await respuesta.json();

        if (datos.Response === 'True') {
            return datos.Search; // Retorna los resultados de búsqueda
        } else {
            alert(datos.Error); // Muestra un mensaje de error
            return [];
        }
    } catch (error) {
        console.error('Error al buscar películas:', error);
        return [];
    }
}

// Función para mostrar películas
function mostrarPeliculas(peliculas) {
    peliculasContainer.innerHTML = ''; // Limpiar el contenedor

    peliculas.forEach(pelicula => {
        const card = document.createElement('div');
        card.className = 'col-12 col-sm-6 col-md-4 mb-4';

        card.innerHTML = `
            <div class="card h-100">
                <img src="${pelicula.Poster !== 'N/A' ? pelicula.Poster : 'https://via.placeholder.com/300x450'}" class="card-img-top" alt="${pelicula.Title}">
                <div class="card-body">
                    <h5 class="card-title">${pelicula.Title}</h5>
                    <p class="text-muted">${pelicula.Year} • ${pelicula.Type}</p>
                    <a href="detalle.html?id=${pelicula.imdbID}" class="btn btn-primary">Ver Detalle</a>
                </div>
            </div>
        `;

        peliculasContainer.appendChild(card);
    });
}

// app.js - Mostrar películas populares al inicio
let paginaActual = 1; // Control de paginación

document.addEventListener("DOMContentLoaded", async () => {
    const peliculasPopulares = await obtenerPeliculasPopulares(paginaActual);
    mostrarPeliculas(peliculasPopulares);
});

document.getElementById("cargar-mas").addEventListener("click", async () => {
    paginaActual++;
    const peliculasAdicionales = await obtenerPeliculasPopulares(paginaActual);
    mostrarPeliculas(peliculasAdicionales, false); // No limpiar contenedor
});

async function obtenerPeliculasPopulares(pagina) {
    const añoActual = new Date().getFullYear(); // Obtener el año actual
    try {
        const respuesta = await fetch(`${API_URL}&s=movie&type=movie&y=${2024}&page=${pagina}`);
        const datos = await respuesta.json();
        return datos.Response === 'True' ? datos.Search : [];
    } catch (error) {
        console.error('Error al obtener películas populares:', error);
        return [];
    }
}

// Función para mostrar películas con opción de agregar más sin borrar
function mostrarPeliculas(peliculas, limpiar = true) {
    if (limpiar) peliculasContainer.innerHTML = ""; // Limpiar solo si es la primera carga

    peliculas.forEach(pelicula => {
        const card = document.createElement('div');
        card.className = 'col-12 col-sm-6 col-md-4 mb-4';

        card.innerHTML = `
            <div class="card h-100">
                <img src="${pelicula.Poster !== 'N/A' ? pelicula.Poster : 'https://via.placeholder.com/300x450'}" class="card-img-top" alt="${pelicula.Title}">
                <div class="card-body">
                    <h5 class="card-title">${pelicula.Title}</h5>
                    <p class="text-muted">${pelicula.Year} • ${pelicula.Type}</p>
                    <a href="detalle.html?id=${pelicula.imdbID}" class="btn btn-primary">Ver Detalle</a>
                </div>
            </div>
        `;

        peliculasContainer.appendChild(card);
    });
}
