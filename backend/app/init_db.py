"""
Database Initialization Script
Creates PostgreSQL database if missing and initializes all tables defined in SQLAlchemy ORM models.
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

from sqlalchemy import inspect
from app.database import engine, Base, DATABASE_URL
import app.models  # Ensure all models are imported and registered with Base.metadata


def ensure_postgres_database_exists() -> None:
    """
    If connected to PostgreSQL, checks if the target database exists.
    If not, connects to the default 'postgres' database and creates it.
    """
    if "postgresql" in DATABASE_URL:
        try:
            import psycopg
            clean_url = DATABASE_URL.replace("postgresql+psycopg://", "postgresql://").replace("postgresql+psycopg2://", "postgresql://")
            
            # Extract database name
            db_name = clean_url.rstrip("/").split("/")[-1].split("?")[0]
            admin_url = clean_url.rsplit("/", 1)[0] + "/postgres"
            
            with psycopg.connect(admin_url, autocommit=True) as conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT 1 FROM pg_database WHERE datname=%s", (db_name,))
                    if not cur.fetchone():
                        print(f"[*] Creating PostgreSQL database '{db_name}'...")
                        cur.execute(f'CREATE DATABASE "{db_name}"')
                        print(f"[OK] Database '{db_name}' created successfully.")
        except Exception as e:
            # If auto-creation fails due to permissions or different setup, proceed to create_all
            pass


def init_database(drop_existing: bool = False) -> None:
    """
    Initialize all database tables.
    
    :param drop_existing: If True, drops all existing tables before recreating.
    """
    ensure_postgres_database_exists()

    if drop_existing:
        print("[*] Dropping all existing database tables...")
        Base.metadata.drop_all(bind=engine)
        print("[OK] All tables dropped.")

    print("[*] Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    # Verify tables
    inspector = inspect(engine)
    table_names = inspector.get_table_names()
    
    print("[OK] Successfully initialized database tables:")
    for name in sorted(table_names):
        print(f"  - {name}")
    print(f"\nTotal tables created: {len(table_names)}")


def reset_database() -> None:
    """Drop and recreate all tables."""
    init_database(drop_existing=True)


if __name__ == "__main__":
    drop_flag = "--drop" in sys.argv or "--reset" in sys.argv
    init_database(drop_existing=drop_flag)
