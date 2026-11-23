import { useEffect, useState } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import EstadoCarga from '../components/EstadoCarga';
import { resolverImagen } from '../data/imagenes';
import { mensajeDeError } from '../services/api';
import BlogsService from '../services/blogsService';
import { formatearFecha } from '../utils/formatearFecha';

// Un artículo del blog (GET /api/v1/blogs/{id}). Reemplaza a las dos páginas fijas BlogDetalle1 y BlogDetalle2.
export default function BlogDetalle() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;
    BlogsService.obtener(id)
      .then((encontrado) => {
        if (activo) setBlog(encontrado);
      })
      .catch((e) => {
        if (activo) {
          setError(e.response?.status === 404 ? 'No existe el artículo que buscas.' : mensajeDeError(e));
        }
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, [id]);

  return (
    <Container className="my-5" style={{ maxWidth: '800px' }}>
      <Card className="shadow-sm p-4">
        <Card.Body>
          <EstadoCarga cargando={cargando} error={error} textoCargando="Cargando artículo…" />

          {blog && (
            <>
              <h1>{blog.titulo}</h1>
              <p className="text-muted">
                <small>
                  {formatearFecha(blog.fechaPublicacion)}
                  {blog.categoria ? ` - ${blog.categoria}` : ''}
                </small>
              </p>
              <hr />
              {blog.imagen && (
                <img
                  src={resolverImagen(blog.imagen)}
                  alt={blog.titulo}
                  className="img-fluid rounded mb-3"
                  onError={(evento) => {
                    // Si la imagen no existe, se oculta en vez de mostrar el ícono roto
                    evento.currentTarget.style.display = 'none';
                  }}
                />
              )}
              {/* pre-line respeta los saltos de línea que escribió el administrador */}
              <p style={{ whiteSpace: 'pre-line' }}>{blog.contenido}</p>
            </>
          )}

          <Button variant="secondary" className="mt-3" as={Link} to="/blogs">
            ← Volver a Blogs
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}
