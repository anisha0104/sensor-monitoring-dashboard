from database.db import initialize_database, get_connection
from database.db import (
    initialize_database,
    get_connection,
    save_reading,
    get_readings,
)

def test_database_initialization(tmp_path, monkeypatch):
    database_path = tmp_path / "test_sensors.db"

    monkeypatch.setattr(
        "database.db.DATABASE",
        str(database_path)
    )

    initialize_database()

    connection = get_connection()

    table = connection.execute("""
        SELECT name
        FROM sqlite_master
        WHERE type='table'
        AND name='sensor_readings'
    """).fetchone()

    connection.close()

    assert table is not None

def test_save_and_get_reading(tmp_path, monkeypatch):
    database_path = tmp_path / "test_sensors.db"

    monkeypatch.setattr(
        "database.db.DATABASE",
        str(database_path)
    )

    initialize_database()

    save_reading("temperature", 25.5, "NORMAL")

    readings = get_readings()

    assert len(readings) == 1
    assert readings[0]["sensor"] == "temperature"
    assert readings[0]["value"] == 25.5
    assert readings[0]["status"] == "NORMAL"
    assert "timestamp" in readings[0]