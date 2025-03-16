const API_KEY = '17ad8714'; // Reemplaza con tu API Key
const API_URL = `http://www.omdbapi.com/?apikey=${API_KEY}`;
const POSTER_URL = `http://img.omdbapi.com/?apikey=${API_KEY}`;

const buscadorForm = document.getElementById('buscador-form');
const buscadorInput = document.getElementById('buscador-input');
const peliculasContainer = document.getElementById('peliculas-container');
let paginaActual = 1;
let busquedaActual = '';

// Escuchar el evento de búsqueda
buscadorForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = buscadorInput.value.trim();

    if (query) {
        busquedaActual = query;
        paginaActual = 1;
        const peliculas = await buscarPeliculas(query);
        mostrarPeliculas(peliculas, true);
    }
});

// Función para buscar películas
async function buscarPeliculas(query, pagina = 1) {
    try {
        const respuesta = await fetch(`${API_URL}&s=${query}&page=${pagina}`);
        const datos = await respuesta.json();

        if (datos.Response === 'True') {
            return datos.Search;
        } else {
            mostrarMensajeError(datos.Error);
            return [];
        }
    } catch (error) {
        console.error('Error al buscar películas:', error);
        mostrarMensajeError('Error al buscar películas');
        return [];
    }
}

// Función para mostrar películas
function mostrarPeliculas(peliculas, limpiar = true) {
    if (limpiar) {
        peliculasContainer.innerHTML = '';
    }

    if (peliculas.length === 0 && limpiar) {
        peliculasContainer.innerHTML = `
            <div class="col-12 text-center">
                <h3>No se encontraron películas</h3>
            </div>
        `;
        return;
    }

    peliculas.forEach((pelicula, index) => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <div class="card h-100">
                <img src="${pelicula.Poster !== 'N/A' ? pelicula.Poster : 'https://via.placeholder.com/300x450'}" 
                     class="card-img-top" 
                     alt="${pelicula.Title}"
                     loading="lazy">
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

// Función para mostrar mensajes de error
function mostrarMensajeError(mensaje) {
    const alertaError = document.createElement('div');
    alertaError.className = 'alert alert-danger alert-dismissible fade show';
    alertaError.role = 'alert';
    alertaError.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.querySelector('.container').insertBefore(alertaError, peliculasContainer);

    setTimeout(() => {
        alertaError.remove();
    }, 5000);
}

// Cargar películas populares al inicio
document.addEventListener('DOMContentLoaded', async () => {
    const peliculasPopulares = await obtenerPeliculasPopulares(paginaActual);
    mostrarPeliculas(peliculasPopulares);
});

// Cargar más películas
document.getElementById('cargar-mas').addEventListener('click', async () => {
    paginaActual++;
    let nuevasPeliculas;
    
    if (busquedaActual) {
        nuevasPeliculas = await buscarPeliculas(busquedaActual, paginaActual);
    } else {
        nuevasPeliculas = await obtenerPeliculasPopulares(paginaActual);
    }
    
    mostrarPeliculas(nuevasPeliculas, false);
});

// Función para obtener películas populares
async function obtenerPeliculasPopulares(pagina) {
    const añoActual = new Date().getFullYear();
    try {
        const respuesta = await fetch(`${API_URL}&s=movie&type=movie&y=${añoActual}&page=${pagina}`);
        const datos = await respuesta.json();
        return datos.Response === 'True' ? datos.Search : [];
    } catch (error) {
        console.error('Error al obtener películas populares:', error);
        return [];
    }
}

// Implementar scroll infinito
let cargando = false;
window.addEventListener('scroll', async () => {
    if (cargando) return;

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
        cargando = true;
        paginaActual++;
        
        let nuevasPeliculas;
        if (busquedaActual) {
            nuevasPeliculas = await buscarPeliculas(busquedaActual, paginaActual);
        } else {
            nuevasPeliculas = await obtenerPeliculasPopulares(paginaActual);
        }
        
        mostrarPeliculas(nuevasPeliculas, false);
        cargando = false;
    }
});
