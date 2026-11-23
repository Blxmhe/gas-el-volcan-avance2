import { useState } from 'react'
import { ICONOS_POR_CATEGORIA } from '../data/productos'
import { resolverImagen } from '../data/imagenes'

// Muestra la foto del producto. Si no tiene foto, o si la foto no carga
// (por ejemplo, un producto nuevo creado desde el admin), muestra el ícono de su categoría.
function ImagenProducto({ producto, className }) {
  // Guarda la ruta de la imagen que falló, para no volver a intentar cargarla
  const [imagenFallida, setImagenFallida] = useState(null)

  // El backend guarda solo el nombre del archivo; resolverImagen lo convierte en la ruta real
  const ruta = resolverImagen(producto.imagen)

  if (ruta && ruta !== imagenFallida) {
    return (
      <img
        className={className}
        src={ruta}
        alt={producto.nombre}
        onError={() => setImagenFallida(ruta)}
      />
    )
  }
  return (
    <div className={`${className} imagen-icono`}>
      {ICONOS_POR_CATEGORIA[producto.categoria]}
    </div>
  )
}

export default ImagenProducto
