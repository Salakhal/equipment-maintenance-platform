const db = require('../config/db');

const getStats = async (req, res) => {
    try {
        const userRole = req.user.role;
        const userId = req.user.id;
        
        console.log('=== DASHBOARD STATS ===');
        console.log('Role:', userRole);
        console.log('UserId:', userId);

        let totalTickets = 0;
        let openTickets = 0;
        let inProgressTickets = 0;
        let resolvedTickets = 0;
        let closedTickets = 0;
        let urgentTickets = 0;
        let priorityStats = [];
        let topEquipments = [];

        if (userRole === 'admin' || userRole === 'tech') {
            // ==============================================
            // ADMIN ou TECH : Statistiques globales
            // ==============================================
            console.log('📊 Mode: STATISTIQUES GLOBALES');
            
            // Total tickets
            const [total] = await db.query('SELECT COUNT(*) as count FROM maintenance_tickets');
            totalTickets = total[0].count;
            
            // Tickets par statut
            const [open] = await db.query("SELECT COUNT(*) as count FROM maintenance_tickets WHERE status = 'open'");
            openTickets = open[0].count;
            
            const [inProgress] = await db.query("SELECT COUNT(*) as count FROM maintenance_tickets WHERE status = 'in_progress'");
            inProgressTickets = inProgress[0].count;
            
            const [resolved] = await db.query("SELECT COUNT(*) as count FROM maintenance_tickets WHERE status = 'resolved'");
            resolvedTickets = resolved[0].count;
            
            const [closed] = await db.query("SELECT COUNT(*) as count FROM maintenance_tickets WHERE status = 'closed'");
            closedTickets = closed[0].count;
            
            // Tickets urgents
            const [urgent] = await db.query("SELECT COUNT(*) as count FROM maintenance_tickets WHERE priority = 'high' AND status != 'closed'");
            urgentTickets = urgent[0].count;
            
            // Tickets par priorité
            const [priority] = await db.query(`
                SELECT priority, COUNT(*) as count 
                FROM maintenance_tickets 
                GROUP BY priority
            `);
            priorityStats = priority;
            
            // Équipements les plus signalés
            const [topEq] = await db.query(`
                SELECT e.name, COUNT(t.id) as ticket_count
                FROM maintenance_tickets t
                JOIN equipments e ON t.equipment_id = e.id
                GROUP BY t.equipment_id, e.name
                ORDER BY ticket_count DESC
                LIMIT 5
            `);
            topEquipments = topEq;
            
        } else {
            // ==============================================
            // USER : Statistiques personnelles
            // ==============================================
            console.log('📊 Mode: STATISTIQUES PERSONNELLES (UserId:', userId, ')');
            
            // Total tickets de l'utilisateur
            const [total] = await db.query(
                'SELECT COUNT(*) as count FROM maintenance_tickets WHERE user_id = ?',
                [userId]
            );
            totalTickets = total[0].count;
            
            // Tickets par statut (filtrés par user)
            const [open] = await db.query(
                "SELECT COUNT(*) as count FROM maintenance_tickets WHERE user_id = ? AND status = 'open'",
                [userId]
            );
            openTickets = open[0].count;
            
            const [inProgress] = await db.query(
                "SELECT COUNT(*) as count FROM maintenance_tickets WHERE user_id = ? AND status = 'in_progress'",
                [userId]
            );
            inProgressTickets = inProgress[0].count;
            
            const [resolved] = await db.query(
                "SELECT COUNT(*) as count FROM maintenance_tickets WHERE user_id = ? AND status = 'resolved'",
                [userId]
            );
            resolvedTickets = resolved[0].count;
            
            const [closed] = await db.query(
                "SELECT COUNT(*) as count FROM maintenance_tickets WHERE user_id = ? AND status = 'closed'",
                [userId]
            );
            closedTickets = closed[0].count;
            
            // Tickets urgents de l'utilisateur
            const [urgent] = await db.query(
                "SELECT COUNT(*) as count FROM maintenance_tickets WHERE user_id = ? AND priority = 'high' AND status != 'closed'",
                [userId]
            );
            urgentTickets = urgent[0].count;
            
            // Tickets par priorité (filtrés par user)
            const [priority] = await db.query(`
                SELECT priority, COUNT(*) as count 
                FROM maintenance_tickets 
                WHERE user_id = ?
                GROUP BY priority
            `, [userId]);
            priorityStats = priority;
            
            // Équipements les plus signalés par l'utilisateur
            const [topEq] = await db.query(`
                SELECT e.name, COUNT(t.id) as ticket_count
                FROM maintenance_tickets t
                JOIN equipments e ON t.equipment_id = e.id
                WHERE t.user_id = ?
                GROUP BY t.equipment_id, e.name
                ORDER BY ticket_count DESC
                LIMIT 5
            `, [userId]);
            topEquipments = topEq;
        }
        
        // Log des résultats
        console.log('📈 Résultats:', {
            total: totalTickets,
            open: openTickets,
            in_progress: inProgressTickets,
            resolved: resolvedTickets,
            closed: closedTickets,
            urgent: urgentTickets,
            by_priority: priorityStats,
            top_equipments: topEquipments
        });

        res.json({
            total: totalTickets,
            open: openTickets,
            in_progress: inProgressTickets,
            resolved: resolvedTickets,
            closed: closedTickets,
            urgent: urgentTickets,
            by_priority: priorityStats,
            top_equipments: topEquipments
        });

    } catch (error) {
        console.error(' Erreur dashboard:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
    }
};

module.exports = { getStats };