/**
 * src/tests/acceso-contacto.spec.js
 * Pruebas unitarias con Jasmine para el módulo de Acceso y Contacto
 */

import { validarRUN } from '../utils/validacionRun';
import { loginUsuario } from '../data/usuarios';

describe("Pruebas Unitarias - Modulo de Acceso y Contacto (Nicolás Delgado)", () => {

  beforeEach(() => {
    localStorage.clear();
  });

  // PRUEBA 1: Validación de Lógica de Negocio (Algoritmo Módulo 11)
  it("Debe validar correctamente un RUN chileno válido y rechazar uno incorrecto", () => {
    // 1. RUN válido real
    const esValido = validarRUN("19011022K");
    expect(esValido).toBe(true);

    // 2. RUN inválido (dígito verificador erróneo)
    const esInvalido = validarRUN("190110220");
    expect(esInvalido).toBe(false);
  });

  // PRUEBA 2: Autenticación, Estado y uso de Mocks (SpyOn)
  it("Debe autenticar credenciales válidas y registrar la sesión usando spies", () => {
    // Espiar que se llame a localStorage.setItem (Uso de Mock/Spy que pide la pauta)
    spyOn(localStorage, 'setItem').and.callThrough();

    // Intentar login con usuario existente de prueba
    const usuario = loginUsuario("admin@duoc.cl", "admin");

    expect(usuario).not.toBeNull();
    expect(usuario.tipoUsuario).toBe("Administrador");
    expect(localStorage.setItem).toHaveBeenCalledWith('usuarioActivo', jasmine.any(String));
  });

});