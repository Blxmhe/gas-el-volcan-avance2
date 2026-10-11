import { ICONOS_POR_CATEGORIA } from '../data/productos'

// Muestra la foto del producto o, si no tiene, el ícono de su categoría
function ImagenProducto({ producto, className }) {
  if (producto.imagen) {
    return <img className={className} src={producto.imagen} alt={producto.nombre} />
  }
  return (
    <div className={`${className} imagen-icono`}>
      {ICONOS_POR_CATEGORIA[producto.categoria]}
    </div>
  )
}

export default ImagenProducto
