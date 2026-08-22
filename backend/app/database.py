"""
Database Engine, Session Configuration, and Base Declarative Model.
"""

import os
from contextlib import contextmanager
from typing import Generator
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker, Session

# Load environment variables from .env file
load_dotenv()

# Read Database Configuration from Environment
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://postgres:postgres@localhost:5432/globetrotter"
)

# Convert legacy 'postgres://' to 'postgresql://' or 'postgresql+psycopg://' if needed
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg://", 1)
elif DATABASE_URL.startswith("postgresql://") and not DATABASE_URL.startswith("postgresql+"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)

DB_ECHO = os.getenv("DB_ECHO", "False").lower() in ("true", "1", "yes", "t")

# Database Engine Configuration
# pool_pre_ping ensures stale connections are tested and recycled automatically
engine = create_engine(
    DATABASE_URL,
    echo=DB_ECHO,
    pool_pre_ping=True,
    future=True
)

# Session Factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    future=True
)


class Base(DeclarativeBase):
    """
    SQLAlchemy 2.0 Base class for all ORM models.
    """
    pass


@contextmanager
def get_db_session() -> Generator[Session, None, None]:
    """
    Context manager for database sessions with automatic rollback on error
    and proper session closure.
    
    Usage:
        with get_db_session() as db:
            db.query(...)
    """
    db: Session = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI-ready dependency generator for database sessions.
    
    Usage:
        def my_route(db: Session = Depends(get_db)):
            ...
    """
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
