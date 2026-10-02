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