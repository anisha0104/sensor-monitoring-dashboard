# 📡 Sensor Monitoring Dashboard

A real-time sensor monitoring dashboard built with **Python, Flask, SQLite, JavaScript, and Chart.js**.

The project simulates multiple environmental and electrical sensors, continuously monitors their values, evaluates threshold conditions, stores historical readings, detects alerts, and presents the data through a responsive web dashboard.

🔗 **Live Demo:** https://sensor-monitoring-dashboard-w3jb.onrender.com/

## 📌 Project Overview

The **Sensor Monitoring Dashboard** is a software-based prototype of an IoT-style monitoring system.

Instead of requiring physical sensors, the project uses a Python sensor simulator to generate changing values for:

- 🌡️ Temperature
- 💧 Humidity
- ⚡ Voltage
- 🔌 Current
- ☀️ Light Intensity
- 🌬️ Pressure

The generated sensor data is continuously processed by the Flask backend, classified according to predefined thresholds, stored in a SQLite database, and displayed through a live web dashboard.

The system provides real-time monitoring, threshold detection, persistent alerts, sensor statistics, telemetry charts, and system health metrics.

## ✨ Features

### 📊 Real-Time Sensor Monitoring

The dashboard continuously updates sensor values without requiring a page refresh.

Each sensor displays:

- Current value
- Measurement unit
- Current status
- Threshold information
- Visual level indicator
- Live telemetry graph

### 🚦 Threshold-Based Status Detection

Each sensor has predefined operating thresholds.

The system classifies sensor readings into:

- 🟢 **NORMAL** — Sensor is operating within its normal range.
- 🟡 **WARNING** — Sensor has exceeded a warning threshold.
- 🔴 **CRITICAL** — Sensor has reached a critical threshold.

### 🚨 Persistent Alert System

When a sensor enters a warning or critical state, the system generates an alert.

Alerts include:

- Sensor name
- Severity
- Sensor value
- Timestamp
- Persistent database storage
- Recent alert feed

### 📈 Sensor Statistics

The dashboard calculates:

- Minimum value
- Maximum value
- Average value
- Total readings

for each monitored sensor.

### 📉 Telemetry Charts

Each sensor has a live telemetry chart implemented using **Chart.js**.

The charts display recent sensor readings and update automatically as new data arrives.

### 🖥️ System Monitoring

The dashboard also monitors the monitoring system itself.

It displays:

- Sensors online
- Active alerts
- Overall system status
- System uptime
- Total readings collected

## 📡 Monitored Sensors

| Sensor | Unit | Normal Threshold |
|---|---|---|
| Temperature | °C | ≤ 35°C |
| Humidity | % | ≤ 75% |
| Voltage | V | 11–13V |
| Current | A | ≤ 4A |
| Light Intensity | lux | ≤ 900 lux |
| Pressure | kPa | 97–104 kPa |

Critical thresholds are also defined in the backend for abnormal conditions.

## 🏗️ System Architecture

