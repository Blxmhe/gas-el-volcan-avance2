# Distribuidora Gas El Volcán — Tienda online

Tienda online de una distribuidora de gas de Chillán: catálogo de productos, carrito de compras que crea pedidos, registro e inicio de sesión de usuarios, blog y un panel de administración. Es la **Evaluación 3** del proyecto de *Desarrollo Fullstack II (DSY1104)* en Duoc UC: la tienda en **React** (Avance 2) ahora está conectada a un **backend Spring Boot** con autenticación JWT y control de acceso por rol.

Este repositorio es **solo el frontend**. El backend es otra aplicación (carpeta y repositorio aparte, `backend-gas-el-volcan`) que debe estar encendida en `http://localhost:8080` para que la tienda muestre datos. Los productos, usuarios, pedidos y blogs viven en la base de datos del backend; en el navegador solo se guardan la **sesión** (`sesion`) y el **carrito** (`carrito`).

## Tecnologías

| Para qué | Herramienta |
|---|---|
| Interfaz | React 19 |
| Entorno de desarrollo y compilación | Vite 8 |
| Navegación entre páginas y rutas protegidas por rol | React Router 7 |
| Llamadas HTTP al backend (con interceptores JWT) | Axios |
| Diseño responsivo y componentes | Bootstrap 5 y React-Bootstrap |
| Pruebas unitarias | Vitest, React Testing Library y jsdom |
| Cobertura de las pruebas | @vitest/coverage-v8 |

## Cómo ejecutarlo

Requiere Node.js (probado con la versión 22) y el **backend encendido** (ver el README del backend).

```bash
npm install          # instala las dependencias
npm run dev          # servidor de desarrollo en http://localhost:5173
npm run build        # compila para producción
npm run lint         # revisa el código con ESLint
npx vitest run       # ejecuta las pruebas una sola vez
npm test             # ejecuta las pruebas en modo observador
npm run coverage     # pruebas + informe de cobertura (carpeta coverage/)
```

La dirección del backend está en `src/services/api.js` (`http://localhost:8080` por defecto). Para usar otra, copia `.env.example` a `.env` y cambia `VITE_API_URL`.

## Usuarios de prueba

El backend los crea solo la primera vez que arranca.

| Tipo | Correo | Contraseña | Qué puede hacer |
|---|---|---|---|
| Administrador | admin@duoc.cl | admin | Todo: productos, usuarios, blogs y pedidos (crear, editar, eliminar) |
| Vendedor | vendedor@duoc.cl | vende | Solo ver la lista y el detalle de productos y de pedidos |
| Cliente | cliente@gmail.com | 1234 | Solo la tienda: comprar y ver sus pedidos |

Sin sesión, cualquier página `/admin...` lleva al login. Con sesión pero con un rol que no corresponde, lleva a "Acceso no autorizado" (y el backend además responde 403 si alguien intenta saltarse la interfaz).

## ¿Dónde está...? (mapa del proyecto)

Todo el código está en `src/`.

| Qué buscas | Dónde está |
|---|---|
| Las rutas de la aplicación | `App.jsx` (el `BrowserRouter` está en `main.jsx`) |
| Menú de navegación: sesión, "Ir a Admin", "Cerrar sesión" y contador del carrito | `components/Menu.jsx` |
| Catálogo: lista, detalle y tarjetas de producto | `pages/Productos.jsx`, `pages/ProductoDetalle.jsx`, `components/TarjetaProducto.jsx` |
| Imagen del producto (muestra el ícono de su categoría si no carga) | `components/ImagenProducto.jsx` |
| Iconos y listas fijas de categorías y unidades | `data/productos.js` |
| Nombre de archivo de imagen (backend) → foto de `src/assets` | `data/imagenes.js` |
| Catálogo en memoria (se pide al backend una vez y se comparte) | `context/ProductosProvider.jsx` y `context/useProductos.js` |
| Cliente HTTP con interceptores (token + renovación automática) | `services/api.js` |
| Guardar y leer la sesión (tokens) en `localStorage` | `services/sesionStorage.js` |
| Sesión del usuario: `login`, `logout`, rol (`esAdmin`, `esVendedor`...) | `context/AuthProvider.jsx` y `context/useAuth.js` |
| Rutas protegidas por sesión y rol | `components/ProtectedRoute.jsx` y `pages/NoAutorizado.jsx` |
| Llamadas a la API: auth, productos, usuarios, pedidos y blogs | `services/authService.js`, `productosService.js`, `usuariosService.js`, `pedidosService.js`, `blogsService.js` |
| Carrito: estado, stock y totales | `context/CarritoContext.jsx` y `context/useCarrito.js` |
| Pantalla del carrito y botón "Pagar" (crea el pedido) | `pages/Carrito.jsx` |
| Mis pedidos (cliente) | `pages/MisPedidos.jsx` |
| Inicio de sesión | `pages/Login.jsx` |
| Registro de usuarios | `pages/Registro.jsx` |
| Validación del RUN (dígito verificador, módulo 11) | `utils/validacionRun.js` |
| Formulario de contacto | `pages/Contacto.jsx` |
| Páginas institucionales | `pages/Nosotros.jsx` |
| Blog público: lista y artículo | `pages/Blogs.jsx` y `pages/BlogDetalle.jsx` |
| Panel de administración (12 pantallas: dashboard, productos, usuarios, blogs y pedidos) | `pages/admin/` |
| Marco del panel y menú lateral según el rol | `components/AdminLayout.jsx` |
| Formularios de producto, usuario y blog (nuevo y editar) | `components/ProductoForm.jsx`, `components/UsuarioForm.jsx` y `components/BlogForm.jsx` |
| Validaciones de los formularios del admin | `utils/validacionesProducto.js`, `utils/validacionesUsuario.js` y `utils/validacionesBlog.js` |
| Nombres de los roles | `utils/roles.js` |
| Mensajes de carga/error y etiqueta de estado del pedido | `components/EstadoCarga.jsx` y `components/EstadoPedido.jsx` |
| Estilos | `App.css`, un `.css` junto a cada componente (`Menu.css`, `TarjetaProducto.css`...) y `styles/admin.css` |
| Pruebas | `test/` |
| Configuración de las pruebas | `../vite.config.js` y `test/setup.js` |

