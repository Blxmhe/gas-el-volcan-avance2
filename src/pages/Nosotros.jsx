import React from 'react';

const Nosotros = () => {
  const fundadores = [
    { nombre: 'Fundador 1', cargo: 'Director General', imagen: 'https://via.placeholder.com/150' },
    { nombre: 'Fundador 2', cargo: 'Jefe de Operaciones', imagen: 'https://via.placeholder.com/150' },
    { nombre: 'Fundador 3', cargo: 'Gerente de Logística', imagen: 'https://via.placeholder.com/150' },
    { nombre: 'Fundador 4', cargo: 'Coordinador de Servicios', imagen: 'https://via.placeholder.com/150' }
  ];

  return (
    <div className="container py-5">
      {/* Encabezado e Historia */}
      <section className="mb-5 text-center">
        <h1 className="display-4 fw-bold text-primary mb-3">Nuestra Historia</h1>
        <p className="lead mx-auto" style={{ maxWidth: '800px' }}>
          Desde nuestros inicios, en <strong>Gas El Volcán</strong> nos hemos dedicado a abastecer a miles de hogares y empresas con soluciones energéticas eficientes, seguras y al mejor precio del mercado. Nuestra trayectoria se basa en la puntualidad, el respeto y el compromiso continuo con cada uno de nuestros clientes.
        </p>
      </section>

      {/* Video de Camiones */}
      <section className="mb-5 text-center">
        <div className="ratio ratio-16x9 shadow rounded overflow-hidden mx-auto" style={{ maxWidth: '900px' }}>
          <video controls autoPlay loop muted>
            <source src="/video/camiones-gas.mp4" type="video/mp4" />
            Tu navegador no soporta la reproducción de video.
          </video>
        </div>
      </section>

      {/* Sección: ¿Por qué elegirnos? */}
      <section className="mb-5 py-4 bg-light rounded shadow-sm px-4">
        <h2 className="text-center mb-4 fw-bold">¿Por qué elegirnos?</h2>
        <div className="row text-center g-4">
          <div className="col-md-4">
            <div className="p-3">
              <i className="bi bi-shield-check display-5 text-primary mb-3"></i>
              <h4 className="fw-bold">Seguridad Garantizada</h4>
              <p>Cumplimos con estrictas normas de calidad e inspección periódica en cada cilindro.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3">
              <i className="bi bi-truck display-5 text-primary mb-3"></i>
              <h4 className="fw-bold">Entrega Rápida</h4>
              <p>Flotas distribuidas estratégicamente para responder a tu llamado a tiempo récord.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3">
              <i className="bi bi-piggy-bank display-5 text-primary mb-3"></i>
              <h4 className="fw-bold">Precios Justos</h4>
              <p>Ofrecemos tarifas competitivas y transparentes en todos nuestros cilindros y formatos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección: Nuestros Fundadores */}
      <section className="mb-5 text-center">
        <h2 className="mb-4 fw-bold">Nuestros Fundadores</h2>
        <div className="row g-4">
          {fundadores.map((item, idx) => (
            <div key={idx} className="col-6 col-md-3">
              <div className="card h-100 border-0 shadow-sm">
                <img src={item.imagen} className="card-img-top rounded-circle p-3" alt={item.nombre} />
                <div className="card-body">
                  <h5 className="card-title fw-bold">{item.nombre}</h5>
                  <p className="card-text text-muted small">{item.cargo}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sección: Nuestro Compromiso */}
      <section className="p-4 bg-primary text-white rounded shadow text-center">
        <h3 className="fw-bold mb-2">Nuestro Compromiso</h3>
        <p className="mb-0 mx-auto" style={{ maxWidth: '750px' }}>
          Trabajamos día a día para brindarte un servicio confiable que promueva el bienestar y desarrollo de tu comunidad, manteniendo el enfoque en la sostenibilidad y el servicio humano.
        </p>
      </section>
    </div>
  );
};

export default Nosotros;