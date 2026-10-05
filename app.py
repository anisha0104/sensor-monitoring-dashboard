import time

from flask import Flask, jsonify, render_template

from sensors.simulator import SensorSimulator
from sensors.thresholds import get_status
from sensors.config import SENSOR_CONFIG

from database.db import (
    initialize_database,
    save_reading,
    get_readings,
    get_sensor_statistics,
    get_total_readings,
    save_alert,
    get_alerts,
    get_total_alerts,
)


app = Flask(__name__)

START_TIME = time.time()

simulator = SensorSimulator()

previous_sensor_statuses = {}

initialize_database()


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/sensors")
def get_sensors():
    data = simulator.update()

    sensors = {}

    for sensor, value in data.items():

        config = SENSOR_CONFIG[sensor]

        status = get_status(sensor, value)

        sensors[sensor] = {
            "name": config["name"],
            "value": round(value, 2),
            "unit": config["unit"],
            "status": status
        }

        save_reading(
            sensor,
            value,
            status
        )

        previous_status = previous_sensor_statuses.get(
            sensor
        )

        if (
            status != "NORMAL"
            and status != previous_status
        ):
            save_alert(
                sensor,
                value,
                status
            )

        previous_sensor_statuses[sensor] = status

    return jsonify(sensors)


@app.route("/api/history")
def get_history():
    readings = get_readings()

    return jsonify(readings)


@app.route("/api/alerts")
def get_alert_history():
    alerts = get_alerts()

    return jsonify(alerts)


@app.route("/api/statistics")
def get_statistics():

    return jsonify({
        "sensors": get_sensor_statistics(),
        "total_readings": get_total_readings(),
        "total_alerts": get_total_alerts()
    })


@app.route("/api/system")
def get_system_status():

    uptime_seconds = int(
        time.time() - START_TIME
    )

    return jsonify({
        "uptime_seconds": uptime_seconds,
        "total_readings": get_total_readings(),
        "total_alerts": get_total_alerts()
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(__import__("os").environ.get("PORT", 5000)),
        debug=False
    )