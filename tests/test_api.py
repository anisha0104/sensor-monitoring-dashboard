from app import app


def test_sensor_api():
    client = app.test_client()

    response = client.get("/api/sensors")

    assert response.status_code == 200

    data = response.get_json()

    assert "temperature" in data
    assert "humidity" in data
    assert "voltage" in data
    assert "current" in data
    assert "light" in data
    assert "pressure" in data


def test_sensor_metadata():
    client = app.test_client()

    response = client.get("/api/sensors")
    data = response.get_json()

    temperature = data["temperature"]

    assert temperature["name"] == "Temperature"
    assert temperature["unit"] == "°C"
    assert "value" in temperature
    assert "status" in temperature