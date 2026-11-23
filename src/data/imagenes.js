// src/data/imagenes.js
// El backend guarda solo el NOMBRE del archivo de la imagen (ej: "cilindro-11kg.jpg").
// Vite junta todas las fotos de src/assets y este archivo traduce nombre -> URL real.

const archivos = import.meta.glob('../assets/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

// { 'cilindro-11kg.jpg': '/assets/cilindro-11kg-abc123.jpg', ... }
const porNombre = {}
Object.entries(archivos).forEach(([ruta, url]) => {
  porNombre[ruta.split('/').pop()] = url
})

// Devuelve la URL de la imagen. Si no es una foto de src/assets, devuelve el texto tal cual
// (puede ser una URL completa); si la imagen no carga, ImagenProducto muestra el ícono.
export function resolverImagen(nombre) {
  if (!nombre) return ''
  const archivo = String(nombre).split('/').pop()
  return porNombre[archivo] ?? nombre
}
