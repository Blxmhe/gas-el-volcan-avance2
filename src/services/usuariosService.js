// src/services/usuariosService.js
// Lee y guarda los usuarios en localStorage.
// Si todavía no hay cambios guardados, parte con los usuarios de src/data/usuarios.js

import { usuariosPrueba } from '../data/usuarios'

const CLAVE = 'usuarios'

// Los usuarios de prueba usan "tipo"; el formulario usa "tipoUsuario",
// igual que el proyecto anterior. Aquí se unifica el nombre del campo.
function adaptarUsuario(usuario) {
  const { tipo, ...resto } = usuario
  return { ...resto, tipoUsuario: usuario.tipoUsuario ?? tipo }
}

export function obtenerUsuarios() {
  try {
    const guardado = localStorage.getItem(CLAVE)
    if (guardado) {
      const lista = JSON.parse(guardado)
      if (Array.isArray(lista) && lista.length > 0) return lista.map(adaptarUsuario)
    }
  } catch {
    // Si localStorage falla, se usan los usuarios de prueba
  }
  return usuariosPrueba.map(adaptarUsuario)
}

export function guardarUsuarios(lista) {
  localStorage.setItem(CLAVE, JSON.stringify(lista))
}

export function buscarUsuario(run) {
  return obtenerUsuarios().find((u) => u.run === run)
}

export function agregarUsuario(usuario) {
  guardarUsuarios([...obtenerUsuarios(), usuario])
}

// Si la contraseña viene vacía, se mantiene la que ya tenía el usuario
export function actualizarUsuario(run, cambios) {
  const { password, ...resto } = cambios
  const lista = obtenerUsuarios().map((u) =>
    u.run === run ? { ...u, ...resto, run, ...(password ? { password } : {}) } : u,
  )
  guardarUsuarios(lista)
}