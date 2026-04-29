# 📱 Maintenance Pro - Application Mobile de Gestion de Maintenance

---

## 1. 📖 Titre du projet

**Maintenance Pro** - Application mobile de gestion des tickets de maintenance pour équipements de salles et laboratoires

---

## 2. 🎯 Description du projet

**Maintenance Pro** est une application mobile Android développée dans le cadre d'un projet de fin d'études. Elle permet aux utilisateurs (étudiants, enseignants, personnel technique) de signaler facilement les pannes d'équipements dans les salles de cours et laboratoires.

L'application communique avec une API REST sécurisée (Node.js + JWT) et une base de données MySQL. Elle offre une interface moderne et intuitive pour le suivi des tickets de maintenance.

---

## 3. ✨ Fonctionnalités

### 🔐 Authentification
- Connexion sécurisée avec JWT (JSON Web Token)
- Gestion des rôles : Utilisateur, Technicien, Administrateur

### 🎫 Gestion des tickets
- ✅ Affichage de la liste des tickets
- ✅ Création d'un nouveau ticket :
  - Sélection d'un équipement
  - Description de la panne
  - Choix de priorité (Faible / Moyenne / Élevée)
- ✅ Consultation du statut d'un ticket :
  - Ouvert
  - En cours
  - Résolu
  - Fermé
- ✅ Consultation de l'historique des actions
- ✅ Consultation de la réponse du technicien

### 🖥️ Interface utilisateur
- Design moderne (Material Design)
- Badges colorés pour les statuts
- Barres de priorité visuelles
- Animation au chargement

---

## 4. 🛠️ Technologies utilisées

### Langage & Framework
| Technologie | Version |
|-------------|---------|
| Kotlin | 1.8+ |
| Android SDK | API 24+ |
| Material Design | 1.11+ |

### Bibliothèques principales
| Bibliothèque | Utilité |
|--------------|---------|
| **Retrofit** | Communication avec l'API REST |
| **Coroutines** | Programmation asynchrone |
| **ViewModel** | Gestion des données liées au cycle de vie |
| **LiveData** | Observation des données |
| **RecyclerView** | Affichage des listes |
| **CardView** | Cartes modernes |
| **Glide** | Chargement d'images |
| **Gson** | Parsing JSON |

### Backend associé
| Technologie | Utilité |
|-------------|---------|
| Node.js | API REST |
| JWT | Authentification |
| MySQL | Base de données |
| Bcrypt | Hash des mots de passe |

---

## 5. 📸 Captures d'écran


### Écran de connexion

### Liste des tickets

### Création d'un ticket

### Détail d'un ticket avec historique


## 6. ⚙️ Installation et exécution

### Prérequis

| Logiciel | Version |
|----------|---------|
| Android Studio | Hedgehog ou supérieur |
| JDK | 17 |
| Backend Node.js | 18+ |
| MySQL | 8.0+ |

---

### Étapes d'installation

#### 1. Cloner le projet

```bash
git clone https://github.com/Salakhal/equipment-maintenance-platform.git
cd maintenance-pro-android
```
 ## 2. Configurer le backend

```
cd backend
npm install
npm run dev

```
## 3. Configurer la base de données

- Créer une base de données MySQL
- Importer le fichier `database.sql`
- Modifier les identifiants dans le fichier `.env`

---

## 4. Configurer l'application Android

- Ouvrir le projet dans Android Studio
- Modifier l'URL de l'API dans `Constants.kt` :

```kotlin
object Constants {
    const val BASE_URL = "http://10.0.2.2:3000/api/" // Pour émulateur
    // const val BASE_URL = "http://192.168.1.X:3000/api/" // Pour appareil physique
}
```

## 5. Lancer l'application

- Synchroniser le projet (`Sync Now`)
- Exécuter sur émulateur ou appareil physique ▶️

---

### 👥 Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Utilisateur | `ali@gmail.com` | `Ali@2026` |
| Technicien | `bahia@gmail.com` | `Hlla123456` |
| Administrateur | `lakhalsalma18@gmail.com` | `temp123` |

---


##  Remerciements

- À l'encadrant pour son accompagnement
- Aux développeurs des bibliothèques open source utilisées

---


## 8.  Auteur

**Étudiant** : LAKHAL SALMA

**Établissement** : ENS Marrakech - Département Informatique  

**Année universitaire** : 2025/2026  

**Encadrant** : Pr. Mohamed LACHGAR


---

## 📄 Licence

Ce projet est développé à des fins pédagogiques dans le cadre d'un projet de fin d'études.

---

## 🔗 Liens utiles

- [Schéma de la base de données](./DATABASE.md)



