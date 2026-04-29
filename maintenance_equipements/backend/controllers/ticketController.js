const db = require('../config/db');

// Fonction utilitaire pour ajouter un log
const addTicketLog = async (ticketId, userId, action, oldValue = null, newValue = null) => {
    await db.query(
        'INSERT INTO ticket_logs (ticket_id, user_id, action, old_value, new_value) VALUES (?, ?, ?, ?, ?)',
        [ticketId, userId, action, oldValue, newValue]
    );
};

// Obtenir les tickets (selon rôle)
const getAllTickets = async (req, res) => {
    try {
        let query = `
            SELECT 
                t.*,
                e.name as equipment_name,
                e.room as equipment_room,
                u.name as user_name,
                tech.name as technician_name
            FROM maintenance_tickets t
            LEFT JOIN equipments e ON t.equipment_id = e.id
            LEFT JOIN users u ON t.user_id = u.id
            LEFT JOIN users tech ON t.technician_id = tech.id
            WHERE 1=1
        `;
        const params = [];

        // Filtres selon rôle
        if (req.user.role === 'user') {
            query += ' AND t.user_id = ?';
            params.push(req.user.id);
        }

        // Filtres optionnels
        if (req.query.status) {
            query += ' AND t.status = ?';
            params.push(req.query.status);
        }

        if (req.query.priority) {
            query += ' AND t.priority = ?';
            params.push(req.query.priority);
        }

        if (req.query.equipment_id) {
            query += ' AND t.equipment_id = ?';
            params.push(req.query.equipment_id);
        }

        query += ' ORDER BY t.created_at DESC';

        const [tickets] = await db.query(query, params);
        res.json(tickets);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des tickets.' });
    }
};

// Obtenir un ticket par ID
const getTicketById = async (req, res) => {
    try {
        const [tickets] = await db.query(`
            SELECT 
                t.*,
                e.name as equipment_name,
                u.name as user_name,
                tech.name as technician_name
            FROM maintenance_tickets t
            LEFT JOIN equipments e ON t.equipment_id = e.id
            LEFT JOIN users u ON t.user_id = u.id
            LEFT JOIN users tech ON t.technician_id = tech.id
            WHERE t.id = ?
        `, [req.params.id]);

        if (tickets.length === 0) {
            return res.status(404).json({ error: 'Ticket non trouvé.' });
        }

        const ticket = tickets[0];

        // Vérifier si l'utilisateur a le droit de voir ce ticket
        if (req.user.role === 'user' && ticket.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Vous ne pouvez voir que vos propres tickets.' });
        }

        // Récupérer les logs
        const [logs] = await db.query(`
            SELECT l.*, u.name as user_name
            FROM ticket_logs l
            LEFT JOIN users u ON l.user_id = u.id
            WHERE l.ticket_id = ?
            ORDER BY l.created_at ASC
        `, [req.params.id]);

        res.json({ ...ticket, logs });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération du ticket.' });
    }
};

