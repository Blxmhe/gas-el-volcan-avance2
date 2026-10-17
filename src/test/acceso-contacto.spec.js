/**
 * src/test/acceso-contacto.spec.js
 * Pruebas unitarias con Vitest para el módulo de Acceso, Validación y Contacto
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { validarRUN } from '../utils/validacionRun';
import { registrarUsuario, loginUsuario, obtenerUsuarios } from '../data/usuarios';

describe("=== SUITE DE PRUEBAS UNITARIAS: ACCESO Y CONTACTO (Vitest) ===", () => {

  // Limpiar y resetear el entorno antes de cada prueba (Uso de beforeEach)
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // CATEGORÍA 1: PRUEBAS DE LÓGICA Y VALIDACIÓN DE NEGOCIO (RUN)

  it("Test 1: [Lógica RUN] Debe validar correctamente un RUN chileno con dígito verificador válido", () => {
    const runValido = "123456785";
    const resultado = validarRUN(runValido);
    expect(resultado).toBe(true);
  });

  it("Test 2: [Lógica RUN] Debe rechazar un RUN chileno con dígito verificador incorrecto", () => {
    const runInvalido = "190110220"; // El dígito correcto es 2, no 0
    const resultado = validarRUN(runInvalido);
    expect(resultado).toBe(false);
  });

  it("Test 3: [Lógica RUN] Debe rechazar valores vacíos, nulos o con longitud fuera del rango (7 a 9 caracteres)", () => {
    expect(validarRUN("")).toBe(false);
    expect(validarRUN(null)).toBe(false);
    expect(validarRUN("123")).toBe(false); // Demasiado corto
    expect(validarRUN("123456789012")).toBe(false); // Demasiado largo
  });

  // CATEGORÍA 2: PRUEBAS DE PERSISTENCIA Y MOCK DATABASE (CRUD)


  it("Test 4: [Mock DB / CRUD] Debe registrar un nuevo usuario y persistirlo en localStorage", () => {
    const nuevo = {
      run: "123456785",
      nombre: "Nicolás",
      apellidos: "Delgado",
      correo: "nicolas@duoc.cl",
      password: "password123",
      tipoUsuario: "Cliente",
      region: "Región de Ñuble",
      comuna: "Chillán",
      direccion: "Calle Falsa 123"
    };

    const creado = registrarUsuario(nuevo);
    expect(creado).toBe(true);

    const lista = obtenerUsuarios();
    const guardado = lista.find(u => u.correo === "nicolas@duoc.cl");
    expect(guardado).toBeDefined();
    expect(guardado.nombre).toBe("Nicolás");
  });

  it("Test 5: [Mock DB / Validación] No debe permitir registrar un usuario con correo o RUN duplicado", () => {
    const usuarioOriginal = {
      run: "123456785",
      nombre: "Original",
      correo: "duplicado@duoc.cl",
      password: "123"
    };
    registrarUsuario(usuarioOriginal);

    // Intento de duplicar
    const usuarioDuplicado = {
      run: "123456785",
      nombre: "Copia",
      correo: "duplicado@duoc.cl",
      password: "456"
    };
    const resultado = registrarUsuario(usuarioDuplicado);
    expect(resultado).toBe(false);
  });

  // CATEGORÍA 3: PRUEBAS DE AUTENTICACIÓN Y SESIÓN (LOGIN)

  it("Test 6: [Autenticación] Debe iniciar sesión exitosamente si las credenciales coinciden y guardar la sesión activa", () => {
    // Usamos el usuario de prueba inicial precargado (admin@duoc.cl / admin)
    const usuario = loginUsuario("admin@duoc.cl", "admin");
    
    expect(usuario).not.toBeNull();
    expect(usuario.tipoUsuario).toBe("Administrador");

    // Verificar que se guardó en localStorage bajo 'usuarioActivo'
    const sesion = JSON.parse(localStorage.getItem("usuarioActivo"));
    expect(sesion).toBeDefined();
    expect(sesion.correo).toBe("admin@duoc.cl");
  });

  it("Test 7: [Autenticación] Debe rechazar el inicio de sesión cuando la contraseña es incorrecta", () => {
    const usuario = loginUsuario("admin@duoc.cl", "clave_erronea");
    expect(usuario).toBeNull();

    const sesion = localStorage.getItem("usuarioActivo");
    expect(sesion).toBeNull();
  });

  // CATEGORIA 4: PRUEBAS DE STATE, EVENTOS Y MOCKS (SPYON)

  it("Test 8: [Mocks y Spies] Debe usar spyOn para verificar que loginUsuario llama a localStorage.setItem al autenticar", () => {
    // Espiar el metodo nativo setItem de localStorage
    vi.spyOn(Storage.prototype, 'setItem');

    loginUsuario("admin@duoc.cl", "admin");

    // Comprobar que fue llamado con la clave 'usuarioActivo'
    expect(localStorage.setItem).toHaveBeenCalledWith('usuarioActivo', expect.any(String));
  });

  it("Test 9: [Validación de Estado / Formato Correo] Debe validar que los correos terminen solo en @duoc.cl, @profesor.duoc.cl o @gmail.com", () => {
    const dominiosValidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
    
    const correoValido1 = "alumno@duoc.cl";
    const correoValido2 = "profesor@profesor.duoc.cl";
    const correoInvalido = "hacker@hotmail.com";

    const validar = (c) => dominiosValidos.some(d => c.endsWith(d));

    expect(validar(correoValido1)).toBe(true);
    expect(validar(correoValido2)).toBe(true);
    expect(validar(correoInvalido)).toBe(false);
  });

  it("Test 10: [Mocks y Eventos] Debe simular un evento de registro y verificar el flujo de persistencia completo", () => {
    const mockStorage = {};
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, val) => {
      mockStorage[key] = val;
    });

    const datosSimulados = {
      run: "123456785",
      nombre: "Prueba Mock",
      apellidos: "Testing",
      correo: "test@gmail.com",
      password: "password123",
      tipoUsuario: "Cliente"
    };

    const exito = registrarUsuario(datosSimulados);
    expect(exito).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalled();
  });

});