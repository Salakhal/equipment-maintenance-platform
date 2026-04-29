const bcrypt = require('bcrypt');
const db = require('../config/db');
require('dotenv').config();

const hashExistingPasswords = async () => {
    try {
        const [users] = await db.query('SELECT id, password FROM users');
        
        for (const user of users) {
            if (user.password && !user.password.startsWith('$2b$')) {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);
                console.log(`Utilisateur ${user.id} mis à jour`);
            }
        }
        
        console.log(' Tous les mots de passe ont été hachés !');
        process.exit(0);
    } catch (error) {
        console.error(' Erreur:', error);
        process.exit(1);
    }
};

hashExistingPasswords();