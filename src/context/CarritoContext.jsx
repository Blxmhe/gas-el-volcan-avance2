import { createContext, useContext, useEffect, useState } from 'react'

const CarritoContext = createContext()

// Lee el carrito guardado en localStorage; si no hay nada, devuelve un arreglo vacío
function obtenerCarritoGuardado() {
  const texto = localStorage.getItem('carrito')
  if (texto === null) {
    return []
  }
  return JSON.parse(texto)
}

// Envuelve la app y comparte el carrito con todos los componentes de adentro
export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState(obtenerCarritoGuardado)

  // Cada vez que cambia el carrito, se guarda en localStorage
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito))
  }, [carrito])

  // Suma las unidades de todos los productos (lo que muestra "Cart (N)" en el menú)
  let totalUnidades = 0
  carrito.forEach((item) => {
    totalUnidades = totalUnidades + item.cantidad
  })

  return (
    <CarritoContext value={{ carrito, totalUnidades }}>
      {children}
    </CarritoContext>
  )
}

// Atajo para leer el carrito desde cualquier componente
export function useCarrito() {
  return useContext(CarritoContext)
}
