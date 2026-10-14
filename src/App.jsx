import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CarritoProvider } from './context/CarritoContext'
import Menu from './components/Menu'
import PiePagina from './components/PiePagina'
import Home from './pages/Home'
import Productos from './pages/Productos'
import ProductoDetalle from './pages/ProductoDetalle'
import Nosotros from './pages/Nosotros'
import Blogs from './pages/Blogs'
import Contacto from './pages/Contacto'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Carrito from './pages/Carrito'
import './App.css'

function App() {
  return (
    <CarritoProvider>
      <BrowserRouter>
        {/* min-vh-100 + flex-grow-1: el footer queda abajo aunque la página tenga poco contenido */}
        <div className="d-flex flex-column min-vh-100">
          <Menu />
          <div className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/productos/:codigo" element={<ProductoDetalle />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/carrito" element={<Carrito />} />
            </Routes>
          </div>
          <PiePagina />
        </div>
      </BrowserRouter>
    </CarritoProvider>
  )
}

export default App