// Créer un ticket (utilisateur)
const createTicket = async (req, res) => {
    try {
        const { equipment_id, description, priority = 'medium', photo_url = null } = req.body;

        if (!equipment_id || !description) {
            return res.status(400).json({ error: 'Équipement et description requis.' });
        }

        // Vérifier si l'équipement existe
        const [equipment] = await db.query('SELECT id FROM equipments WHERE id = ?', [equipment_id]);
        if (equipment.length === 0) {
            return res.status(404).json({ error: 'Équipement non trouvé.' });
        }

        // Créer le ticket
        const [result] = await db.query(
            `INSERT INTO maintenance_tickets (equipment_id, user_id, description, priority, photo_url) 
             VALUES (?, ?, ?, ?, ?)`,
            [equipment_id, req.user.id, description, priority, photo_url]
        );

        // Ajouter le log
        await addTicketLog(
            result.insertId,
            req.user.id,
            'ticket_created',
            null,
            `Ticket créé avec priorité ${priority}`
        );

        const [newTicket] = await db.query('SELECT * FROM maintenance_tickets WHERE id = ?', [result.insertId]);

        res.status(201).json({
            success: true,
            message: 'Ticket créé avec succès.',
            ticket: newTicket[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la création du ticket.' });
    }
};

// Assigner un technicien (admin uniquement)
const assignTechnician = async (req, res) => {
    try {
        const { technician_id } = req.body;
        const ticketId = req.params.id;

        const [tickets] = await db.query('SELECT * FROM maintenance_tickets WHERE id = ?', [ticketId]);
        if (tickets.length === 0) {
            return res.status(404).json({ error: 'Ticket non trouvé.' });
        }

        const ticket = tickets[0];
        const oldTechnicianId = ticket.technician_id;
        const oldTechnicianName = oldTechnicianId ? await getTechnicianName(oldTechnicianId) : 'non assigné';
        const newTechnicianName = await getTechnicianName(technician_id);

        await db.query('UPDATE maintenance_tickets SET technician_id = ? WHERE id = ?', [technician_id, ticketId]);

        await addTicketLog(
            ticketId,
            req.user.id,
            'assign_technician',
            oldTechnicianName,
            newTechnicianName
        );

        res.json({
            success: true,
            message: 'Technicien assigné avec succès.'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de l\'assignation.' });
    }
};

// Fonction utilitaire pour obtenir le nom d'un technicien
const getTechnicianName = async (technicianId) => {
    if (!technicianId) return 'non assigné';
    const [users] = await db.query('SELECT name FROM users WHERE id = ?', [technicianId]);
    return users.length > 0 ? users[0].name : 'inconnu';
};

// Changer le statut d'un ticket
const updateTicketStatus = async (req, res) => {
    try {
        const { status, resolution_comment = null } = req.body;
        const ticketId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;

        const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Statut invalide.' });
        }

        const [tickets] = await db.query('SELECT * FROM maintenance_tickets WHERE id = ?', [ticketId]);
        if (tickets.length === 0) {
            return res.status(404).json({ error: 'Ticket non trouvé.' });
        }

        const ticket = tickets[0];
        const oldStatus = ticket.status;

        // Vérifier les permissions
        if (userRole === 'user' && ticket.user_id !== userId) {
            return res.status(403).json({ error: 'Vous ne pouvez modifier que vos propres tickets.' });
        }

        // Règle métier: un ticket fermé ne peut pas être rouvert (sauf admin)
        if (oldStatus === 'closed' && status !== 'closed' && userRole !== 'admin') {
            return res.status(403).json({ error: 'Seul un administrateur peut rouvrir un ticket fermé.' });
        }

        // Mise à jour
        let query = 'UPDATE maintenance_tickets SET status = ?';
        const params = [status];

        if (status === 'resolved' && resolution_comment) {
            query += ', resolution_comment = ?';
            params.push(resolution_comment);
        }

        query += ' WHERE id = ?';
        params.push(ticketId);

        await db.query(query, params);

        // Ajouter le log
        await addTicketLog(ticketId, userId, 'status_changed', oldStatus, status);

        if (status === 'resolved' && resolution_comment) {
            await addTicketLog(ticketId, userId, 'add_resolution', null, resolution_comment);
        }

        res.json({
            success: true,
            message: 'Statut mis à jour avec succès.'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du statut.' });
    }
};

// Ajouter un commentaire technique
const addComment = async (req, res) => {
    try {
        const { comment } = req.body;
        const ticketId = req.params.id;

        if (!comment) {
            return res.status(400).json({ error: 'Commentaire requis.' });
        }

        const [tickets] = await db.query('SELECT id FROM maintenance_tickets WHERE id = ?', [ticketId]);
        if (tickets.length === 0) {
            return res.status(404).json({ error: 'Ticket non trouvé.' });
        }

        await addTicketLog(ticketId, req.user.id, 'add_comment', null, comment);

        res.json({
            success: true,
            message: 'Commentaire ajouté avec succès.'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout du commentaire.' });
    }
};

module.exports = {
    getAllTickets,
    getTicketById,
    createTicket,
    assignTechnician,
    updateTicketStatus,
    addComment
};