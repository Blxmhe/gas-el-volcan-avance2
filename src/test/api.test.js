import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import axios from 'axios'
import api, { mensajeDeError } from '../services/api'
import { guardarSesion, leerSesion } from '../services/sesionStorage'

// Respuesta 200 falsa: el "adaptador" reemplaza a la red, así no se necesita el backend
const ok = (config, data = {}) => ({ data, status: 200, statusText: 'OK', headers: {}, config })

// Error 401 como el que entrega Axios cuando el backend rechaza el token
const error401 = (config) =>
  new axios.AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, null, {
    status: 401,
    data: {},
    headers: {},
    config,
  })

const sesionVieja = { accessToken: 'viejo', refreshToken: 'ref-viejo', correo: 'a@duoc.cl', nombre: 'A', tipoUsuario: 'Cliente' }
const sesionNueva = { ...sesionVieja, accessToken: 'nuevo', refreshToken: 'ref-nuevo' }

describe('api.js (interceptores de Axios)', () => {
  const adaptadorOriginal = api.defaults.adapter

  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    api.defaults.adapter = adaptadorOriginal
    vi.restoreAllMocks()
  })

  it('agrega el token de acceso en la cabecera Authorization', async () => {
    guardarSesion(sesionVieja)
    api.defaults.adapter = async (config) => ok(config)

    const respuesta = await api.get('/productos')

    expect(respuesta.config.headers.Authorization).toBe('Bearer viejo')
  })

  it('sin sesión no envía la cabecera Authorization', async () => {
    api.defaults.adapter = async (config) => ok(config)

    const respuesta = await api.get('/productos')

    expect(respuesta.config.headers.Authorization).toBeUndefined()
  })

  it('si recibe 401 renueva el token y repite la petición con el token nuevo', async () => {
    guardarSesion(sesionVieja)
    const refresh = vi.spyOn(axios, 'post').mockResolvedValue({ data: sesionNueva })
    api.defaults.adapter = async (config) => {
      if (config.headers.Authorization === 'Bearer viejo') throw error401(config)
      return ok(config, { mensaje: 'bien' })
    }

    const respuesta = await api.get('/pedidos/mis-pedidos')

    expect(refresh).toHaveBeenCalledTimes(1)
    expect(refresh.mock.calls[0][1]).toEqual({ refreshToken: 'ref-viejo' })
    expect(respuesta.data).toEqual({ mensaje: 'bien' })
    // La sesión guardada ahora tiene los tokens nuevos
    expect(leerSesion().accessToken).toBe('nuevo')
    expect(leerSesion().refreshToken).toBe('ref-nuevo')
  })

  it('varias peticiones con 401 a la vez comparten UNA sola renovación', async () => {
    guardarSesion(sesionVieja)
    const refresh = vi.spyOn(axios, 'post').mockResolvedValue({ data: sesionNueva })
    api.defaults.adapter = async (config) => {
      if (config.headers.Authorization === 'Bearer viejo') throw error401(config)
      return ok(config)
    }

    await Promise.all([api.get('/pedidos'), api.get('/usuarios'), api.get('/blogs')])

    expect(refresh).toHaveBeenCalledTimes(1)
  })

  it('si la renovación falla, borra la sesión y avisa a la aplicación', async () => {
    guardarSesion(sesionVieja)
    vi.spyOn(axios, 'post').mockRejectedValue(new Error('refresh vencido'))
    api.defaults.adapter = async (config) => {
      throw error401(config)
    }
    const alExpirar = vi.fn()
    window.addEventListener('sesion-expirada', alExpirar)

    await expect(api.get('/pedidos')).rejects.toThrow('refresh vencido')

    window.removeEventListener('sesion-expirada', alExpirar)
    expect(leerSesion()).toBeNull()
    expect(alExpirar).toHaveBeenCalledTimes(1)
  })

  it('si la renovación falla en una consulta pública, repite la petición sin token y funciona', async () => {
    guardarSesion(sesionVieja)
    vi.spyOn(axios, 'post').mockRejectedValue(new Error('refresh vencido'))
    // El backend rechaza cualquier token inválido, incluso en rutas públicas
    api.defaults.adapter = async (config) => {
      if (config.headers.Authorization) throw error401(config)
      return ok(config, [{ codigo: 'CL001' }])
    }

    const respuesta = await api.get('/productos')

    expect(respuesta.data).toEqual([{ codigo: 'CL001' }])
    expect(respuesta.config.headers.Authorization).toBeUndefined()
    expect(leerSesion()).toBeNull()
  })

  it('un 401 en las rutas /auth/ (credenciales incorrectas) no intenta renovar', async () => {
    guardarSesion(sesionVieja)
    const refresh = vi.spyOn(axios, 'post')
    api.defaults.adapter = async (config) => {
      throw error401(config)
    }

    await expect(api.post('/auth/login', {})).rejects.toBeDefined()

    expect(refresh).not.toHaveBeenCalled()
    expect(leerSesion()).not.toBeNull()
  })
})

describe('mensajeDeError', () => {
  it('usa el mensaje que envía el backend', () => {
    const error = { response: { status: 409, data: { mensaje: 'No hay suficiente stock de Cilindro GLP 11 kg (disponible: 2, pedido: 3)' } } }
    expect(mensajeDeError(error)).toBe('No hay suficiente stock de Cilindro GLP 11 kg (disponible: 2, pedido: 3)')
  })

  it('une los mensajes de validación por campo', () => {
    const error = { response: { status: 400, data: { campos: { nombre: 'El nombre es obligatorio' } } } }
    expect(mensajeDeError(error)).toBe('El nombre es obligatorio')
  })

  it('explica la falta de permisos en un 403 sin mensaje', () => {
    expect(mensajeDeError({ response: { status: 403, data: {} } })).toContain('No tienes permiso')
  })

  it('avisa cuando no hay conexión con el servidor', () => {
    expect(mensajeDeError({})).toContain('No se pudo conectar con el servidor')
  })
})
