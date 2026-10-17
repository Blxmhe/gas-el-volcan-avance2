import { describe, it, expect, vi } from 'vitest'
import { validarUsuario } from '../utils/validacionesUsuario'

// Datos que pasan todas las validaciones (base para cada prueba)
const datosValidos = {
  run: '190110222',
  nombre: 'Daniel',
  apellidos: 'Soto',
  correo: 'daniel@gmail.com',
  password: 'abcd1234',
  tipoUsuario: 'Cliente',
  region: 'Región Metropolitana',
  comuna: 'Santiago',
  direccion: 'Calle Falsa 123',
}

describe('validarUsuario (formulario de usuarios del admin)', () => {
  it('devuelve un objeto vacío cuando todos los datos son válidos', () => {
    const errores = validarUsuario(datosValidos)

    expect(errores).toEqual({})
  })

  it('marca como error todos los campos obligatorios cuando el formulario viene vacío', () => {
    const errores = validarUsuario({})

    expect(Object.keys(errores)).toEqual(
      expect.arrayContaining([
        'run', 'nombre', 'apellidos', 'correo', 'password',
        'tipoUsuario', 'region', 'comuna', 'direccion',
      ]),
    )
  })

  it('rechaza un correo con dominio no permitido', () => {
    const errores = validarUsuario({ ...datosValidos, correo: 'hacker@hotmail.com' })

    expect(errores.correo).toContain('@gmail.com')
  })

  it('rechaza un RUN que ya existe en la lista de usuarios', () => {
    const existentes = [{ run: '190110222', correo: 'otro@gmail.com' }]

    const errores = validarUsuario(datosValidos, existentes)

    expect(errores.run).toBe('Ya existe un usuario registrado con ese RUN.')
  })

  it('rechaza contraseñas de menos de 4 o más de 10 caracteres', () => {
    const corta = validarUsuario({ ...datosValidos, password: '123' })
    const larga = validarUsuario({ ...datosValidos, password: '12345678901' })

    expect(corta.password).toBeDefined()
    expect(larga.password).toBeDefined()
  })

  it('en modo editar no exige RUN ni contraseña', () => {
    const datos = { ...datosValidos, run: '', password: '' }

    const errores = validarUsuario(datos, [], true)

    expect(errores).toEqual({})
  })

  it('usa la función validarRun que se le entrega (mock) para revisar el RUN', () => {
    const validarRunFalso = vi.fn(() => false)

    const errores = validarUsuario(datosValidos, [], false, validarRunFalso)

    expect(validarRunFalso).toHaveBeenCalledWith('190110222')
    expect(errores.run).toContain('RUN inválido')
  })
})