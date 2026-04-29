const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// INSCRIPTION
const register = async (req, res) => {
    try {
        const { name, email, password, role = 'user' } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Nom, email et mot de passe requis.' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères.' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Email invalide.' });
        }

        // Vérifier si l'email existe déjà
        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 10);

        // Insérer l'utilisateur
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );

        res.status(201).json({
            success: true,
            message: 'Utilisateur créé avec succès.',
            user: { id: result.insertId, name, email, role }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de l\'inscription.' });
    }
};

// CONNEXION
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis.' });
        }

        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        const { password: _, ...userWithoutPassword } = user;

        res.json({
            success: true,
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la connexion.' });
    }
};

// MOT DE PASSE OUBLIÉ
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email requis' });
        }

        // Vérifier si l'utilisateur existe
        const [users] = await db.query('SELECT id, email FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            // Pour des raisons de sécurité, on ne révèle pas que l'email n'existe pas
            return res.status(200).json({ 
                success: true, 
                message: 'Si cet email existe, un lien de réinitialisation vous a été envoyé' 
            });
        }

        const user = users[0];

        // Générer un token sécurisé
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // Expiration dans 15 minutes
        const resetExpires = new Date(Date.now() + 15 * 60 * 1000);

        // Sauvegarder le token dans la base
        await db.query(
            'UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?',
            [resetToken, resetExpires, user.id]
        );

        // Générer le lien de réinitialisation
        const resetLink = `http://localhost:3001/reset-password/${resetToken}`;

        // En environnement de développement, on retourne le lien
        // En production, envoyer un email ici
        console.log('🔗 Lien de réinitialisation:', resetLink);

        res.json({
            success: true,
            message: 'Un lien de réinitialisation a été envoyé',
            resetLink: resetLink
        });

    } catch (error) {
        console.error('Erreur forgot password:', error);
        res.status(500).json({ error: 'Erreur lors de la demande de réinitialisation' });
    }
};

// RÉINITIALISATION DU MOT DE PASSE
const resetPassword = async (req, res) => {
    try {
        const { token, password, confirmPassword } = req.body;

        if (!token || !password || !confirmPassword) {
            return res.status(400).json({ error: 'Token, mot de passe et confirmation requis' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Les mots de passe ne correspondent pas' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
        }

        // Vérifier le token
        const [users] = await db.query(
            'SELECT id, email FROM users WHERE reset_token = ? AND reset_expires > NOW()',
            [token]
        );

        if (users.length === 0) {
            return res.status(400).json({ error: 'Token invalide ou expiré' });
        }

        const user = users[0];

        // Hasher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 10);

        // Mettre à jour le mot de passe et supprimer le token
        await db.query(
            'UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?',
            [hashedPassword, user.id]
        );

        res.json({
            success: true,
            message: 'Mot de passe réinitialisé avec succès'
        });

    } catch (error) {
        console.error('Erreur reset password:', error);
        res.status(500).json({ error: 'Erreur lors de la réinitialisation' });
    }
};

// PROFIL UTILISATEUR
const getMe = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé.' });
        }

        res.json(users[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération du profil.' });
    }
};

// EXPORTS
module.exports = { 
    register, 
    login, 
    getMe, 
    forgotPassword, 
    resetPassword 
};