### Cómo se organizan los datos

- Los datos viven en la **base de datos del backend**; el frontend los pide con `services/` (Axios) y nunca los guarda en el navegador, salvo la sesión y el carrito.
- `services/api.js` es la única instancia de Axios: agrega `Authorization: Bearer <token>` a cada petición y, si el backend responde 401 (token vencido), renueva el token con el *refresh token* y repite la petición sin que el usuario lo note. Si la renovación falla, cierra la sesión.
- `context/AuthProvider.jsx` guarda la sesión en `localStorage` (clave `sesion`), por eso sigue iniciada al recargar la página.
- `context/ProductosProvider.jsx` pide el catálogo una vez; tienda, carrito y panel leen la misma lista. Después de comprar o de editar un producto se vuelve a pedir (`recargar()`) para ver el stock actualizado.
- **Pagar**: `pages/Carrito.jsx` envía `POST /api/v1/pedidos` con `[{ codigo, cantidad }]`; el backend calcula el total, revisa el stock, lo descuenta y crea el pedido en una sola transacción.
- Claves de `localStorage`: `sesion` y `carrito`.

## Pruebas unitarias

Se usa **Vitest** con React Testing Library. Hay **53 pruebas en 10 archivos** dentro de `src/test/`. Ninguna necesita el backend encendido: los servicios que hablan con la API se reemplazan por simulaciones (mocks).

| Archivo | Qué prueba | Pruebas |
|---|---|---|
| `acceso.test.js` | Validación del RUN, login, persistencia de la sesión al recargar y cierre de sesión | 7 |
| `api.test.js` | Interceptores de Axios (token en la cabecera, renovación tras un 401, una sola renovación en paralelo, cierre de sesión si falla) y mensajes de error | 10 |
| `ProtectedRoute.test.jsx` | Redirección sin sesión y por rol (Cliente, Vendedor, Administrador) | 4 |
| `Carrito.test.jsx` | Botón "Pagar": crea el pedido, error de stock del backend, sin sesión y Vendedor sin permiso | 4 |
| `CarritoContext.test.jsx` | Agregar productos al carrito, respetar el stock y vaciar el carrito | 4 |
| `Menu.test.jsx` | Menú según la sesión y el rol, y "Cerrar sesión" | 5 |
| `TarjetaProducto.test.jsx` | Datos de la tarjeta y botón "Añadir" (con mock del carrito) | 2 |
| `validacionesUsuario.test.js` | Reglas del formulario de usuarios (correo, RUN y uso de un mock de validación) | 3 |
| `validaciones.test.js` | Formularios de producto y de blog, formato de fecha y resolución de imágenes | 10 |
| `paginas.test.jsx` | Páginas Nosotros y Blogs (con datos simulados del backend y error de conexión) y totales del dashboard | 4 |

El entorno de pruebas se configura en `vite.config.js` (jsdom y cobertura) y en `src/test/setup.js` (limpieza automática entre pruebas y matchers de jest-dom).

## Integrantes

| Integrante | Parte del proyecto |
|---|---|
| Daniel Soto | Catálogo y carrito de compras, menú con sesión, protección del panel admin, integración del proyecto y configuración de las pruebas con Vitest |
| Nicolás Delgado | Inicio de sesión, registro, contacto y validación del RUN |
| Rosa Meza | Páginas institucionales (Nosotros y Blogs) y panel de administración |
| Cristopher Moreno | Formularios del administrador (productos y usuarios) y sus validaciones |

## Alcance y limitaciones

- Necesita el backend encendido; sin él, las páginas muestran "No se pudo conectar con el servidor".
- La sesión se guarda en `localStorage` (así sobrevive a recargar la página). El token de acceso dura poco (15 minutos) y el de renovación puede revocarse al cerrar sesión; una alternativa más segura sería una cookie `httpOnly`.
- Las fotos de los productos son las de `src/assets`: el backend guarda solo el nombre del archivo (por ejemplo `cilindro-11kg.jpg`). Si un producto nuevo usa un nombre que no existe en `src/assets`, se muestra el ícono de su categoría.
- Los precios son pesos enteros (el backend no admite decimales).
- Un Vendedor solo consulta; no puede comprar ni modificar nada.
