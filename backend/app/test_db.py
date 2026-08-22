"""
Database Automated Test & Verification Suite
Tests table creation, CRUD operations, relationships, constraints, and cascade behaviors.
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

from datetime import date, time
from decimal import Decimal
from sqlalchemy import create_engine, inspect
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import sessionmaker

from app.database import Base, DATABASE_URL
from app.models import (
    User,
    City,
    Activity,
    Trip,
    TripStop,
    ItineraryItem,
    Expense,
    Memory,
)


def run_database_tests(use_in_memory: bool = False) -> bool:
    """
    Run full suite of database tests.
    
    :param use_in_memory: If True, uses SQLite in-memory for testing without external DB dependency.
    :return: True if all tests pass, False otherwise.
    """
    print("=" * 70)
    print("GLOBETROTTER DATABASE TEST SUITE")
    print("=" * 70)

    # Configure engine
    if use_in_memory:
        test_engine = create_engine("sqlite:///:memory:", echo=False)
        print("[INFO] Running tests using SQLite in-memory engine")
    else:
        test_engine = create_engine(DATABASE_URL, echo=False)
        print(f"[INFO] Running tests using configured engine: {DATABASE_URL.split('@')[-1] if '@' in DATABASE_URL else DATABASE_URL}")

    TestSession = sessionmaker(bind=test_engine)

    # 1. TEST TABLE CREATION
    print("\n[Test 1] Creating all tables...")
    Base.metadata.create_all(bind=test_engine)
    inspector = inspect(test_engine)
    tables = inspector.get_table_names()
    
    expected_tables = {
        "users",
        "cities",
        "activities",
        "trips",
        "trip_stops",
        "itinerary_items",
        "expenses",
        "memories",
    }
    
    missing_tables = expected_tables - set(tables)
    assert not missing_tables, f"[FAIL] Missing tables: {missing_tables}"
    print(f"  [OK] All 8 tables created: {sorted(list(expected_tables))}")

    # Start test session
    session = TestSession()
    try:
        # 2. TEST USER INSERTION
        print("\n[Test 2] Testing User insertion & Unique constraint...")
        user1 = User(
            name="Test User 1",
            email="test1@globetrotter.app",
            password_hash="hashed_pw_12345",
        )
        session.add(user1)
        session.commit()
        assert user1.id is not None
        print(f"  [OK] Inserted user id={user1.id}, email={user1.email}")

        # Duplicate email test
        duplicate_user = User(
            name="Test User Duplicate",
            email="test1@globetrotter.app",
            password_hash="hashed_pw_67890",
        )
        session.add(duplicate_user)
        try:
            session.commit()
            raise AssertionError("[FAIL] Duplicate email constraint failed to trigger!")
        except IntegrityError:
            session.rollback()
            print("  [OK] Duplicate email rejected properly via unique constraint.")

        # 3. TEST CITY INSERTION & UNIQUENESS
        print("\n[Test 3] Testing City insertion & Uniqueness...")
        city1 = City(
            name="Ahmedabad",
            country="India",
            region="Gujarat",
            latitude=Decimal("23.0225"),
            longitude=Decimal("72.5714"),
            description="Heritage City",
            cost_index=2,
            popularity=4.5,
            best_time_to_visit="Oct - Mar",
        )
        session.add(city1)
        session.commit()
        assert city1.id is not None
        print(f"  [OK] Inserted city id={city1.id}, name={city1.name}")

        # Duplicate city in same country test
        duplicate_city = City(
            name="Ahmedabad",
            country="India",
            region="Gujarat",
        )
        session.add(duplicate_city)
        try:
            session.commit()
            raise AssertionError("[FAIL] Duplicate city in same country failed to trigger!")
        except IntegrityError:
            session.rollback()
            print("  [OK] Duplicate city (name+country) rejected properly.")

        # 4. TEST ACTIVITY INSERTION & CITY RELATIONSHIP
        print("\n[Test 4] Testing Activity insertion & City relationship...")
        act1 = Activity(
            city_id=city1.id,
            name="Sabarmati Ashram Walk",
            description="Historical heritage tour",
            category="culture",
            duration_minutes=90,
            estimated_cost=Decimal("0.0"),
            currency="INR",
            rating=4.8,
        )
        session.add(act1)
        session.commit()
        assert act1.id is not None
        assert act1.city.name == "Ahmedabad"
        assert len(city1.activities) == 1
        print(f"  [OK] Inserted activity id={act1.id}, linked to city '{act1.city.name}'")

        # 5. TEST TRIP INSERTION & USER RELATIONSHIP
        print("\n[Test 5] Testing Trip insertion & User relationship...")
        trip1 = Trip(
            user_id=user1.id,
            name="Gujarat Heritage Tour",
            description="Exploring historical landmarks",
            start_date=date(2026, 10, 1),
            end_date=date(2026, 10, 5),
            budget=Decimal("15000.00"),
            currency="INR",
            status="upcoming",
        )
        session.add(trip1)
        session.commit()
        assert trip1.id is not None
        assert trip1.user.name == "Test User 1"
        assert len(user1.trips) == 1
        print(f"  [OK] Inserted trip id={trip1.id}, belonging to user '{trip1.user.name}'")

        # 6. TEST TRIP STOP
        print("\n[Test 6] Testing TripStop connecting Trip and City...")
        stop1 = TripStop(
            trip_id=trip1.id,
            city_id=city1.id,
            arrival_date=date(2026, 10, 1),
            departure_date=date(2026, 10, 3),
            stop_order=1,
        )
        session.add(stop1)
        session.commit()
        assert stop1.id is not None
        assert stop1.trip.name == "Gujarat Heritage Tour"
        assert stop1.city.name == "Ahmedabad"
        print(f"  [OK] Connected Trip '{stop1.trip.name}' with City '{stop1.city.name}' (Stop Order {stop1.stop_order})")

        # 7. TEST ITINERARY ITEM
        print("\n[Test 7] Testing ItineraryItem linked to Trip, Activity, and Stop...")
        itin1 = ItineraryItem(
            trip_id=trip1.id,
            activity_id=act1.id,
            trip_stop_id=stop1.id,
            title="Sabarmati Morning Exploration",
            description="Visit museum",
            date=date(2026, 10, 1),
            start_time=time(9, 30),
            end_time=time(11, 0),
            item_type="activity",
            item_order=1,
            estimated_cost=Decimal("0.0"),
        )
        session.add(itin1)
        session.commit()
        assert itin1.id is not None
        assert itin1.trip.id == trip1.id
        assert itin1.activity.name == "Sabarmati Ashram Walk"
        assert itin1.trip_stop.id == stop1.id
        print(f"  [OK] Inserted itinerary item id={itin1.id}, title='{itin1.title}'")

        # 8. TEST EXPENSE
        print("\n[Test 8] Testing Expense linked to Trip...")
        exp1 = Expense(
            trip_id=trip1.id,
            category="food",
            description="Traditional Thali Lunch",
            amount=Decimal("450.00"),
            currency="INR",
            expense_date=date(2026, 10, 1),
        )
        session.add(exp1)
        session.commit()
        assert exp1.id is not None
        assert exp1.trip.id == trip1.id
        assert len(trip1.expenses) == 1
        print(f"  [OK] Inserted expense id={exp1.id}, amount={exp1.amount} {exp1.currency}")

        # 9. TEST MEMORY
        print("\n[Test 9] Testing Memory linked to User and Trip...")
        mem1 = Memory(
            user_id=user1.id,
            trip_id=trip1.id,
            image_url="https://images.unsplash.com/photo-test-sample.jpg",
            caption="Sunrise by the riverfront",
            location="Ahmedabad",
            memory_date=date(2026, 10, 1),
        )
        session.add(mem1)
        session.commit()
        assert mem1.id is not None
        assert mem1.user.id == user1.id
        assert mem1.trip.id == trip1.id
        assert len(user1.memories) == 1
        assert len(trip1.memories) == 1
        print(f"  [OK] Inserted memory id={mem1.id}, caption='{mem1.caption}'")

        # 10. TEST CHECK CONSTRAINTS
        print("\n[Test 10] Testing Check Constraints...")
        
        # Test negative budget
        bad_trip = Trip(
            user_id=user1.id,
            name="Negative Budget Trip",
            start_date=date(2026, 10, 1),
            end_date=date(2026, 10, 5),
            budget=Decimal("-500.00"),
        )
        session.add(bad_trip)
        try:
            session.commit()
            raise AssertionError("[FAIL] Negative budget constraint failed!")
        except IntegrityError:
            session.rollback()
            print("  [OK] Negative budget rejected properly.")

        # Test invalid trip dates (end_date < start_date)
        bad_dates_trip = Trip(
            user_id=user1.id,
            name="Invalid Dates Trip",
            start_date=date(2026, 10, 10),
            end_date=date(2026, 10, 5),
            budget=Decimal("500.00"),
        )
        session.add(bad_dates_trip)
        try:
            session.commit()
            raise AssertionError("[FAIL] Invalid trip dates constraint failed!")
        except IntegrityError:
            session.rollback()
            print("  [OK] Invalid dates (end < start) rejected properly.")

        # 11. TEST CASCADE DELETION
        print("\n[Test 11] Testing Cascade Deletion on Trip...")
        trip_id = trip1.id
        stop_id = stop1.id
        itin_id = itin1.id
        exp_id = exp1.id
        mem_id = mem1.id

        session.delete(trip1)
        session.commit()

        # Check cascading deletion of related entities
        assert session.get(Trip, trip_id) is None
        assert session.get(TripStop, stop_id) is None
        assert session.get(ItineraryItem, itin_id) is None
        assert session.get(Expense, exp_id) is None
        assert session.get(Memory, mem_id) is None
        
        # Ensure City is NOT deleted
        assert session.get(City, city1.id) is not None
        # Ensure User is NOT deleted
        assert session.get(User, user1.id) is not None
        print("  [OK] Cascading on Trip delete worked: stops, items, expenses, memories deleted; City and User preserved.")

        print("\n" + "=" * 70)
        print("[SUCCESS] ALL 11 TESTS PASSED SUCCESSFULLY!")
        print("=" * 70)
        return True

    except Exception as e:
        session.rollback()
        print(f"\n[FAIL] Test execution failed: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        session.close()


if __name__ == "__main__":
    use_sqlite = "--sqlite" in sys.argv or "--in-memory" in sys.argv
    success = run_database_tests(use_in_memory=use_sqlite)
    sys.exit(0 if success else 1)
