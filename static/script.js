const sensorCharts = {};
const sensorHistory = {};
const sensorLabels = [];

const sensors = [
    "temperature",
    "humidity",
    "voltage",
    "current",
    "light",
    "pressure"
];

const chartColors = {
    temperature: "#f472b6",
    humidity: "#38d9ff",
    voltage: "#a78bfa",
    current: "#ffbd59",
    light: "#ffe66d",
    pressure: "#45e0a0"
};


/* =========================
   CHART CREATION
========================= */

function createCharts() {

    sensors.forEach(sensor => {

        const canvas =
            document.getElementById(`${sensor}Chart`);

        if (!canvas) return;

        sensorHistory[sensor] = [];

        const ctx = canvas.getContext("2d");

        sensorCharts[sensor] = new Chart(ctx, {

            type: "line",

            data: {
                labels: sensorLabels,

                datasets: [{
                    data: sensorHistory[sensor],

                    borderColor: chartColors[sensor],

                    backgroundColor:
                        `${chartColors[sensor]}18`,

                    borderWidth: 2,

                    pointRadius: 0,

                    pointHoverRadius: 4,

                    tension: 0.4,

                    fill: true
                }]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                animation: {
                    duration: 350
                },

                interaction: {
                    intersect: false,
                    mode: "index"
                },

                plugins: {

                    legend: {
                        display: false
                    },

                    tooltip: {
                        backgroundColor: "#151522",
                        borderColor: chartColors[sensor],
                        borderWidth: 1,

                        titleColor: "#ffffff",
                        bodyColor: "#aaaabd",

                        padding: 10,

                        displayColors: false
                    }
                },

                scales: {

                    x: {
                        grid: {
                            color:
                                "rgba(255,255,255,.035)"
                        },

                        ticks: {
                            color: "#6f7085",
                            maxTicksLimit: 7,
                            font: {
                                size: 9
                            }
                        }
                    },

                    y: {
                        grid: {
                            color:
                                "rgba(255,255,255,.035)"
                        },

                        ticks: {
                            color: "#6f7085",
                            font: {
                                size: 9
                            }
                        }
                    }
                }
            }
        });
    });
}


/* =========================
   CHART UPDATE
========================= */

function updateCharts(data) {

    const now = new Date();

    sensorLabels.push(
        now.toLocaleTimeString([], {
            minute: "2-digit",
            second: "2-digit"
        })
    );

    sensors.forEach(sensor => {

        if (!data[sensor]) return;

        sensorHistory[sensor].push(
            data[sensor].value
        );

        if (sensorHistory[sensor].length > 20) {
            sensorHistory[sensor].shift();
        }

        if (sensorCharts[sensor]) {
            sensorCharts[sensor].update();
        }
    });

    if (sensorLabels.length > 20) {
        sensorLabels.shift();
    }
}


/* =========================
   SENSOR UPDATE
========================= */

async function updateSensors() {

    try {

        const response =
            await fetch("/api/sensors");

        if (!response.ok) {
            throw new Error(
                "Failed to fetch sensor data"
            );
        }

        const data =
            await response.json();


        for (const sensor in data) {

            const sensorData =
                data[sensor];

            const valueElement =
                document.getElementById(sensor);

            const statusElement =
                document.getElementById(
                    `${sensor}-status`
                );


            if (valueElement) {

                animateValue(
                    valueElement,
                    sensorData.value
                );
            }


            if (statusElement) {

                statusElement.textContent =
                    sensorData.status;

                statusElement.className =
                    `status ${sensorData.status.toLowerCase()}`;
            }


            updateSensorCard(
                sensor,
                sensorData.status
            );
        }


        updateSystemStats(data);

        updateCharts(data);

        updateTimestamp();

        checkAlerts(data);


    } catch (error) {

        console.error(
            "Sensor update failed:",
            error
        );
    }
}


/* =========================
   VALUE ANIMATION
========================= */

function animateValue(element, value) {

    element.classList.remove("value-update");

    void element.offsetWidth;

    element.textContent = value;

    element.classList.add("value-update");
}


/* =========================
   SENSOR CARD STATUS
========================= */

function updateSensorCard(sensor, status) {

    const card =
        document.querySelector(
            `.sensor-card.${sensor}`
        );

    if (!card) return;

    card.classList.remove(
        "card-warning",
        "card-critical"
    );

    if (status === "WARNING") {

        card.classList.add(
            "card-warning"
        );
    }

    if (status === "CRITICAL") {

        card.classList.add(
            "card-critical"
        );
    }
}


/* =========================
   SYSTEM STATISTICS
========================= */

function updateSystemStats(data) {

    let activeAlerts = 0;

    let criticalSensors = 0;


    for (const sensor in data) {

        if (
            data[sensor].status === "WARNING" ||
            data[sensor].status === "CRITICAL"
        ) {

            activeAlerts++;
        }


        if (
            data[sensor].status === "CRITICAL"
        ) {

            criticalSensors++;
        }
    }


    const alertsElement =
        document.getElementById(
            "active-alerts"
        );

    const statusElement =
        document.getElementById(
            "overall-status"
        );

    const onlineElement =
        document.getElementById(
            "sensors-online"
        );


    if (alertsElement) {

        alertsElement.textContent =
            activeAlerts;
    }


    if (onlineElement) {

        onlineElement.textContent =
            `${Object.keys(data).length} / 6`;
    }


    if (statusElement) {

        if (criticalSensors > 0) {

            statusElement.textContent =
                "CRITICAL";

        } else if (activeAlerts > 0) {

            statusElement.textContent =
                "WARNING";

        } else {

            statusElement.textContent =
                "NORMAL";
        }
    }
}


/* =========================
   TIMESTAMP
========================= */

function updateTimestamp() {

    const element =
        document.getElementById(
            "last-updated"
        );

    if (!element) return;

    element.textContent =
        new Date().toLocaleTimeString();
}


/* =========================
   ALERT SYSTEM
========================= */

const previousStatuses = {};


function checkAlerts(data) {

    for (const sensor in data) {

        const currentStatus =
            data[sensor].status;

        const previousStatus =
            previousStatuses[sensor];


        if (
            currentStatus !== "NORMAL" &&
            currentStatus !== previousStatus
        ) {

            addAlert(
                sensor,
                data[sensor]
            );
        }


        previousStatuses[sensor] =
            currentStatus;
    }
}


function addAlert(sensor, data) {

    const feed =
        document.getElementById(
            "alert-feed"
        );

    if (!feed) return;


    const alert =
        document.createElement("div");

    alert.className =
        `alert-item ${data.status.toLowerCase()}`;


    const time =
        new Date().toLocaleTimeString();


    alert.innerHTML = `

        <div class="alert-icon">
            !
        </div>

        <div class="alert-content">

            <strong>
                ${data.status}
            </strong>

            <span>
                ${sensor.toUpperCase()}
                exceeded threshold
            </span>

            <small>
                ${data.value} ${data.unit}
                • ${time}
            </small>

        </div>
    `;


    feed.prepend(alert);


    while (feed.children.length > 5) {

        feed.removeChild(
            feed.lastElementChild
        );
    }
}


/* =========================
   START SYSTEM
========================= */

createCharts();

updateSensors();

setInterval(
    updateSensors,
    3000
);