function cargarHistorial() {
    fetch('http://localhost:5000/api/historial')
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) {
                document.getElementById('contenedor-historial').innerHTML = '<p>No hay registros de cambios aún.</p>';
                return;
            }
            let html = '';
            data.forEach(h => {
                const nombreAnt = h.valor_anterior ? h.valor_anterior.nombre : 'N/A';
                const precioAnt = h.valor_anterior ? h.valor_anterior.precio : '0';
                const nombreNue = h.valor_nuevo ? h.valor_nuevo.nombre : 'N/A';
                const precioNue = h.valor_nuevo ? h.valor_nuevo.precio : '0';

                html += `<div style="border:1px solid #ddd; padding:15px; margin-bottom:15px; border-radius:8px; background:#fff;">
                    <p style="margin:0; color:#666;">📅 ${new Date(h.fecha).toLocaleString()} | 🆔 Producto: <strong>${h.codigo_producto}</strong></p>
                    <hr style="border:0; border-top:1px solid #eee; margin:10px 0;">
                    <p style="margin:5px 0; color:#d9534f;">❌ <strong>Antes:</strong> ${nombreAnt} ($${precioAnt})</p>
                    <p style="margin:5px 0; color:#5cb85c;">✅ <strong>Después:</strong> ${nombreNue} ($${precioNue})</p>
                </div>`;
            });
            document.getElementById('contenedor-historial').innerHTML = html;
        })
        .catch(err => {
            console.error("Error al cargar historial:", err);
            document.getElementById('contenedor-historial').innerHTML = '<p>Error al conectar con la base de datos.</p>';
        });
}
document.addEventListener('DOMContentLoaded', cargarHistorial);