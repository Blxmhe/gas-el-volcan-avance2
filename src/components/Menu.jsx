import { Container, Nav, Navbar } from 'react-bootstrap'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { useCarrito } from '../context/useCarrito'
import logo from '../assets/logo.jpg'
import './Menu.css'

const enlacesPrincipales = [
  { to: '/', texto: 'Home' },
  { to: '/productos', texto: 'Productos' },
  { to: '/nosotros', texto: 'Nosotros' },
  { to: '/blogs', texto: 'Blogs' },
  { to: '/contacto', texto: 'Contacto' },
]

function Menu() {
  const { totalUnidades } = useCarrito()
  const navigate = useNavigate()

  // usuario es null si nadie ha iniciado sesión; el Menú se redibuja solo cuando cambia la sesión
  const { usuario, puedeAdministrar, esCliente, logout } = useAuth()

  async function cerrarSesion() {
    await logout()
    navigate('/')
  }

  return (
    <Navbar expand="lg" className="menu">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="menu-logo">
          <img src={logo} alt="Logo Gas El Volcán" />
          <span>Gas El Volcán</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="menu-principal" />

        <Navbar.Collapse id="menu-principal">
          <Nav className="menu-principal mx-auto">
            {enlacesPrincipales.map(({ to, texto }) => (
              <Nav.Link key={to} as={NavLink} to={to} end={to === '/'}>
                {texto}
              </Nav.Link>
            ))}
          </Nav>

          <Nav className="acciones-usuario">
            {usuario ? (
              <>
                {puedeAdministrar && (
                  <Nav.Link as={NavLink} to="/admin" className="btn-admin">
                    Ir a Admin
                  </Nav.Link>
                )}
                {esCliente && (
                  <Nav.Link as={NavLink} to="/mis-pedidos" className="btn-admin">
                    Mis pedidos
                  </Nav.Link>
                )}
                <Nav.Link as="span" className="saludo-usuario">
                  👤 {usuario.nombre.split(' ')[0]}
                </Nav.Link>
                <Nav.Link onClick={cerrarSesion} className="btn-logout">
                  Cerrar sesión
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login" className="btn-login">
                  Iniciar sesión
                </Nav.Link>
                <Nav.Link as={NavLink} to="/registro" className="btn-registro">
                  Registrar usuario
                </Nav.Link>
              </>
            )}
            <Nav.Link as={NavLink} to="/carrito" className="btn-carrito">
              🛒 Cart ({totalUnidades})
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Menu