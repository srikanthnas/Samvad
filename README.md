# Samvad – Civic Connect Platform (MERN Edition) 🏛️

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)](https://mongoosejs.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

**Samvad** (meaning *Dialogue* or *Discussion*) is a state-of-the-art, full-stack civic engagement and issue-reporting platform designed to bridge the communication gap between active citizens and municipality authorities. Citizens can report localized issues (such as potholes, water waste, or broken streetlights) and track their resolution in real-time, while government administrators can manage, delegate, and resolve reports within a secure workflow.

Initially designed on a PostgreSQL relational database, **this MERN Edition has been fully migrated to a flexible Document-based architecture using MongoDB Atlas and Mongoose ODM** for optimized query performance, horizontal scaling, and flexible geospatial/location schemas.

---

## 🏛️ Project Overview & Architecture

### The Transition: PostgreSQL/Sequelize ➡️ MongoDB/Mongoose
The migration of the Samvad platform backend brings significant architectural benefits tailored specifically for civic and geospatial reporting data structures:
* **Flexible Document Schema**: Location reports contain dynamic structures (coordinates, addresses, photos, and admin resolution proofs). Storing them in a single, nested MongoDB document eliminates the overhead of multi-table joins.
* **Geospatial & Complex Data Nested Integrity**: Coordinates (`lat` and `lng`) along with human-readable addresses are grouped elegantly in a single nested `location` sub-document, validated natively by Mongoose schemas.
* **Optimized Indexing**: Database indexes are established directly on primary search fields—`userId` (to quickly fetch citizen portfolios) and `status` (for real-time dashboard categorization).
* **Robust Virtual Transformation**: Mongoose models are configured with custom JSON/Object transform methods. This guarantees seamless compatibility with existing frontend models by stripping internal MongoDB fields (`_id`, `__v`) and delivering clean, standard custom string identifier APIs.

---

## 🚀 Key Features

### 👤 Citizen Workspace
* **Interactive Geo-Location Marking**: Select the exact location of the issue using an interactive map selector.
* **Rich Media Evidence**: Upload images of the reported issues securely via **Cloudinary API** integration.
* **Dynamic Issue Reporting**: Select category, description, and request priority tags.
* **Real-time Status Tracking**: View a personal dashboard displaying live status timelines (`Submitted` ➡️ `In Progress` ➡️ `Resolved`).

### 🔑 Admin & Authority Command Center
* **Complete Issue Lifecycle Control**: Triage and update report statuses seamlessly.
* **Administrative Delegation**: Assign specific staff or departments to handle individual complaints.
* **Resolution Proof Workflow**: Upload photo proof of the fixed issue to notify the reporting citizen and verify completion.
* **Interactive Map Overview**: View all active issues city-wide categorized by priority and status on a unified map display.

### 🛡️ Production Hardening
* **Express Rate Limiting**: Mitigates DDoS and brute-force API abuses.
* **Security Headers**: Integrated **Helmet** middleware to prevent standard web vulnerabilities.
* **Validation Layer**: Complete type-safety enforced through **Zod** schema validations on requests.

---

## 🛠️ Tech Stack

| Frontend Component | Technology Used |
| :--- | :--- |
| **Framework** | React 18 (Vite Bundler) |
| **Language** | TypeScript (Type-safe components) |
| **Styling** | Tailwind CSS + custom glassmorphism design system |
| **UI Components** | Radix UI + shadcn/ui components |
| **Animations** | Framer Motion (micro-interactions & fluid transitions) |
| **Icons** | Lucide React |

| Backend & Database | Technology Used |
| :--- | :--- |
| **Server Engine** | Node.js (Express framework) |
| **Database** | MongoDB Atlas (Cloud Document Store) |
| **Object Modeling** | Mongoose (Schema validation & indexing) |
| **Media Delivery** | Cloudinary API (Image hosting and optimization) |
| **API Validation** | Zod |

---

## 📂 Folder Structure

```
samvad-civic-connect-mern/
├── public/                 # Static public assets
├── src/                    # React Frontend
│   ├── components/         # Reusable UI (Hero, CivicMap, IssueCard, Header, etc.)
│   ├── pages/              # Page layouts (CitizenDashboard, AdminDashboard, Login, etc.)
│   ├── App.tsx             # Main routing and navigation
│   └── main.tsx            # Mounting the React application
├── server/                 # Express Backend
│   ├── src/
│   │   ├── models/         # Mongoose Models (Report.js)
│   │   └── ...             # Handlers and business logic
│   ├── index.js            # Server entry point
│   ├── migrate.js          # SQLite/JSON to MongoDB migration utility
│   ├── reports.json        # Migration seed data
│   └── package.json        # Backend dependencies
├── package.json            # Frontend workspace configuration
├── tailwind.config.ts      # Design system tokens and styles
└── vercel.json             # Vercel routing rules
```

---

## ⚙️ Setup & Installation Instructions

### 1. Prerequisites
* **Node.js** (v18+)
* **MongoDB** (Local instance running on `mongodb://localhost:27017` or a cloud-hosted **MongoDB Atlas** cluster connection string)

### 2. Repository Setup
Clone the repository and install root dependencies:
```bash
git clone https://github.com/0Harsha03/samvad-mern.git
cd samvad-mern
```

### 3. Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install server dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server/` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/samvad
   # Or local fallback: MONGO_URI=mongodb://localhost:27017/samvad
   FRONTEND_URL=http://localhost:5173
   ```
4. **Seed/Migrate Database**: Run the migration script to seed the initial test data from `reports.json` into MongoDB:
   ```bash
   node migrate.js
   ```
5. Start the backend development server:
   ```bash
   npm start
   ```

### 4. Frontend Setup
1. Navigate back to the root directory:
   ```bash
   cd ..
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Run the frontend development server:
   ```bash
   npm run dev
   ```

---

## 🌐 Environment Variables Reference

### Backend (`server/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Local server port | `5000` |
| `MONGO_URI` | MongoDB Connection String | `mongodb+srv://...` |
| `FRONTEND_URL` | Frontend URL for CORS protection | `http://localhost:5173` |

### Frontend (`.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base endpoint URL of backend API | `http://localhost:5000` |

---

## 🌐 Deployment Notes

### Database (MongoDB Atlas)
1. Register and deploy a free Shared Cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under Network Access, whitelist database access (allow standard `0.0.0.0/0` for cloud deployment platforms).
3. Copy the cluster connection URI and configure it as `MONGO_URI` in the production environment settings.

### Server (Render / Railway)
1. Connect this repository to your preferred hosting platform.
2. Specify Root Directory as `server`.
3. Set Build Command: `npm install`
4. Set Start Command: `npm start`
5. Configure environment variables matching `server/.env`.

### Client (Vercel / Netlify)
1. Deploy the root workspace.
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Configure production environment variable `VITE_API_URL` to point to your live hosted server backend.

---

## 📄 License
This project is open-source and licensed under the **MIT License**.
