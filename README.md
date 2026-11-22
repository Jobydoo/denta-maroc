# 🦷 DentaMaroc — Système de Gestion Intégrale pour Cabinet Dentaire & Laboratoire de Prothèse (Maroc)

> **Application web moderne, rapide, sécurisée et prête pour la production**, conçue spécifiquement pour les chirurgiens-dentistes, assistantes médicales et prothésistes dentaires au Maroc.
> Optimisée pour un déploiement instantané sur **GitHub + Vercel** avec base de données **PostgreSQL (Neon / Supabase)** et stockage cloud **Supabase Storage**.

---

## 🌟 1. Inspirations GitHub & Meilleures Pratiques Cliniques

L'architecture et l'ergonomie de **DentaMaroc** s'inspirent et fusionnent les concepts majeurs des projets de référence :
- **[dental-scope](https://github.com/Yoosseph/dental-scope) :** Visualisation et cartographie anatomique dentaire détaillée.
- **[react-advanced-odontogram](https://github.com/ZoliQua/React-Advanced-Odontogram) / [DentChart](https://github.com/dumcep/DentChart) :** Odontogramme interactif respectant la nomenclature internationale FDI (quadrants adultes 11-48 et dents temporaires/enfants 51-85), avec repérage des 5 faces anatomiques (occlusale, mésiale, distale, vestibulaire, linguale).
- **[page-dentalprocs](https://github.com/topics/dental-app) :** Analytique financière en temps réel, marges par procédure et rentabilité brute/nette.
- **[DentalTechnicianHandBook](https://github.com/topics/dentist-system) :** Traçabilité rigoureuse de la fabrication prothétique (du bon de commande labo avec teinte Vita jusqu'à la pose en bouche).

---

## 🛠️ 2. Stack Technique & Architecture

- **Framework :** [Next.js 14](https://nextjs.org/) (App Router) + TypeScript.
- **Design & UI :** Tailwind CSS + Lucide Icons (Design médical épuré, responsive PC / Tablette / Mobile, feuille de style d'impression A4/A5).
- **Base de Données & ORM :** PostgreSQL (compatible Neon & Supabase) piloté par [Prisma ORM](https://www.prisma.io/) avec configuration de **Connection Pooling (pgBouncer)** pour l'environnement Serverless de Vercel.
- **Authentification & Rôles (RBAC) :** [NextAuth.js](https://next-auth.js.org/) avec 3 niveaux d'accès stricts :
  1. `ADMIN` (Chirurgien-Dentiste / Gérant : vision financière totale, marges nettes, suppression et configuration).
  2. `ASSISTANT` (Secrétaire / Assistante : agenda, fiches patients, encaissements et reçus, rappels WhatsApp, sans visibilité sur le bénéfice net global).
  3. `PROTHESISTE` (Laboratoire partenaire : portail dédié pour suivre les bons de commande, étapes de fabrication et dates de livraison).
- **Stockage Cloud :** Supabase Storage pour les radiographies panoramiques, rétro-alvéolaires, scanners 3D et justificatifs de dépenses (avec fallback intelligent en développement local).
- **Monnaie & Spécificités Marocaines :** Tous les montants en **MAD (Dirham Marocain)**, intégration des mutuelles nationales (**CNOPS, CNSS, AMO, FAR, Assurances privées**), mentions fiscales légales (**ICE, IF, Patente, INPE**).

---

## 📋 3. Modules & Fonctionnalités Clés

### A. Tableau de Bord & Analytique Clinique
- **KPIs en Temps Réel :** Chiffre d'affaires du jour et du mois, Total encaissé, Reste à encaisser (crédits patients en cours), Total dépenses, **Bénéfice Net Réel**.
- **File d'Attente du Jour :** Flux des patients attendus aujourd'hui avec passage de statut en 1 clic (*Planifié* → *Confirmé* → *En salle d'attente* → *Au fauteuil / En soin* → *Terminé*).
- **Alertes Intelligentes :** Prothèses livrées à valider, chèques en portefeuille proches de l'échéance, stock de consommables sous seuil critique, anniversaires.
- **Analytique des Actes :** Graphiques de rentabilité comparant les recettes, les charges et la répartition du CA par spécialité (Prothèse, Implantologie, Soins conservateurs, Esthétique).

### B. Gestion des Patients & Fiche 360°
- **Recherche Instantanée :** Filtrage instantané par Nom, Prénom, Téléphone ou **N° CIN**.
- **Bandeau d'Alerte Médicale Critique (Anamnèse) :** Affichage rouge clignotant prioritaire en haut de dossier pour les contre-indications majeures :
  - Allergies médicamenteuses (Pénicilline, Latex, Anesthésiques locaux).
  - Traitement Anticoagulant (AVK / Sintrom — vérification INR).
  - Cardiopathies / Valvulopathies (Antibioprophylaxie requise).
  - Patientes enceintes (Précautions AINS et rayons X).
  - Prise de Biphosphonates (Risque d'ostéonécrose des mâchoires).
- **Contact Rapide :** Bouton d'appel direct et bouton **WhatsApp** pré-rempli en un clic.
- **Situation Financière :** Synthèse automatique (Total facturé, Total réglé, Solde restant dû).

### C. Dossier Clinique & Odontogramme Interactif FDI
- **Schéma Dentaire Vectoriel Interactif :**
  - Denture permanente adulte (**11 à 48**) et denture temporaire enfant (**51 à 85**).
  - Code couleur normalisé :
    - 🟢 *Saine*
    - 🔴 *Carie active* (avec sélection des surfaces : Occlusale, Mésiale, Distale, Vestibulaire, Linguale)
    - 🟡 *Dévitalisée / Endo*
    - 🔵 *Couronne prothétique*
    - 🟣 *Élément de Bridge*
    - 🔷 *Implant titane*
    - ⚫ *Absente*
    - ❌ *À extraire*
  - Modal d'intervention permettant d'affecter un état, rédiger un diagnostic et imputer directement un acte du catalogue au dossier.
- **Générateur d'Ordonnances & Certificats Médicaux :**
  - Bibliothèque intégrée de médicaments usuels au Maroc ajoutables en 1 clic (*Amoxicilline 1g, Bi-Rodogyl, Doliprane 1g, Bi-Profenid, Eludril, Solupred*).
  - Module de certificat d'arrêt de travail / repos médical.
  - Feuille imprimable format officiel avec en-tête du Dr, mentions INPE/ICE et cachet.

### D. Agenda & Rappels WhatsApp Automatisés
- Calendrier avec code couleur par type d'acte (*Consultation, Soin, Prothèse, Chirurgie, Implantologie, Urgence*).
- **Bouton 1-clic Rappel WhatsApp :** Ouvre directement WhatsApp avec le message pré-rempli au nom du patient, rappelant l'heure et l'adresse du cabinet à Casablanca.

### E. Suivi de Fabrication des Prothèses (Laboratoire)
- Création de **Bons de Commande Labo** (*Couronne Zircone monolithique, Céramo-métallique, Bridge, Stellite résine/chrome-cobalt, Facette E.max, Gouttière*).
- Sélecteur de **Teinte Vita** (*A1, A2, A3, B1, Bleach...*) et dents concernées.
- **Pipeline des Étapes :** *Empreinte prise* → *Envoyé au labo* → *Essayage prévu* → *Retouche* → *Livré au cabinet* → *Posé*.
- **Calcul de Rentabilité Prothétique :** Prix patient vs Coût labo = Marge brute cabinet (en MAD et en %).

### F. Devis, Facturation Mutuelle & Portefeuille Chèques
- Émission de **Devis** détaillés et de **Factures normalisées**.
- Prise en charge des mutuelles marocaines (**CNOPS, CNSS, AMO, Assurances privées**) avec mention des codes nomenclature AMO.
- Encaissement partiel ou total (*Espèces, Chèque, Virement, TPE/Carte*).
- **Gestionnaire des Chèques :** Suivi par numéro, banque marocaine (*Attijariwafa, BCP, BMCE, CIH, etc.*) et date d'échéance.
- **Reçu de Paiement Immédiat :** Reçu officiel imprimable pour le patient avec solde résiduel.

### G. Dépenses, Consommables & Avis Google Maps
- **Charges du Cabinet :** Enregistrement des charges (*Loyer, Salaires, Labo, Consommables, Lydec, Maroc Telecom*) et calcul automatique du bénéfice net.
- **Stock Consommables :** Suivi des carpules d'anesthésie, seringues de composite, gants, fraises avec alerte visuelle dès que `quantité <= seuil_alerte`.
- **Fidélisation Google Reviews :** Générateur de **QR Code** de comptoir et envoi de message WhatsApp post-soin invitant les patients à laisser 5 étoiles sur Google Maps.
- **Sauvegarde en 1 Clic :** Bouton d'export intégral de la base de données au format **JSON** et **CSV (Excel)**.

---

## 👥 4. Comptes de Démonstration (Seed)

Le script de seed pré-remplit la base avec des profils marocains réalistes :

| Rôle | Email | Mot de passe | Accès & Permissions |
|---|---|---|---|
| **ADMIN (Docteur)** | `dr.alami@dentacare.ma` | `Admin123!` | Accès total : Finances, Odontogramme, Dépenses, Paramètres |
| **ASSISTANT** | `assia@dentacare.ma` | `Assistant123!` | Agenda, Patients, Règlements, WhatsApp (sans marge nette globale) |
| **PROTHESISTE** | `labo.atlas@dentacare.ma` | `Prothese123!` | Suivi des bons de commande prothèses, teintes et livraisons |

---

## 💻 5. Installation & Démarrage Local

### Prérequis
- Node.js version 18.x ou 20.x+
- npm ou pnpm
- Une base de données PostgreSQL (locale ou hébergée sur Neon / Supabase)

### Étapes
```bash
# 1. Cloner le dépôt
git clone https://github.com/votre-compte/denta-maroc.git
cd denta-maroc

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Renseignez votre URL PostgreSQL DATABASE_URL et NEXTAUTH_SECRET

# 4. Synchroniser le schéma Prisma
npx prisma db push

# 5. Peupler avec les données marocaines de démonstration
npm run seed

# 6. Lancer le serveur de développement
npm run dev
```

L'application est accessible sur `http://localhost:3000`.

---

## 🚀 6. Déploiement sur GitHub & Vercel (Étape par Étape)

### Étape 1 : Initialiser et Pousser sur GitHub
```bash
git init
git add .
git commit -m "feat: initial commit DentaMaroc full-stack dental ERP"
git branch -M main
git remote add origin https://github.com/votre-utilisateur/denta-maroc.git
git push -u origin main
```

### Étape 2 : Préparer la Base de Données PostgreSQL Cloud (Neon ou Supabase)
1. Créez un projet gratuit sur **[Neon.tech](https://neon.tech)** ou **[Supabase.com](https://supabase.com)**.
2. Récupérez la chaîne de connexion avec **Connection Pooling** (pgBouncer port `6543`) pour `DATABASE_URL`.
3. Récupérez la chaîne de connexion directe (port `5432`) pour `DIRECT_URL`.

### Étape 3 : Importer le Projet sur Vercel
1. Rendez-vous sur le dashboard **[Vercel](https://vercel.com)** et cliquez sur **Add New Project**.
2. Sélectionnez votre dépôt GitHub `denta-maroc`.
3. Vérifiez les paramètres de build :
   - **Framework Preset :** `Next.js`
   - **Build Command :** `prisma generate && next build`
4. Ajoutez les **Environment Variables** suivantes :

| Variable | Exemple / Valeur requise |
|---|---|
| `DATABASE_URL` | `postgresql://postgres:pwd@pooler.neon.tech/neondb?sslmode=require` |
| `DIRECT_URL` | `postgresql://postgres:pwd@direct.neon.tech/neondb?sslmode=require` |
| `NEXTAUTH_SECRET` | `votre_secret_genere_avec_openssl` |
| `NEXTAUTH_URL` | `https://votre-cabinet.vercel.app` (ou URL Vercel fournie) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://votresupabase.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `votre_cle_anon_supabase` |
| `SUPABASE_SERVICE_ROLE_KEY` | `votre_cle_service_role` |

5. Cliquez sur **Deploy** !

---

## 📄 Licence & Conformité
Conforme aux recommandations de déontologie médicale et aux dispositions de la loi 09-08 relative à la protection des données à caractère personnel au Maroc (CNDP).
Projet distribué sous licence MIT.
