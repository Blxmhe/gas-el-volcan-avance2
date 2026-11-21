function cargarPedidos() {
    fetch('http://localhost:5000/api/pedidos')
        .then(res => res.json())
        .then(data => {
            let html = '';
            data.forEach(p => {
                // Buscamos el ID en _id, id_pedido o id, lo que esté disponible
                const idPedido = p._id || p.id_pedido || p.id || 'N/A';
                const nombreCliente = p.cliente ? p.cliente.nombre : 'Sin cliente';

                html += `<tr>
                    <td style="padding:10px; border:1px solid #ddd;">${idPedido}</td>
                    <td style="padding:10px; border:1px solid #ddd;">${nombreCliente}</td>
                    <td style="padding:10px; border:1px solid #ddd;">${p.estado || 'PENDIENTE'}</td>
                    <td style="padding:10px; border:1px solid #ddd;">$${p.total || 0}</td>
                </tr>`;
            });
            document.getElementById('lista-pedidos').innerHTML = html;
        })
        .catch(err => console.error("Error al cargar pedidos:", err));
}

document.addEventListener('DOMContentLoaded', cargarPedidos);