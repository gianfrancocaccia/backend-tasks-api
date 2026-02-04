const express = require('express');
const cors = require('cors');
const conectarDB = require('./config/db');
require('dotenv').config();

const app = express();


app.use(cors());
app.use(express.json());


conectarDB();


const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API Funcionando 🚀');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    ok: false,
    msg: 'Error interno en el servidor',
    error: err.message
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
