const userRoutes = require('./routes/users');

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import des routes
const authRoutes = require('./routes/auth');
const equipmentRoutes = require('./routes/equipments');
const ticketRoutes = require('./routes/tickets');
const dashboardRoutes = require('./routes/dashboard');

// Utilisation des routes
app.use('/api/auth', authRoutes);
app.use('/api/equipments', equipmentRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);

// Route de test
app.get('/', (req, res) => {
    res.json({ 
        message: 'API Maintenance - Système de gestion de maintenance',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            equipments: '/api/equipments',
            tickets: '/api/tickets',
            dashboard: '/api/dashboard'
        }
    });
});

// Middleware d'erreur global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Quelque chose s\'est mal passé !' });
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${port}`);
});