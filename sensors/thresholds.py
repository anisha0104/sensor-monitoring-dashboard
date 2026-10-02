THRESHOLDS = {
    "temperature": {
        "warning": 35,
        "critical": 40,
    },
    "humidity": {
        "warning": 75,
        "critical": 85,
    },
    "voltage": {
        "warning_low": 11,
        "warning_high": 13,
        "critical_low": 10,
        "critical_high": 14,
    },
    "current": {
        "warning": 4,
        "critical": 5,
    },
    "light": {
        "warning": 900,
        "critical": 1000,
    },
    "pressure": {
        "warning_low": 97,
        "warning_high": 104,
        "critical_low": 95,
        "critical_high": 105,
    },
}


def get_status(sensor, value):
    threshold = THRESHOLDS[sensor]

    if sensor in ["voltage", "pressure"]:
        if value < threshold["critical_low"] or value > threshold["critical_high"]:
            return "CRITICAL"

        if value < threshold["warning_low"] or value > threshold["warning_high"]:
            return "WARNING"

        return "NORMAL"

    if value >= threshold["critical"]:
        return "CRITICAL"

    if value >= threshold["warning"]:
        return "WARNING"

    return "NORMAL"