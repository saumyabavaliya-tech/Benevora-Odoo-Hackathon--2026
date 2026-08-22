# 🌍 GlobeTrotter — Backend & API Layer (FastAPI + PostgreSQL + SQLAlchemy 2.x)

Welcome to the **GlobeTrotter** backend API. This service provides a RESTful API built with **FastAPI**, **SQLAlchemy 2.0 ORM**, **Pydantic v2**, and **PostgreSQL**, secured with **JWT Bearer Authentication** and **bcrypt** password hashing.

---

## 📁 Backend Directory Architecture

```text
backend/
├── app/
│   ├── __init__.py              # Application package initializer
│   ├── main.py                  # FastAPI app, CORS, routes & health checks
│   ├── database.py              # Engine, sessionmaker, Base & get_db dependency
│   ├── dependencies.py          # JWT security & user authentication dependencies
│   ├── init_db.py               # Database schema initialization script
│   ├── seed.py                  # Realistic travel database seeder
│   ├── test_db.py               # Database ORM & constraint test suite
│   ├── test_api.py              # Automated end-to-end API test suite
│   │
│   ├── models/                  # SQLAlchemy 2.0 ORM Models
│   │   ├── __init__.py
│   │   ├── user.py              # User model
│   │   ├── city.py              # City model
│   │   ├── activity.py          # Activity model
│   │   ├── trip.py              # Trip and TripStop models
│   │   ├── itinerary.py         # ItineraryItem model
│   │   ├── expense.py           # Expense model
│   │   └── memory.py            # Memory model
│   │
│   ├── schemas/                 # Pydantic v2 Request & Response Schemas
│   │   ├── __init__.py
│   │   ├── auth.py              # LoginRequest, TokenResponse
│   │   ├── user.py              # UserCreate, UserUpdate, UserResponse
│   │   ├── city.py              # CityCreate, CityResponse, CityDetailResponse
│   │   ├── activity.py          # ActivityCreate, ActivityResponse
│   │   ├── trip.py              # TripCreate, TripUpdate, TripResponse, TripStop schemas
│   │   ├── itinerary.py         # ItineraryItem schemas & ReorderRequest
│   │   ├── expense.py           # Expense schemas & BudgetSummaryResponse
│   │   ├── memory.py            # MemoryCreate, MemoryResponse
│   │   └── shared.py            # SharedTripResponse, ShareTripEnableResponse
│   │
│   ├── routers/                 # FastAPI REST API Route Handlers
│   │   ├── __init__.py
│   │   ├── auth.py              # /api/auth (register, login, me)
│   │   ├── users.py             # /api/users (profile get, update)
│   │   ├── cities.py            # /api/cities (list, search, detail)
│   │   ├── activities.py        # /api/activities (list, search, detail)
│   │   ├── trips.py             # /api/trips & /api/stops (CRUD, sharing, stops)
│   │   ├── itinerary.py         # /api/trips/{id}/itinerary & /api/itinerary (CRUD, reorder)
│   │   ├── expenses.py          # /api/trips/{id}/expenses & /api/expenses (CRUD, budget summary)
│   │   ├── memories.py          # /api/memories (CRUD)
│   │   └── shared.py            # /api/shared/{share_id} (public read-only trip)
│   │
│   └── services/                # Business Logic & Utility Services
│       ├── __init__.py
│       ├── auth.py              # bcrypt password hashing & JWT token creation/decoding
│       └── budget.py            # Dynamic budget & expense category calculations
│
├── .env                         # Local environment secrets
├── .env.example                 # Environment template
├── requirements.txt             # Python dependencies
└── README.md                    # Complete documentation
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the `backend/` directory based on `.env.example`:

```ini
# PostgreSQL Database URL
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/globetrotter

# Optional: Print raw SQL to console
DB_ECHO=False

# JWT Secret & Algorithm
JWT_SECRET_KEY=globetrotter_hackathon_super_secret_jwt_key_change_in_production_2026
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Frontend CORS Origin
FRONTEND_ORIGIN=http://localhost:5173
```

---

## 🚀 How to Run the Backend

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Initialize Database & Seed Sample Data

```bash
# Initialize database tables
python app/init_db.py

