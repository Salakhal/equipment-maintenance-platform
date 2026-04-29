const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, checkRole } = require('../middleware/auth');

// Récupérer tous les techniciens
router.get('/technicians', authenticateToken, async (req, res) => {
    try {
        const [users] = await db.query(
            "SELECT id, name, email FROM users WHERE role = 'tech'"
        );
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des techniciens' });
    }
});

module.exports = router;