import { useState } from 'react'
import { ICONOS_POR_CATEGORIA } from '../data/productos'

function ImagenProducto({ producto, className }) {
  const [imagenFallida, setImagenFallida] = useState(false)

  if (producto.imagen && !imagenFallida) {
    return (
      <img
        className={className}
        src={`img/${producto.imagen}`}  // ← Ruta corregida para carpeta img/
        alt={producto.nombre}
        onError={() => setImagenFallida(true)}
      />
    )
  }

  return (
    <div className={`${className} imagen-icono`}>
      {ICONOS_POR_CATEGORIA[producto.categoria] || '📦'}
    </div>
  )
}

export default ImagenProducto