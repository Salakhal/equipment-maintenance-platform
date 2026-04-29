const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');
const { authenticateToken, checkRole } = require('../middleware/auth');

// Routes publiques (authentification requise mais tous les rôles)
router.get('/', authenticateToken, equipmentController.getAllEquipments);
router.get('/:id', authenticateToken, equipmentController.getEquipmentById);

// Routes admin uniquement
router.post('/', authenticateToken, checkRole(['admin']), equipmentController.createEquipment);
router.put('/:id', authenticateToken, checkRole(['admin']), equipmentController.updateEquipment);
router.delete('/:id', authenticateToken, checkRole(['admin']), equipmentController.deleteEquipment);

module.exports = router;