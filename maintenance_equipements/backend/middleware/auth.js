const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Accès non autorisé. Token manquant.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token invalide ou expiré.' });
        }
        req.user = user;
        next();
    });
};

const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Non authentifié.' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: `Accès refusé. Rôle requis: ${allowedRoles.join(', ')}` 
            });
        }

        next();
    };
};

// Vérifier si l'utilisateur est technicien ou admin
const isTechOrAdmin = (req, res, next) => {
    if (!req.user || (req.user.role !== 'tech' && req.user.role !== 'admin')) {
        return res.status(403).json({ error: 'Accès réservé aux techniciens et administrateurs.' });
    }
    next();
};

module.exports = { authenticateToken, checkRole, isTechOrAdmin };