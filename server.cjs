const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type'] }));
app.use(express.json());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/gas_volcan')
  .then(() => console.log('✅ Conectado a MongoDB: gas_volcan'))
  .catch(err => console.error('❌ Error de conexión:', err.message));

// --- MODELOS ---

// Modelo de Producto
const productoSchema = new mongoose.Schema({
  _id: String,
  nombre: String,
  descripcion: String,
  categoria: String,
  precios: { residencial: Number, comercial: Number },
  stock: Number,
  stock_critico: Number,
  imagen: String
}, { collection: 'productos', strict: false });
const Producto = mongoose.model('Producto', productoSchema);

// Modelo de Historial
const historialSchema = new mongoose.Schema({}, { strict: false, collection: 'historial_productos' });
const Historial = mongoose.model('Historial', historialSchema);

// Modelo de Cliente (Corregido)
const clienteSchema = new mongoose.Schema({_id: Number}, { strict: false, collection: 'clientes' });
const Cliente = mongoose.model('Cliente', clienteSchema);

// Modelo de Pedidos (CORREGIDO: nombre distinto)
const pedidoSchema = new mongoose.Schema({_id: Number}, { strict: false, collection: 'pedidos' });
const Pedidos = mongoose.model('Pedidos', pedidoSchema);

// --- ENDPOINTS ---

// Obtener todos los productos
app.get('/api/productos', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un producto por código
app.get('/api/productos/:codigo', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.codigo);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ACTUALIZAR un producto CON auditoría
app.put('/api/productos/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    const datosNuevos = req.body;

    const anterior = await Producto.findById(codigo);
    if (!anterior) return res.status(404).json({ error: 'Producto no encontrado' });

    await Producto.collection.updateOne(
      { _id: codigo },
      { $set: datosNuevos },
      { bypassDocumentValidation: true }
    );

    const actualizado = await Producto.findById(codigo);

        // Auditoría (con try-catch separado)
    try {
      await Historial.collection.insertOne({
        fecha: new Date(),
        codigo_producto: codigo,              // ✅ Corregido (guión bajo, no "zens")
        tipo_operacion: "EDICION_WEB",
        valor_anterior: { 
          nombre: anterior.nombre, 
          precio: anterior.precios?.residencial, 
          stock: anterior.stock 
        },
        valor_nuevo: { 
          nombre: actualizado.nombre, 
          precio: actualizado.precios?.residencial, 
          stock: actualizado.stock 
        }
      }, { bypassDocumentValidation: true }); // ✅ Como segundo argumento
      console.log('✅ Auditoría guardada');
    } catch (histError) {
      console.warn('⚠️ No se pudo guardar en historial:', histError.message);
    }

    res.json(actualizado);
  } catch (e) {
    console.error('❌ Error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// Obtener clientes
app.get('/api/clientes', async (req, res) => {
  try {
    const clientes = await Cliente.find().lean();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener pedidos
app.get('/api/pedidos', async (req, res) => {
  try {
    const pedidos = await Pedidos.find().lean();
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener historial
app.get('/api/historial', async (req, res) => {
  try {
    const historial = await Historial.find().sort({ fecha: -1 });
    res.json(historial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});