// src/pages/admin/AdminProductos.jsx
import React from 'react';
import { Table, Button } from 'react-bootstrap';
import AdminLayout from '../../components/AdminLayout';
import { productosPrueba } from '../../data/productos';

export default function AdminProductos({ setPagina }) {
  return (
    <AdminLayout paginaActual="admin-productos" setPagina={setPagina}>
      <h2>Gestión de Productos</h2>
      <Table striped bordered hover responsive className="table-admin mt-3">
        <thead className="table-dark">
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosPrueba.map((prod) => (
            <tr key={prod.codigo}>
              <td>{prod.codigo}</td>
              <td>{prod.nombre}</td>
              <td>${prod.precio.toLocaleString('es-CL')}</td>
              <td>{prod.stock}</td>
              <td>
                <Button variant="warning" size="sm">
                  Editar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </AdminLayout>
  );
}