# 📊 Schéma de la base de données

## 📋 Description

La base de données du projet **Maintenance Pro** contient **4 tables** respectant la contrainte pédagogique du projet.

---

## 🗂️ Structure des tables

### 1. Table `users`

Stocke les informations des utilisateurs de l'application.

| Colonne | Type | Contrainte | Description |
|---------|------|------------|-------------|
| `id` | INT | PRIMARY KEY AUTO_INCREMENT | Identifiant unique |
| `name` | VARCHAR(100) | NOT NULL | Nom complet |
| `email` | VARCHAR(100) | UNIQUE NOT NULL | Email de connexion |
| `password` | VARCHAR(255) | NOT NULL | Mot de passe hashé (bcrypt) |
| `role` | ENUM('user','tech','admin') | DEFAULT 'user' | Rôle utilisateur |
| `reset_token` | VARCHAR(255) | NULL | Token réinitialisation |
| `reset_expires` | DATETIME | NULL | Expiration du token |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de création |

**Exemple de données :**

| id | name | email | role |
|----|------|-------|------|
| 1 | Ali Alami | ali@gmail.com | user |
| 2 | Bahia Jihan | bahia@gmail.com | tech |
| 3 | Salma Lakhal | lakhalsalma18@gmail.com | admin |

---

### 2. Table `equipments`

Stocke la liste des équipements dans les salles et laboratoires.

| Colonne | Type | Contrainte | Description |
|---------|------|------------|-------------|
| `id` | INT | PRIMARY KEY AUTO_INCREMENT | Identifiant unique |
| `name` | VARCHAR(100) | NOT NULL | Nom de l'équipement |
| `room` | VARCHAR(50) | NOT NULL | Salle / Laboratoire |
| `type` | VARCHAR(50) | NOT NULL | Type d'équipement |
| `status` | ENUM('operational','out_of_service') | DEFAULT 'operational' | Statut opérationnel |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date d'ajout |

**Exemple de données :**

| id | name | room | type | status |
|----|------|------|------|--------|
| 1 | Ordinateur Dell XPS 15 | Salle A101 | informatique | operational |
| 2 | Vidéoprojecteur Epson | Labo B202 | audio-visuel | operational |
| 3 | Imprimante HP LaserJet | Salle C303 | informatique | out_of_service |

---

### 3. Table `maintenance_tickets`

Stocke les tickets de maintenance créés par les utilisateurs.

| Colonne | Type | Contrainte | Description |
|---------|------|------------|-------------|
| `id` | INT | PRIMARY KEY AUTO_INCREMENT | Identifiant unique |
| `equipment_id` | INT | FOREIGN KEY | Référence vers equipments(id) |
| `user_id` | INT | FOREIGN KEY | Déclarant (users.id) |
| `technician_id` | INT | FOREIGN KEY NULL | Technicien assigné (users.id) |
| `description` | TEXT | NOT NULL | Description de la panne |
| `priority` | ENUM('low','medium','high') | DEFAULT 'medium' | Priorité |
| `status` | ENUM('open','in_progress','resolved','closed') | DEFAULT 'open' | Statut du ticket |
| `photo_url` | VARCHAR(500) | NULL | URL de la photo |
| `resolution_comment` | TEXT | NULL | Commentaire de résolution |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Dernière modification |

**Valeurs possibles :**

| Statut | Signification |
|--------|---------------|
| `open` | Ticket ouvert, en attente |
| `in_progress` | En cours de traitement |
| `resolved` | Résolu, en attente de fermeture |
| `closed` | Fermé |

| Priorité | Signification |
|----------|---------------|
| `low` | Faible |
| `medium` | Moyenne |
| `high` | Haute |

---

### 4. Table `ticket_logs`

Enregistre l'historique des actions sur chaque ticket.

| Colonne | Type | Contrainte | Description |
|---------|------|------------|-------------|
| `id` | INT | PRIMARY KEY AUTO_INCREMENT | Identifiant unique |
| `ticket_id` | INT | FOREIGN KEY | Référence vers maintenance_tickets(id) |
| `user_id` | INT | FOREIGN KEY | Utilisateur ayant fait l'action |
| `action` | VARCHAR(100) | NOT NULL | Type d'action |
| `old_value` | TEXT | NULL | Ancienne valeur |
| `new_value` | TEXT | NULL | Nouvelle valeur |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de l'action |

**Types d'actions possibles :**

| Action | Description |
|--------|-------------|
| `ticket_created` | Ticket créé |
| `status_changed` | Statut modifié |
| `assign_technician` | Technicien assigné |
| `add_comment` | Commentaire ajouté |
| `add_resolution` | Solution ajoutée |

---

## 🔗 Relations entre les tables
# ?????


---

## 📝 Script SQL complet

```sql
-- Base de données
CREATE DATABASE projet_maintenance;
USE projet_maintenance;

-- Table users
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'tech', 'admin') DEFAULT 'user',
    reset_token VARCHAR(255) NULL,
    reset_expires DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table equipments
CREATE TABLE equipments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    room VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status ENUM('operational', 'out_of_service') DEFAULT 'operational',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table maintenance_tickets
CREATE TABLE maintenance_tickets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    equipment_id INT NOT NULL,
    user_id INT NOT NULL,
    technician_id INT NULL,
    description TEXT NOT NULL,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
    photo_url VARCHAR(500) NULL,
    resolution_comment TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (equipment_id) REFERENCES equipments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (technician_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table ticket_logs
CREATE TABLE ticket_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    old_value TEXT NULL,
    new_value TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES maintenance_tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

```


