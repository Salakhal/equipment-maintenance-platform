const db = require('../config/db');

// Obtenir tous les équipements (avec filtres optionnels)
const getAllEquipments = async (req, res) => {
    try {
        let query = 'SELECT * FROM equipments WHERE 1=1';
        const params = [];

        if (req.query.room) {
            query += ' AND room = ?';
            params.push(req.query.room);
        }

        if (req.query.type) {
            query += ' AND type = ?';
            params.push(req.query.type);
        }

        if (req.query.status) {
            query += ' AND status = ?';
            params.push(req.query.status);
        }

        query += ' ORDER BY created_at DESC';

        const [equipments] = await db.query(query, params);
        res.json(equipments);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des équipements.' });
    }
};

// Obtenir un équipement par ID
const getEquipmentById = async (req, res) => {
    try {
        const [equipments] = await db.query('SELECT * FROM equipments WHERE id = ?', [req.params.id]);

        if (equipments.length === 0) {
            return res.status(404).json({ error: 'Équipement non trouvé.' });
        }

        res.json(equipments[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'équipement.' });
    }
};

// Créer un équipement (admin uniquement)
const createEquipment = async (req, res) => {
    try {
        const { name, room, type, status = 'operational' } = req.body;

        if (!name || !room || !type) {
            return res.status(400).json({ error: 'Nom, salle et type sont requis.' });
        }

        const [result] = await db.query(
            'INSERT INTO equipments (name, room, type, status) VALUES (?, ?, ?, ?)',
            [name, room, type, status]
        );

        const [newEquipment] = await db.query('SELECT * FROM equipments WHERE id = ?', [result.insertId]);

        res.status(201).json({
            success: true,
            message: 'Équipement créé avec succès.',
            equipment: newEquipment[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la création de l\'équipement.' });
    }
};

// Mettre à jour un équipement (admin uniquement)
const updateEquipment = async (req, res) => {
    try {
        const { name, room, type, status } = req.body;
        const equipmentId = req.params.id;

        const [existing] = await db.query('SELECT id FROM equipments WHERE id = ?', [equipmentId]);
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Équipement non trouvé.' });
        }

        await db.query(
            'UPDATE equipments SET name = ?, room = ?, type = ?, status = ? WHERE id = ?',
            [name, room, type, status, equipmentId]
        );

        const [updated] = await db.query('SELECT * FROM equipments WHERE id = ?', [equipmentId]);

        res.json({
            success: true,
            message: 'Équipement mis à jour avec succès.',
            equipment: updated[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'équipement.' });
    }
};

// Supprimer un équipement (admin uniquement)
const deleteEquipment = async (req, res) => {
    try {
        const equipmentId = req.params.id;

        const [existing] = await db.query('SELECT id FROM equipments WHERE id = ?', [equipmentId]);
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Équipement non trouvé.' });
        }

        await db.query('DELETE FROM equipments WHERE id = ?', [equipmentId]);

        res.json({
            success: true,
            message: 'Équipement supprimé avec succès.'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'équipement.' });
    }
};

module.exports = {
    getAllEquipments,
    getEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment
};