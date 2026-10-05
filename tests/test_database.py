from database.db import initialize_database, get_connection
from database.db import (
    initialize_database,
    get_connection,
    save_reading,
    get_readings,
    save_alert,
    get_alerts,
    get_total_alerts,
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

    from database.db import (
    save_alert,
    get_alerts,
    get_total_alerts,
)


def test_save_and_get_alert(tmp_path, monkeypatch):
    database_path = tmp_path / "test_sensors.db"

    monkeypatch.setattr(
        "database.db.DATABASE",
        str(database_path)
    )

    initialize_database()

    save_alert(
        "temperature",
        36.5,
        "WARNING"
    )

    alerts = get_alerts()

    assert len(alerts) == 1
    assert alerts[0]["sensor"] == "temperature"
    assert alerts[0]["value"] == 36.5
    assert alerts[0]["severity"] == "WARNING"
    assert "timestamp" in alerts[0]


def test_total_alerts(tmp_path, monkeypatch):
    database_path = tmp_path / "test_sensors.db"

    monkeypatch.setattr(
        "database.db.DATABASE",
        str(database_path)
    )

    initialize_database()

    assert get_total_alerts() == 0

    save_alert(
        "temperature",
        36.5,
        "WARNING"
    )

    save_alert(
        "voltage",
        9.5,
        "CRITICAL"
    )

    assert get_total_alerts() == 2