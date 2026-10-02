from flask import Flask, jsonify, render_template

from sensors.simulator import SensorSimulator
from sensors.thresholds import get_status
from sensors.config import SENSOR_CONFIG
from database.db import initialize_database, save_reading, get_readings

app = Flask(__name__)

simulator = SensorSimulator()
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

        save_reading(sensor, value, status)

    return jsonify(sensors)

@app.route("/api/history")
def get_history():
    readings = get_readings()

    return jsonify(readings)

if __name__ == "__main__":
    app.run(debug=True)