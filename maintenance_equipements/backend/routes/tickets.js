const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { authenticateToken, checkRole, isTechOrAdmin } = require('../middleware/auth');

// Routes accessibles selon rôle
router.get('/', authenticateToken, ticketController.getAllTickets);
router.get('/:id', authenticateToken, ticketController.getTicketById);
router.post('/', authenticateToken, ticketController.createTicket);

// Routes pour techniciens et admins
router.patch('/:id/status', authenticateToken, isTechOrAdmin, ticketController.updateTicketStatus);
router.post('/:id/comments', authenticateToken, isTechOrAdmin, ticketController.addComment);

// Routes admin uniquement
router.patch('/:id/assign', authenticateToken, checkRole(['admin']), ticketController.assignTechnician);

module.exports = router;