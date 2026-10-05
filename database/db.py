import sqlite3
from datetime import datetime


DATABASE = "sensors.db"


def get_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database():
    connection = get_connection()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS sensor_readings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            sensor TEXT NOT NULL,
            value REAL NOT NULL,
            status TEXT NOT NULL
        )
    """)

    connection.execute("""
        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            sensor TEXT NOT NULL,
            value REAL NOT NULL,
            severity TEXT NOT NULL
        )
    """)

    connection.commit()
    connection.close()


def save_reading(sensor, value, status):
    connection = get_connection()

    timestamp = datetime.now().isoformat()

    connection.execute("""
        INSERT INTO sensor_readings
        (timestamp, sensor, value, status)
        VALUES (?, ?, ?, ?)
    """, (timestamp, sensor, value, status))

    connection.commit()
    connection.close()


def get_readings(limit=100):
    connection = get_connection()

    readings = connection.execute("""
        SELECT timestamp, sensor, value, status
        FROM sensor_readings
        ORDER BY id DESC
        LIMIT ?
    """, (limit,)).fetchall()

    connection.close()

    return [dict(reading) for reading in readings]


def get_sensor_statistics():
    connection = get_connection()

    statistics = connection.execute("""
        SELECT
            sensor,
            COUNT(*) AS readings,
            MIN(value) AS minimum,
            MAX(value) AS maximum,
            AVG(value) AS average
        FROM sensor_readings
        GROUP BY sensor
    """).fetchall()

    connection.close()

    return [dict(row) for row in statistics]


def get_total_readings():
    connection = get_connection()

    result = connection.execute("""
        SELECT COUNT(*) AS total
        FROM sensor_readings
    """).fetchone()

    connection.close()

    return result["total"]


def save_alert(sensor, value, severity):
    connection = get_connection()

    timestamp = datetime.now().isoformat()

    connection.execute("""
        INSERT INTO alerts
        (timestamp, sensor, value, severity)
        VALUES (?, ?, ?, ?)
    """, (timestamp, sensor, value, severity))

    connection.commit()
    connection.close()


def get_alerts(limit=50):
    connection = get_connection()

    alerts = connection.execute("""
        SELECT timestamp, sensor, value, severity
        FROM alerts
        ORDER BY id DESC
        LIMIT ?
    """, (limit,)).fetchall()

    connection.close()

    return [dict(alert) for alert in alerts]


def get_total_alerts():
    connection = get_connection()

    result = connection.execute("""
        SELECT COUNT(*) AS total
        FROM alerts
    """).fetchone()

    connection.close()

    return result["total"]