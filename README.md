# 🌍 GlobeTrotter — Smart Multi-City Travel Planner

GlobeTrotter is a full-stack travel planner, itinerary builder, and budget tracking application for hackathons and travel enthusiasts.

---

## 🏗️ Architecture Overview

```text
GlobeTrotter/
├── backend/            # FastAPI + SQLAlchemy 2.0 + PostgreSQL + PyJWT
│   ├── app/
│   │   ├── main.py     # FastAPI Server & Routes
│   │   ├── models/     # 8 Relational ORM Models
│   │   ├── schemas/    # Pydantic v2 Schemas
│   │   ├── routers/    # REST API Routers
│   │   ├── services/   # Auth (bcrypt/JWT) & Budget calculations
│   │   ├── seed.py     # Sample data seeder
│   │   ├── test_db.py  # Database ORM test suite
│   │   └── test_api.py # End-to-end API test suite
│   └── requirements.txt
│
└── frontend/           # React 19 + TypeScript + Vite + Tailwind CSS
    ├── src/
    │   ├── components/ # UI Components & Layouts
    │   ├── pages/      # Dashboard, Itinerary, Budget, Map, etc.
    │   └── services/   # Mock / API Services
    └── package.json
```

---

## ⚡ Quickstart: Running the Complete Project

To run GlobeTrotter locally, you will open **two terminal windows** (one for the backend and one for the frontend).

---

### 🖥️ Terminal 1: Backend (FastAPI + PostgreSQL)

```bash
# 1. Navigate to backend directory
cd backend

# 2. (Optional) Create and activate virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Configure environment (edit credentials in .env if using local PostgreSQL)
# Copy example if .env doesn't exist:
# cp .env.example .env

# 5. Initialize database tables & seed sample travel data
python app/init_db.py
python app/seed.py

# 6. Start the FastAPI server
uvicorn app.main:app --reload --port 8000
```

- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Alternative ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

### 🌐 Terminal 2: Frontend (React + Vite)

```bash
# 1. Open a new terminal and navigate to frontend directory
cd frontend

# 2. Install Node dependencies
npm install

# 3. Start Vite development server
npm run dev
```

- **Frontend Application**: [http://localhost:3000](http://localhost:3000) (or `http://localhost:5173`)

---

## 🔑 Sample Seed Accounts

When you run `python app/seed.py`, the database is populated with realistic travel data and 3 test accounts:

| Name | Email | Password |
|---|---|---|
| Himanshu Patel | `himanshu@globetrotter.app` | `password123` |
| Saumya Bavaliya | `saumya@globetrotter.app` | `password123` |
| Aarav Sharma | `aarav.sharma@traveler.in` | `password123` |

---

## 🧪 Running Automated Backend Tests

You can verify the backend without needing external dependencies:

```bash
cd backend

# 1. Test database ORM, constraints, and cascade deletion rules:
python app/test_db.py --sqlite

# 2. Test all REST API endpoints, JWT authentication, and authorization security:
python app/test_api.py
```