```text
                    Sensor Simulator
                           │
                           ▼
                    Flask Backend
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
       Threshold       SQLite DB       REST API
        Engine             │              │
             │             │              │
             └─────────────┼──────────────┘
                           ▼
                    JavaScript Frontend
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
     Sensor Cards      Alert Feed       Telemetry
          │                                 Charts
          ▼
    Statistics & System Metrics


    
🔄 How It Works
1. Sensor simulator generates readings
                ↓
2. Flask backend receives sensor values
                ↓
3. Threshold engine evaluates each value
                ↓
4. Sensor status is determined
                ↓
5. Reading is stored in SQLite
                ↓
6. Abnormal conditions generate alerts
                ↓
7. Flask API returns sensor data
                ↓
8. JavaScript updates the dashboard
                ↓
9. Charts, metrics and alerts refresh
🗄️ Database

The project uses SQLite for persistent storage.

sensor_readings

Stores historical sensor measurements.

Fields:

id
timestamp
sensor
value
status
alerts

Stores warning and critical sensor events.

Fields:

id
timestamp
sensor
value
severity
🔌 API Endpoints
Current Sensor Data
GET /api/sensors

Returns the latest sensor values and statuses.

Example:

{
    "temperature": {
        "name": "Temperature",
        "value": 25.42,
        "unit": "°C",
        "status": "NORMAL"
    }
}
Historical Readings
GET /api/history

Returns stored sensor readings.

Alert History
GET /api/alerts

Returns stored warning and critical alerts.

Sensor Statistics
GET /api/statistics

Returns sensor statistics, total readings, and total alerts.

System Status
GET /api/system

Returns system uptime, total readings, and total alerts.

📁 Project Structure
sensor-monitoring-dashboard/
│
├── database/
│   ├── __init__.py
│   └── db.py
│
├── sensors/
│   ├── __init__.py
│   ├── config.py
│   ├── simulator.py
│   └── thresholds.py
│
├── static/
│   ├── script.js
│   └── style.css
│
├── templates/
│   └── index.html
│
├── tests/
│   ├── __init__.py
│   ├── test_api.py
│   ├── test_database.py
│   └── test_sensors.py
│
├── .gitignore
├── app.py
├── README.md
└── requirements.txt
🛠️ Technologies Used
Backend
Python
Flask
SQLite
Frontend
HTML5
CSS3
JavaScript
Chart.js
Testing
Pytest
Deployment
Render
Gunicorn
Development
Git
GitHub
Visual Studio Code
🧪 Testing

The project includes automated tests using pytest.

The test suite covers:

Sensor simulator functionality
Sensor value validation
Threshold status detection
API responses
Sensor metadata
Database operations
Alert storage
Alert retrieval
Sensor statistics
System metrics

Run the tests with:

python -m pytest

Current test status:

10 tests passed
🚀 Run Locally
1. Clone the repository
git clone https://github.com/anisha0104/sensor-monitoring-dashboard.git
2. Open the project
cd sensor-monitoring-dashboard
3. Create a virtual environment
python -m venv .venv
4. Activate the virtual environment

On Windows:

.venv\Scripts\activate
5. Install dependencies
python -m pip install -r requirements.txt
6. Start the application
python app.py

Open the following URL in your browser:

http://127.0.0.1:5000
📦 Requirements

The project dependencies are:

Flask
pytest
gunicorn

These dependencies are listed in requirements.txt.

☁️ Deployment

The application is deployed on Render using Gunicorn.

Production start command:

gunicorn app:app
Live Application

https://sensor-monitoring-dashboard-w3jb.onrender.com/

GitHub Repository

https://github.com/anisha0104/sensor-monitoring-dashboard

🎯 Project Goals

The main goals of this project were to demonstrate practical understanding of:

Python backend development
Flask application development
REST API design
Sensor data simulation
Threshold-based monitoring
SQLite database integration
Persistent data storage
Alert generation
Real-time frontend updates
Data visualization
Automated testing
Git and GitHub
Cloud deployment
💡 What I Learned

This project provided practical experience with:

Building a Flask web application from scratch
Designing modular Python components
Creating REST API endpoints
Working with SQLite databases
Persisting sensor data
Implementing threshold-based monitoring
Creating real-time dashboard updates
Connecting JavaScript with backend APIs
Visualizing telemetry using Chart.js
Writing automated tests with pytest
Deploying Python applications with Gunicorn
Using Render for cloud deployment
Managing a software project with Git and GitHub
🔮 Future Improvements

Possible future improvements include:

Real hardware sensor integration
ESP32 sensor integration
Raspberry Pi sensor integration
MQTT communication
WebSocket-based real-time updates
Configurable thresholds
User authentication
CSV data export
Email notifications
SMS notifications
Advanced historical analytics
Cloud database integration
Docker containerization
IoT device management
📸 Dashboard

The dashboard provides a centralized interface for monitoring environmental and electrical telemetry.

It includes:

Live sensor cards
Threshold indicators
Sensor status monitoring
Persistent alert history
Sensor statistics
Telemetry charts
System health metrics
👩‍💻 Author

Anisha

Electronics & Telecommunication Engineering

Areas of Interest
Embedded Systems
Electronics
Python
Cloud Computing
IoT
Robotics
Computer Vision
Motorsport Technology
⭐ Project Status

🟢 Complete + Deployed

Implemented features:

✅ Sensor simulation
✅ Six monitored sensors
✅ Threshold detection
✅ Normal / Warning / Critical states
✅ SQLite database
✅ Persistent sensor readings
✅ Persistent alerts
✅ Sensor statistics
✅ Real-time telemetry charts
✅ System metrics
✅ Responsive dashboard
✅ Automated tests
✅ GitHub repository
✅ Render deployment
🔗 Links

GitHub Repository

https://github.com/anisha0104/sensor-monitoring-dashboard

Live Dashboard

https://sensor-monitoring-dashboard-w3jb.onrender.com/

📜 License

This project is created for educational, portfolio, and demonstration purposes.
