// js/productos.js
// Conectado a MongoDB (Backend en http://localhost:5000)

const contenedor = document.getElementById("grid-productos");

function cargarDesdeMongo() {
  fetch('http://localhost:5000/api/productos')
    .then(response => {
      if (!response.ok) throw new Error('Error del servidor');
      return response.json();
    })
    .then(productos => {
      renderizarProductos(productos);
    })
    .catch(error => {
      console.error('Error al conectar con MongoDB:', error);
      contenedor.innerHTML = '<p class="text-danger">Error al conectar con la base de datos.</p>';
    });
}

function renderizarProductos(productos) {
  let html = '';
  productos.forEach(function (producto) {
    // Adaptamos los datos de MongoDB
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
  contenedor.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function() {
  cargarDesdeMongo();
});