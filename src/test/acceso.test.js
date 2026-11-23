/**
 * Pruebas unitarias con Vitest para el módulo de Acceso (RUN, login y sesión)
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { validarRUN } from '../utils/validacionRun';
import { AuthProvider } from '../context/AuthProvider';
import { useAuth } from '../context/useAuth';
import AuthService from '../services/authService';

// El servicio de autenticación se simula: estas pruebas no necesitan el backend encendido
vi.mock('../services/authService', () => ({
  default: { login: vi.fn(), logout: vi.fn(), registrar: vi.fn() },
}));

// Lo que responde el backend al iniciar sesión
const respuestaAdmin = {
  accessToken: 'token-acceso',
  refreshToken: 'token-renovacion',
  correo: 'admin@duoc.cl',
  nombre: 'Admin',
  tipoUsuario: 'Administrador',
};

// Monta el hook useAuth dentro de su Provider
function renderizarAuth() {
  return renderHook(() => useAuth(), { wrapper: AuthProvider });
}

describe("Acceso: validación de RUN, login y sesión (Vitest)", () => {

  // Limpiar el entorno antes de cada prueba
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

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

  it("Test 3: [Autenticación] Al iniciar sesión guarda la sesión y reconoce el rol", async () => {
    AuthService.login.mockResolvedValue({ data: respuestaAdmin });
    const { result } = renderizarAuth();

    await act(async () => {
      await result.current.login("admin@duoc.cl", "admin");
    });

    expect(AuthService.login).toHaveBeenCalledWith("admin@duoc.cl", "admin");
    expect(result.current.estaAutenticado).toBe(true);
    expect(result.current.esAdmin).toBe(true);
    expect(result.current.puedeAdministrar).toBe(true);
    expect(result.current.usuario.tipoUsuario).toBe("Administrador");

    // La sesión queda guardada en localStorage bajo 'sesion' (así sobrevive a recargar la página)
    const sesion = JSON.parse(localStorage.getItem("sesion"));
    expect(sesion.accessToken).toBe("token-acceso");
    expect(sesion.correo).toBe("admin@duoc.cl");
  });

  it("Test 4: [Autenticación] Si el backend rechaza las credenciales, no hay sesión", async () => {
    AuthService.login.mockRejectedValue({ response: { status: 401 } });
    const { result } = renderizarAuth();

    await act(async () => {
      await expect(result.current.login("admin@duoc.cl", "mala")).rejects.toBeDefined();
    });

    expect(result.current.estaAutenticado).toBe(false);
    expect(localStorage.getItem("sesion")).toBeNull();
  });

  it("Test 5: [Sesión] Al recargar la página la sesión se recupera desde localStorage", () => {
    localStorage.setItem("sesion", JSON.stringify({ ...respuestaAdmin, tipoUsuario: "Vendedor" }));

    const { result } = renderizarAuth(); // equivale a recargar: el Provider se monta de nuevo

    expect(result.current.estaAutenticado).toBe(true);
    expect(result.current.esVendedor).toBe(true);
    expect(result.current.esAdmin).toBe(false);
    expect(result.current.puedeAdministrar).toBe(true);
  });

  it("Test 6: [Sesión] Cerrar sesión revoca el token en el servidor y borra la sesión local", async () => {
    localStorage.setItem("sesion", JSON.stringify(respuestaAdmin));
    AuthService.logout.mockResolvedValue({});
    const { result } = renderizarAuth();

    await act(async () => {
      await result.current.logout();
    });

    expect(AuthService.logout).toHaveBeenCalledWith("token-renovacion");
    expect(result.current.estaAutenticado).toBe(false);
    expect(localStorage.getItem("sesion")).toBeNull();
  });

  it("Test 7: [Sesión] Un Cliente no puede administrar", () => {
    localStorage.setItem("sesion", JSON.stringify({ ...respuestaAdmin, tipoUsuario: "Cliente" }));

    const { result } = renderizarAuth();

    expect(result.current.esCliente).toBe(true);
    expect(result.current.puedeAdministrar).toBe(false);
  });

});
