"""
FastAPI Automated End-to-End Test Suite
Tests all endpoints, authentication, CRUD operations, relationships, calculations, and authorization rules.
"""

import os
import sys

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Ensure UTF-8 output encoding on Windows if supported
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

from datetime import date
from decimal import Decimal
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker

# Import all models so they register with Base.metadata
import app.models
from app.database import Base, get_db
from app.main import app
from app.models import City, Activity


# Create isolated SQLite database for automated testing with StaticPool
TEST_DATABASE_URL = "sqlite:///:memory:"
test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

# Create all database tables in the shared in-memory DB
Base.metadata.create_all(bind=test_engine)

# Override FastAPI get_db dependency
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def seed_test_cities():
    """Seed sample cities and activities for API tests."""
    db = TestingSessionLocal()
    c1 = City(
        name="Goa",
        country="India",
        region="Goa",
        description="Beaches and heritage",
        cost_index=3,
        popularity=4.9,
    )
    c2 = City(
        name="Mumbai",
        country="India",
        region="Maharashtra",
        description="Bustling metropolis",
        cost_index=4,
        popularity=4.8,
    )
    db.add_all([c1, c2])
    db.commit()
    db.refresh(c1)
    db.refresh(c2)

    a1 = Activity(
        city_id=c1.id,
        name="Baga Beach Parasailing",
        category="adventure",
        duration_minutes=120,
        estimated_cost=Decimal("1500.00"),
        rating=4.8,
    )
    a2 = Activity(
        city_id=c1.id,
        name="Old Goa Churches Tour",
        category="culture",
        duration_minutes=90,
        estimated_cost=Decimal("100.00"),
        rating=4.7,
    )
    db.add_all([a1, a2])
    db.commit()
    db.close()


