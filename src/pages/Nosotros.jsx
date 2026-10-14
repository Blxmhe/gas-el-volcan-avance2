// src/pages/Nosotros.jsx
import React from 'react';
import { Container, Card } from 'react-bootstrap';

export default function Nosotros() {
  return (
    <Container className="my-5">
      {/* Video Embebido (RF11) */}
      <div className="ratio ratio-16x9 mb-4 rounded shadow">
        <video controls autoPlay muted loop>
          <source src="/video/camiones-gas.mp4" type="video/mp4" />
          Tu navegador no soporta la reproducción de video.
        </video>
      </div>

      {/* Historia de la empresa */}
      <Card className="p-4 shadow-sm mb-4">
        <Card.Body>
          <h2 className="mb-3 text-primary">Nuestra Historia</h2>
          <p>
            Gas El Volcán nació en 1998 en Chillán como un negocio familiar dedicado a repartir
            cilindros de gas licuado puerta a puerta en la Región de Ñuble. Durante casi tres
            décadas hemos crecido a pulso: partimos anotando pedidos en un cuaderno y hoy
            respondemos entre 80 y 120 pedidos diarios.
          </p>
        </Card.Body>
      </Card>

      {/* Equipo Desarrollador */}
      <Card className="p-4 shadow-sm">
        <Card.Body>
          <h3 className="mb-3">Equipo Desarrollador</h3>
          <p>Proyecto desarrollado por estudiantes de Ingeniería en Informática de Duoc UC:</p>
          <ul>
            <li>Daniel Soto</li>
            <li>Cristopher Moreno</li>
            <li>Rosa Meza</li>
            <li>Nicolás Delgado</li>
          </ul>
        </Card.Body>
      </Card>
    </Container>
  );
}