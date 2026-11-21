function obtenerCodigoURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('codigo');
}

function cargarDetalle() {
  const codigo = obtenerCodigoURL();
  if (!codigo) return;
  fetch(`http://localhost:5000/api/productos/${codigo}`)
    .then(res => res.json())
    .then(p => renderizarDetalle(p))
    .catch(err => console.error(err));
}

function renderizarDetalle(p) {
  const precio = p.precios ? p.precios.residencial : 0;
  const imagen = p.imagen || 'sin-imagen.jpg';
  document.getElementById('detalleProducto').innerHTML = `
    <div class="detalle-producto-container">
      <img src="img/${imagen}" class="imagen-producto-grande" alt="${p.nombre}">
      <div class="detalle-info">
        <h2>${p.nombre}</h2>
        <p><strong>Código:</strong> ${p._id}</p>
        <p><strong>Precio:</strong> $${precio}</p>
        <p><strong>Stock:</strong> ${p.stock}</p>
        <p><strong>Descripción:</strong> ${p.descripcion || 'Sin descripción'}</p>
        <div id="formEdicion" style="display:none; border:1px solid #ccc; padding:15px; margin-top:10px;">
          <h3>Editar producto</h3>
          <input type="text" id="editNombre" value="${p.nombre}"><br>
          <input type="number" id="editPrecio" value="${precio}"><br>
          <input type="number" id="editStock" value="${p.stock}"><br>
          <button onclick="guardarCambios('${p._id}')">Guardar</button>
          <button onclick="toggleEdicion()">Cancelar</button>
        </div>
        <button class="btn-secundario" onclick="toggleEdicion()">✏️ Editar</button>
      </div>
    </div>
  `;
}

function toggleEdicion() {
  const f = document.getElementById('formEdicion');
  f.style.display = (f.style.display === 'none') ? 'block' : 'none';
}

function guardarCambios(codigo) {
  const nuevosDatos = {
    "nombre": document.getElementById('editNombre').value,
    "precios.residencial": Number(document.getElementById('editPrecio').value),
    "stock": Number(document.getElementById('editStock').value)
  };

  fetch(`http://localhost:5000/api/productos/${codigo}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevosDatos)
  })
  .then(res => {
    // Si la respuesta es 200 (OK), asumimos éxito
    if (res.ok) {
      alert('✅ ¡Producto actualizado con éxito!');
      location.reload(); // Recarga la página para mostrar los datos frescos
    } else {
      // Si hay un error real (400, 500), mostramos el error
      res.json().then(data => {
        alert('❌ Error: ' + (data.details || data.error || 'No se pudo actualizar'));
      });
    }
  })
  .catch(err => {
    console.error('Error de conexión:', err);
    alert('❌ Error de conexión con el servidor.');
  });
}

document.addEventListener('DOMContentLoaded', cargarDetalle);