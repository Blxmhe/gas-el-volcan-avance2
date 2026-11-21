// js/index.js
// Conectado a MongoDB (Backend en http://localhost:5000)

const contenedorHome = document.getElementById("grid-productos");

function cargarDesdeMongo() {
  fetch('http://localhost:5000/api/productos')
    .then(response => {
      if (!response.ok) throw new Error('Error del servidor');
      return response.json();
    })
    .then(productos => {
      // Mostramos solo los primeros 4 productos como "destacados"
      renderizarDestacados(productos.slice(0, 4));
    })
    .catch(error => {
      console.error('Error al conectar con MongoDB:', error);
      contenedorHome.innerHTML = '<p class="text-danger">Error al conectar con la base de datos.</p>';
    });
}

function renderizarDestacados(productos) {
  let html = '';
  productos.forEach(function (producto) {
    const codigo = producto._id;
    const precio = producto.precios ? producto.precios.residencial : 0;
    const imagen = producto.imagen || 'sin-imagen.jpg';

    html += `
      <div class="tarjeta-producto">
        <img src="img/${imagen}" class="imagen-producto" alt="${producto.nombre}" onerror="this.style.display='none'">
        <h3>${producto.nombre}</h3>
        <p>$${precio}</p>
        <a class="btn-secundario" href="producto-detalle.html?codigo=${codigo}">Ver detalle</a>
        <button type="button" class="btn-primario" onclick="agregarAlCarrito('${codigo}', 1); actualizarContadorCarrito(); alert('Producto agregado al carrito');">Añadir</button>
      </div>
    `;
  });
  contenedorHome.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function() {
  cargarDesdeMongo();
});