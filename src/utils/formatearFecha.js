// Convierte una fecha ISO que entrega el backend en texto para mostrar.

// Fecha sola ("2026-09-05") -> "05/09/2026". Se arma con el texto, sin usar Date,
// para que la zona horaria no la corra un día.
export function formatearFecha(fechaIso) {
  if (!fechaIso) return ''
  const [anio, mes, dia] = String(fechaIso).slice(0, 10).split('-')
  return `${dia}/${mes}/${anio}`
}

// Fecha y hora ("2026-11-22T15:30:00Z") -> "22-11-2026, 12:30" (en la hora del navegador)
export function formatearFechaHora(instanteIso) {
  if (!instanteIso) return ''
  return new Date(instanteIso).toLocaleString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}