# Seed database with users, 12 Indian cities, 25+ activities, 3 trips, stops, itinerary, expenses & memories
python app/seed.py
```

### 3. Start FastAPI Server

```bash
uvicorn app.main:app --reload --port 8000
```

The API will start at:
- **API Base URL**: `http://localhost:8000`
- **Interactive Swagger UI**: `http://localhost:8000/docs`
- **ReDoc Documentation**: `http://localhost:8000/redoc`

---

## 🧪 Automated Testing

Run the end-to-end automated test suites (zero setup required):

```bash
# 1. Run database layer & constraint tests
python app/test_db.py --sqlite

# 2. Run comprehensive FastAPI endpoint & authorization tests
python app/test_api.py
```

---

## 📡 Complete REST API Endpoint Reference

### 1. Health Checks
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/` | Root API greeting and discovery | No |
| `GET` | `/api/health` | Service health status | No |
| `GET` | `/api/health/db` | Database connection health status | No |

---

### 2. Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required | Request Body | Response |
|---|---|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user account | No | `UserCreate` (`name`, `email`, `password`) | `TokenResponse` (`access_token`, `user`) |
| `POST` | `/api/auth/login` | Login and obtain JWT token | No | `LoginRequest` (`email`, `password`) | `TokenResponse` (`access_token`, `user`) |
| `GET` | `/api/auth/me` | Get current authenticated user | Yes | None | `UserResponse` |

---

### 3. User Profile (`/api/users`)
| Method | Endpoint | Description | Auth Required | Request Body | Response |
|---|---|---|---|---|---|
| `GET` | `/api/users/me` | Fetch authenticated user profile | Yes | None | `UserResponse` |
| `PUT` | `/api/users/me` | Update authenticated user profile | Yes | `UserUpdate` (`name`, `email`, `password`) | `UserResponse` |

---

### 4. Cities Catalog (`/api/cities`)
| Method | Endpoint | Description | Auth Required | Query Parameters / Body |
|---|---|---|---|---|
| `GET` | `/api/cities` | List destination cities | No | `search`, `country`, `region`, `min_cost`, `max_cost` |
| `GET` | `/api/cities/search` | Search destination cities | No | `search`, `country`, `region`, `min_cost`, `max_cost` |
| `GET` | `/api/cities/{city_id}` | Get city details with activities | No | None |
| `POST` | `/api/cities` | Create a new destination city | No | `CityCreate` |

---

### 5. Activities Catalog (`/api/activities`)
| Method | Endpoint | Description | Auth Required | Query Parameters / Body |
|---|---|---|---|---|
| `GET` | `/api/activities` | List curated activities | No | `city_id`, `category`, `search`, `min_cost`, `max_cost` |
| `GET` | `/api/activities/search` | Search curated activities | No | `search`, `city_id`, `category`, `min_cost`, `max_cost` |
| `GET` | `/api/activities/{activity_id}` | Get single activity details | No | None |
| `POST` | `/api/activities` | Create a new activity | No | `ActivityCreate` |

---

### 6. Trips & Stops (`/api/trips` & `/api/stops`)
| Method | Endpoint | Description | Auth Required | Details |
|---|---|---|---|---|
| `POST` | `/api/trips` | Create a new trip | Yes | Creates trip for authenticated user |
| `GET` | `/api/trips` | List current user's trips | Yes | Returns only user's private trips |
| `GET` | `/api/trips/{trip_id}` | Get single trip details | Yes | Returns stops, itinerary, expenses, memories (403 if not owned) |
| `PUT` | `/api/trips/{trip_id}` | Update trip | Yes | Updates name, dates, budget, status, cover image |
| `DELETE` | `/api/trips/{trip_id}` | Delete trip | Yes | Cascades removal of all stops, items, expenses, memories |
| `POST` | `/api/trips/{trip_id}/share` | Enable public sharing | Yes | Generates unique url-safe share token |
| `GET` | `/api/trips/{trip_id}/stops` | List destination stops | Yes | Returns ordered city stops for trip |
| `POST` | `/api/trips/{trip_id}/stops` | Add city stop to trip | Yes | `TripStopCreate` (`city_id`, `arrival_date`, `departure_date`, `stop_order`) |
| `PUT` | `/api/stops/{stop_id}` | Update a trip stop | Yes | Updates stop dates or order |
| `DELETE` | `/api/stops/{stop_id}` | Delete a trip stop | Yes | Removes city stop from trip |

---

### 7. Itinerary Timeline (`/api/trips/{trip_id}/itinerary` & `/api/itinerary`)
| Method | Endpoint | Description | Auth Required | Details |
|---|---|---|---|---|
| `GET` | `/api/trips/{trip_id}/itinerary` | Get trip itinerary | Yes | Returns timeline items sorted by date, order, time |
| `POST` | `/api/trips/{trip_id}/itinerary` | Add item to itinerary | Yes | `ItineraryItemCreate` (activity, meal, hotel, transit, custom) |
| `PUT` | `/api/itinerary/{item_id}` | Update itinerary item | Yes | `ItineraryItemUpdate` |
| `DELETE` | `/api/itinerary/{item_id}` | Delete itinerary item | Yes | Removes schedule item |
| `POST` | `/api/trips/{trip_id}/itinerary/reorder` | Reorder itinerary items | Yes | `ItineraryReorderRequest` (`item_ids: [5, 2, 8, 1]`) |

---

### 8. Expenses & Budget Calculation (`/api/trips/{trip_id}/expenses` & `/api/expenses`)
| Method | Endpoint | Description | Auth Required | Details |
|---|---|---|---|---|
| `GET` | `/api/trips/{trip_id}/expenses` | List trip expenses | Yes | Returns categorized expense log |
| `POST` | `/api/trips/{trip_id}/expenses` | Log a new expense | Yes | `ExpenseCreate` (`category`, `description`, `amount`, `expense_date`) |
| `PUT` | `/api/expenses/{expense_id}` | Update an expense | Yes | `ExpenseUpdate` |
| `DELETE` | `/api/expenses/{expense_id}` | Delete an expense | Yes | Removes expense record |
| `GET` | `/api/trips/{trip_id}/budget-summary` | Dynamic budget calculations | Yes | Computes `total_budget`, `total_expenses`, `remaining_budget`, `percentage_spent`, `category_totals` |

---

### 9. Memories & Scrapbook (`/api/memories`)
| Method | Endpoint | Description | Auth Required | Details |
|---|---|---|---|---|
| `GET` | `/api/memories` | List current user memories | Yes | Optional `trip_id` query filter |
| `GET` | `/api/memories/{memory_id}` | Get single memory | Yes | Verifies ownership |
| `POST` | `/api/memories` | Create a new memory | Yes | `MemoryCreate` (`image_url`, `caption`, `location`, `memory_date`, `trip_id`) |
| `PUT` | `/api/memories/{memory_id}` | Update memory | Yes | `MemoryUpdate` |
| `DELETE` | `/api/memories/{memory_id}` | Delete memory | Yes | Removes memory |

---

### 10. Public Shared Trips (`/api/shared`)
| Method | Endpoint | Description | Auth Required | Details |
|---|---|---|---|---|
| `GET` | `/api/shared/{share_id}` | View public shared trip | No | Read-only view (stops, activities, itinerary, budget breakdown). No passwords or private account data exposed. |

---

## 🔒 Security & Authorization Architecture

1. **Password Security**: Passwords are never stored in plaintext. They are salted and hashed using **bcrypt**.
2. **JWT Authentication**: Tokens are signed using HMAC-SHA256 with secret keys configured exclusively in `.env`.
3. **Strict Resource Isolation**: Every protected resource (`Trip`, `TripStop`, `ItineraryItem`, `Expense`, `Memory`) verifies ownership against `current_user.id`. Any unauthorized access attempt returns `HTTP 403 Forbidden`.
4. **Input Validation**: All payloads are strongly typed and validated by **Pydantic v2** models before reaching database queries.
