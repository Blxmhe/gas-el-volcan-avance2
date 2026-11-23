// src/utils/roles.js
// Nombres de los tipos de usuario, tal como los entrega el backend en "tipoUsuario".
// Se usan para decidir qué ve cada usuario y qué rutas puede abrir.

export const ROL_ADMIN = 'Administrador'
export const ROL_VENDEDOR = 'Vendedor'
export const ROL_CLIENTE = 'Cliente'

// Roles que pueden entrar al panel de administración
export const ROLES_PANEL = [ROL_ADMIN, ROL_VENDEDOR]