def run_api_tests():
    print("=" * 70)
    print("FASTAPI BACKEND AUTOMATED TEST SUITE")
    print("=" * 70)

    seed_test_cities()

    # 1. Health Checks
    print("\n[1] Testing Health Checks...")
    res = client.get("/api/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    assert res.json() == {"status": "ok"}
    print("  [OK] GET /api/health returned 200 OK")

    res = client.get("/api/health/db")
    assert res.status_code == 200, f"DB Health check failed: {res.text}"
    assert res.json()["database"] == "connected"
    print("  [OK] GET /api/health/db returned database: connected")

    # 2. User A Registration
    print("\n[2] Testing User Registration...")
    reg_payload = {
        "name": "User Alpha",
        "email": "user.alpha@globetrotter.app",
        "password": "Password123!",
    }
    res = client.post("/api/auth/register", json=reg_payload)
    assert res.status_code == 201, f"Registration failed: {res.text}"
    token_data = res.json()
    assert "access_token" in token_data
    token_a = token_data["access_token"]
    user_a = token_data["user"]
    assert user_a["email"] == "user.alpha@globetrotter.app"
    print(f"  [OK] Registered User A (id={user_a['id']}) and received JWT token")

    # Duplicate Registration Rejection
    res_dup = client.post("/api/auth/register", json=reg_payload)
    assert res_dup.status_code == 409, "Duplicate registration was not rejected with 409"
    print("  [OK] Duplicate email rejected with 409 Conflict")

    # 3. User Login
    print("\n[3] Testing User Login...")
    login_payload = {
        "email": "user.alpha@globetrotter.app",
        "password": "Password123!",
    }
    res = client.post("/api/auth/login", json=login_payload)
    assert res.status_code == 200, f"Login failed: {res.text}"
    assert "access_token" in res.json()
    print("  [OK] POST /api/auth/login authenticated successfully")

    # Bad password rejection
    bad_login = client.post("/api/auth/login", json={"email": "user.alpha@globetrotter.app", "password": "WrongPassword"})
    assert bad_login.status_code == 401, "Bad password was not rejected with 401"
    print("  [OK] Invalid password rejected with 401 Unauthorized")

    # 4. Auth Me & User Me
    print("\n[4] Testing Profile Endpoints...")
    headers_a = {"Authorization": f"Bearer {token_a}"}
    res = client.get("/api/auth/me", headers=headers_a)
    assert res.status_code == 200
    assert res.json()["name"] == "User Alpha"
    print("  [OK] GET /api/auth/me returned profile")

    res = client.get("/api/users/me", headers=headers_a)
    assert res.status_code == 200
    print("  [OK] GET /api/users/me returned profile")

    # Update Profile
    res = client.put("/api/users/me", json={"name": "User Alpha Updated"}, headers=headers_a)
    assert res.status_code == 200
    assert res.json()["name"] == "User Alpha Updated"
    print("  [OK] PUT /api/users/me updated name successfully")

    # 5. Cities & Activities
    print("\n[5] Testing Cities & Activities Discovery...")
    res = client.get("/api/cities")
    assert res.status_code == 200
    cities = res.json()
    assert len(cities) >= 2
    goa_id = cities[0]["id"]
    print(f"  [OK] GET /api/cities returned {len(cities)} cities")

    res = client.get("/api/cities/search?search=Goa")
    assert res.status_code == 200
    assert any(c["name"] == "Goa" for c in res.json())
    print("  [OK] GET /api/cities/search?search=Goa returned Goa")

    res = client.get(f"/api/cities/{goa_id}")
    assert res.status_code == 200
    assert "activities" in res.json()
    print(f"  [OK] GET /api/cities/{goa_id} returned city details and activities")

    res = client.get(f"/api/activities?city_id={goa_id}")
    assert res.status_code == 200
    acts = res.json()
    assert len(acts) >= 2
    act_id = acts[0]["id"]
    print(f"  [OK] GET /api/activities?city_id={goa_id} returned {len(acts)} activities")

    # 6. Trip Creation & Retrieval
    print("\n[6] Testing Trip Management...")
    trip_payload = {
        "name": "Goa Monsoon Trail",
        "description": "Scenic getaway to beaches and churches",
        "start_date": "2026-09-10",
        "end_date": "2026-09-15",
        "budget": 25000.00,
        "currency": "INR",
        "status": "upcoming",
        "cover_image": "https://images.unsplash.com/sample.jpg",
    }
    res = client.post("/api/trips", json=trip_payload, headers=headers_a)
    assert res.status_code == 201, f"Create trip failed: {res.text}"
    trip_a = res.json()
    trip_a_id = trip_a["id"]
    assert trip_a["name"] == "Goa Monsoon Trail"
    print(f"  [OK] POST /api/trips created trip id={trip_a_id}")

    res = client.get("/api/trips", headers=headers_a)
    assert res.status_code == 200
    assert len(res.json()) >= 1
    print("  [OK] GET /api/trips returned user trips")

    res = client.get(f"/api/trips/{trip_a_id}", headers=headers_a)
    assert res.status_code == 200
    assert res.json()["id"] == trip_a_id
    print(f"  [OK] GET /api/trips/{trip_a_id} returned full trip details")

    # 7. Trip Stops
    print("\n[7] Testing Trip Stops...")
    stop_payload = {
        "city_id": goa_id,
        "arrival_date": "2026-09-10",
        "departure_date": "2026-09-15",
        "stop_order": 1,
    }
    res = client.post(f"/api/trips/{trip_a_id}/stops", json=stop_payload, headers=headers_a)
    assert res.status_code == 201
    stop = res.json()
    stop_id = stop["id"]
    print(f"  [OK] POST /api/trips/{trip_a_id}/stops created stop id={stop_id}")

    res = client.get(f"/api/trips/{trip_a_id}/stops", headers=headers_a)
    assert res.status_code == 200
    assert len(res.json()) >= 1
    print("  [OK] GET /api/trips/{trip_a_id}/stops returned stops")

    # 8. Itinerary Items & Reordering
    print("\n[8] Testing Itinerary CRUD & Reordering...")
    item1_payload = {
        "title": "Parasailing Adventure",
        "activity_id": act_id,
        "trip_stop_id": stop_id,
        "date": "2026-09-11",
        "start_time": "10:00:00",
        "end_time": "12:00:00",
        "item_type": "activity",
        "item_order": 1,
        "estimated_cost": 1500.00,
    }
    res = client.post(f"/api/trips/{trip_a_id}/itinerary", json=item1_payload, headers=headers_a)
    assert res.status_code == 201
    item1 = res.json()
    item1_id = item1["id"]
    print(f"  [OK] POST /api/trips/{trip_a_id}/itinerary created item 1 (id={item1_id})")

    item2_payload = {
        "title": "Beachside Shack Dinner",
        "date": "2026-09-11",
        "start_time": "19:00:00",
        "end_time": "21:00:00",
        "item_type": "meal",
        "item_order": 2,
        "estimated_cost": 850.00,
    }
    res = client.post(f"/api/trips/{trip_a_id}/itinerary", json=item2_payload, headers=headers_a)
    assert res.status_code == 201
    item2 = res.json()
    item2_id = item2["id"]
    print(f"  [OK] POST /api/trips/{trip_a_id}/itinerary created item 2 (id={item2_id})")

    # Reorder items
    reorder_payload = {"item_ids": [item2_id, item1_id]}
    res = client.post(f"/api/trips/{trip_a_id}/itinerary/reorder", json=reorder_payload, headers=headers_a)
    assert res.status_code == 200
    reordered = res.json()
    assert reordered[0]["id"] == item2_id and reordered[0]["item_order"] == 1
    assert reordered[1]["id"] == item1_id and reordered[1]["item_order"] == 2
    print("  [OK] POST /api/trips/{trip_id}/itinerary/reorder successfully swapped items")

    # 9. Expenses & Budget Calculation
    print("\n[9] Testing Expenses & Budget Summary...")
    exp1_payload = {
        "category": "activities",
        "description": "Parasailing Package",
        "amount": 1500.00,
        "currency": "INR",
        "expense_date": "2026-09-11",
    }
    res = client.post(f"/api/trips/{trip_a_id}/expenses", json=exp1_payload, headers=headers_a)
    assert res.status_code == 201
    exp1_id = res.json()["id"]

    exp2_payload = {
        "category": "food",
        "description": "Seafood Dinner",
        "amount": 1200.00,
        "currency": "INR",
        "expense_date": "2026-09-11",
    }
    res = client.post(f"/api/trips/{trip_a_id}/expenses", json=exp2_payload, headers=headers_a)
    assert res.status_code == 201
    exp2_id = res.json()["id"]
    print(f"  [OK] Logged 2 expenses (id={exp1_id}, id={exp2_id})")

    res = client.get(f"/api/trips/{trip_a_id}/budget-summary", headers=headers_a)
    assert res.status_code == 200
    summary = res.json()
    assert float(summary["total_budget"]) == 25000.00
    assert float(summary["total_expenses"]) == 2700.00
    assert float(summary["remaining_budget"]) == 22300.00
    assert float(summary["percentage_spent"]) == 10.8
    assert float(summary["category_totals"]["activities"]) == 1500.00
    assert float(summary["category_totals"]["food"]) == 1200.00
    print("  [OK] GET /api/trips/{trip_id}/budget-summary verified calculated totals from DB records")

    # 10. Memories
    print("\n[10] Testing Memories...")
    mem_payload = {
        "trip_id": trip_a_id,
        "image_url": "https://images.unsplash.com/beach-sunset.jpg",
        "caption": "Sunset over Baga Beach waves",
        "location": "Baga, Goa",
        "memory_date": "2026-09-11",
    }
    res = client.post("/api/memories", json=mem_payload, headers=headers_a)
    assert res.status_code == 201
    mem_id = res.json()["id"]
    print(f"  [OK] POST /api/memories created memory id={mem_id}")

    res = client.get("/api/memories", headers=headers_a)
    assert res.status_code == 200
    assert len(res.json()) >= 1
    print("  [OK] GET /api/memories listed user memories")

    # 11. Public Shared Trip
    print("\n[11] Testing Public Shared Trip...")
    res = client.post(f"/api/trips/{trip_a_id}/share", headers=headers_a)
    assert res.status_code == 200
    share_info = res.json()
    share_id = share_info["share_id"]
    assert share_info["is_public"] is True
    print(f"  [OK] POST /api/trips/{trip_a_id}/share generated share_id='{share_id}'")

    # Public unauthenticated access
    res_pub = client.get(f"/api/shared/{share_id}")
    assert res_pub.status_code == 200
    shared_data = res_pub.json()
    assert shared_data["name"] == "Goa Monsoon Trail"
    assert shared_data["owner_name"] == "User Alpha Updated"
    assert "password" not in shared_data
    assert "password_hash" not in shared_data
    assert "budget_summary" in shared_data
    print("  [OK] GET /api/shared/{share_id} returned public read-only trip overview without credentials")

    # 12. Security & Authorization: User B Access Denial
    print("\n[12] Testing Strict Authorization Isolation...")
    # Register User B
    reg_b = {
        "name": "User Beta",
        "email": "user.beta@globetrotter.app",
        "password": "Password123!",
    }
    res = client.post("/api/auth/register", json=reg_b)
    token_b = res.json()["access_token"]
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # User B attempts to access User A's private trip
    res = client.get(f"/api/trips/{trip_a_id}", headers=headers_b)
    assert res.status_code == 403, f"User B was not blocked from User A's trip! Status: {res.status_code}"
    print("  [OK] User B forbidden from accessing User A's trip (403 Forbidden)")

    # User B attempts to delete User A's trip
    res = client.delete(f"/api/trips/{trip_a_id}", headers=headers_b)
    assert res.status_code == 403
    print("  [OK] User B forbidden from deleting User A's trip (403 Forbidden)")

    # User B attempts to update User A's itinerary item
    res = client.put(f"/api/itinerary/{item1_id}", json={"title": "Hacked Title"}, headers=headers_b)
    assert res.status_code == 403
    print("  [OK] User B forbidden from modifying User A's itinerary (403 Forbidden)")

    # User B attempts to modify User A's expense
    res = client.delete(f"/api/expenses/{exp1_id}", headers=headers_b)
    assert res.status_code == 403
    print("  [OK] User B forbidden from deleting User A's expense (403 Forbidden)")

    # User B attempts to modify User A's memory
    res = client.delete(f"/api/memories/{mem_id}", headers=headers_b)
    assert res.status_code == 403
    print("  [OK] User B forbidden from deleting User A's memory (403 Forbidden)")

    # 13. Cascade Deletion on Trip
    print("\n[13] Testing Trip Cascade Deletion...")
    res = client.delete(f"/api/trips/{trip_a_id}", headers=headers_a)
    assert res.status_code == 204
    print("  [OK] DELETE /api/trips/{trip_id} deleted trip with 204 No Content")

    res = client.get(f"/api/trips/{trip_a_id}", headers=headers_a)
    assert res.status_code == 404
    print("  [OK] Deleted trip confirmed removed (404 Not Found)")

    print("\n" + "=" * 70)
    print("[SUCCESS] ALL 13 API TEST SUITES PASSED WITH 100% SUCCESS!")
    print("=" * 70)
    return True


if __name__ == "__main__":
    success = run_api_tests()
    sys.exit(0 if success else 1)
