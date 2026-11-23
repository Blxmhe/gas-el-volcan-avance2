// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extiende los matchers de Vitest para usar .toBeInTheDocument()
expect.extend(matchers);

import Nosotros from '../pages/Nosotros';
import AdminHome from '../pages/admin/AdminHome';
import Blogs from '../pages/Blogs';
import BlogsService from '../services/blogsService';
import PedidosService from '../services/pedidosService';
import UsuariosService from '../services/usuariosService';

// Los servicios que hablan con el backend se reemplazan por versiones falsas
vi.mock('../services/blogsService', () => ({ default: { listar: vi.fn() } }));
vi.mock('../services/pedidosService', () => ({ default: { listar: vi.fn() } }));
vi.mock('../services/usuariosService', () => ({ default: { listar: vi.fn() } }));

// El dashboard lee el catálogo (14 productos de prueba) y el rol desde sus contextos
vi.mock('../context/useProductos', () => ({
  useProductos: () => ({ productos: new Array(14).fill({}) }),
}));
vi.mock('../context/useAuth', () => ({
  useAuth: () => ({ esAdmin: true }),
}));

describe('Pruebas de Nosotros, Blogs y el dashboard del admin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Prueba 1: Verifica la página Nosotros
  it('debe renderizar la página Nosotros con su título y fundadores', () => {
    render(
      <MemoryRouter>
        <Nosotros />
      </MemoryRouter>
    );
    expect(screen.getByText(/Nuestra Historia/i)).toBeInTheDocument();
    expect(screen.getByText(/Nuestros Fundadores/i)).toBeInTheDocument();
  });

  // Prueba 2: El dashboard muestra los totales que entrega el backend
  it('debe mostrar los conteos dinámicos en el AdminHome', async () => {
    UsuariosService.listar.mockResolvedValue([{}, {}, {}]);
    PedidosService.listar.mockResolvedValue([{}, {}]);
    BlogsService.listar.mockResolvedValue([{}]);

    render(
      <MemoryRouter>
        <AdminHome />
      </MemoryRouter>
    );

    expect(await screen.findByText('3')).toBeInTheDocument(); // usuarios
    expect(screen.getByText('14')).toBeInTheDocument(); // productos
    expect(screen.getByText('2')).toBeInTheDocument(); // pedidos
    expect(screen.getByText('1')).toBeInTheDocument(); // blogs
  });

  // Prueba 3: Verifica el renderizado de la vista de Blogs con los artículos del backend
  it('debe renderizar la página de Blogs con los artículos que entrega el backend', async () => {
    BlogsService.listar.mockResolvedValue([
      { id: 1, titulo: 'Consejos de seguridad con el gas', resumen: 'Resumen 1', categoria: 'Seguridad', fechaPublicacion: '2026-09-01' },
      { id: 2, titulo: '¿Cómo ahorrar gas en invierno?', resumen: 'Resumen 2', categoria: null, fechaPublicacion: '2026-09-05' },
    ]);

    render(
      <MemoryRouter>
        <Blogs />
      </MemoryRouter>
    );

    expect(screen.getByText(/Nuestro Blog/i)).toBeInTheDocument();
    expect(await screen.findByText('Consejos de seguridad con el gas')).toBeInTheDocument();
    expect(screen.getByText('¿Cómo ahorrar gas en invierno?')).toBeInTheDocument();
  });

  // Prueba 4: si el backend falla, el usuario ve un aviso y no una pantalla en blanco
  it('debe mostrar un aviso si el backend no responde en Blogs', async () => {
    BlogsService.listar.mockRejectedValue({}); // sin "response" = no hubo conexión

    render(
      <MemoryRouter>
        <Blogs />
      </MemoryRouter>
    );

    expect(await screen.findByText(/No se pudo conectar con el servidor/i)).toBeInTheDocument();
  });
});
