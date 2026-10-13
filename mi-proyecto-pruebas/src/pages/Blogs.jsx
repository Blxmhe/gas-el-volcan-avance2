// src/pages/Blogs.jsx
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

export default function Blogs({ setPagina }) {
  const articulos = [
    {
      id: 'blog-detalle-1',
      titulo: 'Consejos de seguridad con el gas',
      descripcion: '¿Sabías que el gas no tiene olor? Te explicamos por qué huele y qué hacer ante una fuga.',
    },
    {
      id: 'blog-detalle-2',
      titulo: '¿Cómo ahorrar gas en invierno?',
      descripcion: '4 consejos simples para que tu balón de gas dure hasta 30% más.',
    },
  ];

  return (
    <Container className="my-5">
      <h1 className="mb-2">Nuestro Blog</h1>
      <p className="text-muted mb-4">Consejos, seguridad y ahorro para tu hogar.</p>

      <Row className="g-4">
        {articulos.map((art) => (
          <Col md={6} key={art.id}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title className="text-danger">{art.titulo}</Card.Title>
                <Card.Text>{art.descripcion}</Card.Text>
                <Button variant="outline-danger" onClick={() => setPagina(art.id)}>
                  Leer más →
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}