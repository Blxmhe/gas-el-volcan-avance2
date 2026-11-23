import { describe, it, expect } from 'vitest'
import { validarProducto } from '../utils/validacionesProducto'
import { validarBlog } from '../utils/validacionesBlog'
import { formatearFecha } from '../utils/formatearFecha'
import { resolverImagen } from '../data/imagenes'

const productoValido = {
  codigo: 'CL010',
  nombre: 'Cilindro de prueba',
  descripcion: 'Descripción',
  categoria: 'Cilindros de Gas',
  unidad: 'Unidad',
  precioResidencial: '12000',
  precioComercial: '11000',
  stock: '10',
  stockCritico: '2',
}

describe('validarProducto (formulario de productos del admin)', () => {
  it('acepta un producto válido', () => {
    expect(validarProducto(productoValido, [])).toEqual({})
  })

  it('rechaza un código repetido', () => {
    const errores = validarProducto(productoValido, [{ codigo: 'CL010' }])
    expect(errores.codigo).toContain('Ya existe')
  })

  it('rechaza precios con decimales (el backend guarda pesos enteros)', () => {
    const errores = validarProducto({ ...productoValido, precioResidencial: '12000.5' }, [])
    expect(errores.precioResidencial).toContain('entero')
  })

  it('rechaza stock negativo', () => {
    const errores = validarProducto({ ...productoValido, stock: '-1' }, [])
    expect(errores.stock).toBeDefined()
  })
})

describe('validarBlog (formulario de blogs del admin)', () => {
  const blogValido = { titulo: 'Título', resumen: 'Resumen', contenido: 'Contenido', categoria: '', imagen: '' }

  it('acepta un artículo válido (categoría e imagen son opcionales)', () => {
    expect(validarBlog(blogValido)).toEqual({})
  })

  it('exige título, resumen y contenido', () => {
    const errores = validarBlog({ titulo: ' ', resumen: '', contenido: '' })
    expect(Object.keys(errores)).toEqual(['titulo', 'resumen', 'contenido'])
  })

  it('respeta los máximos de caracteres del backend', () => {
    const errores = validarBlog({ ...blogValido, titulo: 'a'.repeat(151), resumen: 'b'.repeat(301) })
    expect(errores.titulo).toContain('150')
    expect(errores.resumen).toContain('300')
  })
})

describe('utilidades de fecha e imagen', () => {
  it('formatearFecha convierte la fecha ISO sin correrla por zona horaria', () => {
    expect(formatearFecha('2026-09-05')).toBe('05/09/2026')
  })

  it('resolverImagen encuentra la foto por su nombre de archivo', () => {
    expect(resolverImagen('cilindro-11kg.jpg')).toContain('cilindro-11kg')
    expect(resolverImagen('img/cilindro-11kg.jpg')).toContain('cilindro-11kg')
  })

  it('resolverImagen devuelve el texto tal cual si no es una foto conocida, y vacío si no hay imagen', () => {
    expect(resolverImagen('no-existe.jpg')).toBe('no-existe.jpg')
    expect(resolverImagen(null)).toBe('')
  })
})
