require('dotenv').config();
const express = require('express');
const cors = require('cors');


const app = express();

app.use(cors());
app.use(express.json());
const conexion = require('./config/db');

conexion.query('SELECT NOW()')
    .then(() => console.log('PostgreSQL conectado'))
    .catch((error) => console.log(error));

const usuariosRoutes = require('./routes/usuarios.routes');

app.use('/api/usuarios', usuariosRoutes);

const especiesRoutes = require('./routes/especies.routes');
app.use('/api/especies', especiesRoutes);

const ventasRoutes = require('./routes/ventas.routes');
app.use('/api/ventas', ventasRoutes);

const plagasRoutes = require('./routes/plagas.routes');
app.use('/api/plagas', plagasRoutes);

const dashboardRoutes = require('./routes/dashboard.routes');
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
    res.send('Servidor funcionando');
});

app.listen(3000, () => {
    console.log('Servidor en puerto 3000');
});