import random


class SensorSimulator:
    def __init__(self):
        self.values = {
            "temperature": 25.0,
            "humidity": 60.0,
            "voltage": 12.0,
            "current": 1.5,
            "light": 500.0,
            "pressure": 101.3,
        }

    def update(self):
        self.values["temperature"] += random.uniform(-0.5, 0.5)
        self.values["humidity"] += random.uniform(-1.0, 1.0)
        self.values["voltage"] += random.uniform(-0.1, 0.1)
        self.values["current"] += random.uniform(-0.2, 0.2)
        self.values["light"] += random.uniform(-30, 30)
        self.values["pressure"] += random.uniform(-0.3, 0.3)

        return self.values.copy()