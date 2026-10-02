from sensors.simulator import SensorSimulator


def test_sensor_simulator_returns_all_sensors():
    simulator = SensorSimulator()
    data = simulator.update()

    expected_sensors = {
        "temperature",
        "humidity",
        "voltage",
        "current",
        "light",
        "pressure",
    }

    assert set(data.keys()) == expected_sensors


def test_sensor_values_are_numbers():
    simulator = SensorSimulator()
    data = simulator.update()

    for value in data.values():
        assert isinstance(value, (int, float))

from sensors.thresholds import get_status


def test_temperature_status():
    assert get_status("temperature", 25) == "NORMAL"
    assert get_status("temperature", 37) == "WARNING"
    assert get_status("temperature", 42) == "CRITICAL"


def test_voltage_status():
    assert get_status("voltage", 12) == "NORMAL"
    assert get_status("voltage", 10.5) == "WARNING"
    assert get_status("voltage", 9) == "CRITICAL"