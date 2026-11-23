import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EstadoCarga from "../components/EstadoCarga";
import { mensajeDeError } from "../services/api";
import BlogsService from "../services/blogsService";
import { formatearFecha } from "../utils/formatearFecha";

// Lista de artículos del blog (vienen del backend: GET /api/v1/blogs, público)
export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;
    BlogsService.listar()
      .then((lista) => {
        if (activo) setBlogs(lista);
      })
      .catch((e) => {
        if (activo) setError(mensajeDeError(e, "No se pudo cargar el blog."));
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, []);

  return (
    <div className="container my-5">
      <h2 className="fw-bold mb-1">Nuestro Blog</h2>
      <p className="text-muted mb-4">Consejos, seguridad y ahorro para tu hogar.</p>

      <EstadoCarga cargando={cargando} error={error} textoCargando="Cargando artículos…" />

      {!cargando && !error && blogs.length === 0 && <p>Todavía no hay artículos publicados.</p>}

      {blogs.map((blog) => (
        <div className="card mb-4 shadow-sm" key={blog.id}>
          <div className="card-body">
            <h4 className="card-title text-danger fw-bold">{blog.titulo}</h4>
            <p className="text-muted small mb-2">
              {formatearFecha(blog.fechaPublicacion)}
              {blog.categoria ? ` - ${blog.categoria}` : ""}
            </p>
            <p className="card-text">{blog.resumen}</p>
            <Link to={`/blogs/${blog.id}`} className="btn btn-outline-danger">
              Leer más &rarr;
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
