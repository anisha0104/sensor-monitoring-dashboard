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
   SENSOR THRESHOLD CONFIG
========================= */

const thresholdConfig = {

    temperature: {
        min: 0,
        warning: 35,
        critical: 40,
        max: 45
    },

    humidity: {
        min: 0,
        warning: 75,
        critical: 85,
        max: 100
    },

    voltage: {
        min: 8,
        criticalLow: 10,
        warningLow: 11,
        warningHigh: 13,
        criticalHigh: 14,
        max: 16
    },

    current: {
        min: 0,
        warning: 4,
        critical: 5,
        max: 6
    },

    light: {
        min: 0,
        warning: 900,
        critical: 1000,
        max: 1100
    },

    pressure: {
        min: 93,
        criticalLow: 95,
        warningLow: 97,
        warningHigh: 104,
        criticalHigh: 105,
        max: 107
    }
};


/* =========================
   CHARTS
========================= */

function createCharts() {

    sensors.forEach(sensor => {

        const canvas =
            document.getElementById(`${sensor}Chart`);

        if (!canvas) return;

        sensorHistory[sensor] = [];

        const ctx =
            canvas.getContext("2d");

        sensorCharts[sensor] =
            new Chart(ctx, {

                type: "line",

                data: {
                    labels: sensorLabels,

                    datasets: [{
                        data: sensorHistory[sensor],

                        borderColor:
                            chartColors[sensor],

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

                            backgroundColor:
                                "#151522",

                            borderColor:
                                chartColors[sensor],

                            borderWidth: 1,

                            titleColor:
                                "#ffffff",

                            bodyColor:
                                "#aaaabd",

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

                                color:
                                    "#6f7085",

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

                                color:
                                    "#6f7085",

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

        if (
            sensorHistory[sensor].length > 20
        ) {
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
   THRESHOLD VISUALIZATION
========================= */

function getThresholdPercentage(
    sensor,
    value
) {

    const config =
        thresholdConfig[sensor];

    if (!config) return 0;

    let percentage;

    if (
        config.warningLow !== undefined
    ) {

        percentage =
            (
                (value - config.min) /
                (config.max - config.min)
            ) * 100;

    } else {

        percentage =
            (
                (value - config.min) /
                (config.max - config.min)
            ) * 100;
    }

    return Math.max(
        0,
        Math.min(100, percentage)
    );
}


function updateThresholdVisualization(
    sensor,
    value,
    status
) {

    const card =
        document.querySelector(
            `.sensor-card.${sensor}`
        );

    if (!card) return;

    const meter =
        card.querySelector(".meter");

    const meterFill =
        card.querySelector(".meter span");

    if (!meter || !meterFill) return;

    const percentage =
        getThresholdPercentage(
            sensor,
            value
        );

    meterFill.style.width =
        `${percentage}%`;

    meterFill.classList.remove(
        "meter-warning",
        "meter-critical"
    );

    if (status === "WARNING") {

        meterFill.classList.add(
            "meter-warning"
        );
    }

    if (status === "CRITICAL") {

        meterFill.classList.add(
            "meter-critical"
        );
    }

    const indicator =
        meter.querySelector(
            ".threshold-indicator"
        );

    if (indicator) {

        indicator.style.left =
            `${percentage}%`;

        indicator.setAttribute(
            "aria-label",
            `Current value ${value}`
        );
    }

    const valueMarker =
        meter.querySelector(
            ".meter-value"
        );

    if (valueMarker) {

        valueMarker.textContent =
            `${value}`;
    }

    const rangeLabel =
        card.querySelector(
            ".threshold-range"
        );

    if (rangeLabel) {

        rangeLabel.textContent =
            getThresholdLabel(
                sensor,
                value
            );
    }
}


function getThresholdLabel(
    sensor,
    value
) {

    const config =
        thresholdConfig[sensor];

    if (!config) {
        return "NORMAL RANGE";
    }

    if (
        config.criticalLow !== undefined
    ) {

        if (
            value < config.criticalLow ||
            value > config.criticalHigh
        ) {
            return "CRITICAL RANGE";
        }

        if (
            value < config.warningLow ||
            value > config.warningHigh
        ) {
            return "WARNING RANGE";
        }

        return "NORMAL RANGE";
    }

    if (
        value >= config.critical
    ) {
        return "CRITICAL RANGE";
    }

    if (
        value >= config.warning
    ) {
        return "WARNING RANGE";
    }

    return "NORMAL RANGE";
}


/* =========================
   SENSOR UPDATES
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

            updateThresholdVisualization(
                sensor,
                sensorData.value,
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


function animateValue(
    element,
    value
) {

    element.classList.remove(
        "value-update"
    );

    void element.offsetWidth;

    element.textContent = value;

    element.classList.add(
        "value-update"
    );
}


function updateSensorCard(
    sensor,
    status
) {

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
   SYSTEM STATUS
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
            "metric-sensors-online"
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
   LIVE ALERTS
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


function addAlert(
    sensor,
    data
) {

    const feed =
        document.getElementById(
            "alert-feed"
        );

    if (!feed) return;

    const emptyAlert =
        feed.querySelector(
            ".empty-alert"
        );

    if (emptyAlert) {
        emptyAlert.remove();
    }

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
   PERSISTENT ALERT HISTORY
========================= */

async function loadAlertHistory() {

    try {

        const response =
            await fetch("/api/alerts");

        if (!response.ok) {

            throw new Error(
                "Failed to fetch alert history"
            );
        }

        const alerts =
            await response.json();

        const feed =
            document.getElementById(
                "alert-feed"
            );

        if (!feed) return;

        if (alerts.length === 0) {
            return;
        }

        feed.innerHTML = "";

        alerts.slice(0, 5).forEach(
            alert => {

                const alertElement =
                    document.createElement(
                        "div"
                    );

                alertElement.className =
                    `alert-item ${alert.severity.toLowerCase()}`;

                const time =
                    new Date(
                        alert.timestamp
                    ).toLocaleTimeString();

                alertElement.innerHTML = `

                    <div class="alert-icon">
                        !
                    </div>

                    <div class="alert-content">

                        <strong>
                            ${alert.severity}
                        </strong>

                        <span>
                            ${alert.sensor.toUpperCase()}
                            exceeded threshold
                        </span>

                        <small>
                            ${Number(
                                alert.value
                            ).toFixed(2)}
                            • ${time}
                        </small>

                    </div>
                `;

                feed.appendChild(
                    alertElement
                );
            }
        );

    } catch (error) {

        console.error(
            "Alert history update failed:",
            error
        );
    }
}


/* =========================
   SENSOR STATISTICS
========================= */

async function updateStatistics() {

    try {

        const response =
            await fetch("/api/statistics");

        if (!response.ok) {

            throw new Error(
                "Failed to fetch statistics"
            );
        }

        const data =
            await response.json();

        data.sensors.forEach(
            sensor => {

                const name =
                    sensor.sensor;

                const minimum =
                    document.getElementById(
                        `${name}-min`
                    );

                const maximum =
                    document.getElementById(
                        `${name}-max`
                    );

                const average =
                    document.getElementById(
                        `${name}-average`
                    );

                if (minimum) {

                    minimum.textContent =
                        Number(
                            sensor.minimum
                        ).toFixed(2);
                }

                if (maximum) {

                    maximum.textContent =
                        Number(
                            sensor.maximum
                        ).toFixed(2);
                }

                if (average) {

                    average.textContent =
                        Number(
                            sensor.average
                        ).toFixed(2);
                }
            }
        );

    } catch (error) {

        console.error(
            "Statistics update failed:",
            error
        );
    }
}


/* =========================
   SYSTEM METRICS
========================= */

async function updateSystemMetrics() {

    try {

        const response =
            await fetch("/api/system");

        if (!response.ok) {

            throw new Error(
                "Failed to fetch system status"
            );
        }

        const data =
            await response.json();

        const uptimeElement =
            document.getElementById(
                "system-uptime"
            );

        const readingsElement =
            document.getElementById(
                "total-readings"
            );

        if (uptimeElement) {

            const totalSeconds =
                data.uptime_seconds;

            const hours =
                Math.floor(
                    totalSeconds / 3600
                );

            const minutes =
                Math.floor(
                    (totalSeconds % 3600) / 60
                );

            const seconds =
                totalSeconds % 60;

            uptimeElement.textContent =

                `${String(hours).padStart(2, "0")}:` +

                `${String(minutes).padStart(2, "0")}:` +

                `${String(seconds).padStart(2, "0")}`;
        }

        if (readingsElement) {

            readingsElement.textContent =
                data.total_readings
                    .toLocaleString();
        }

    } catch (error) {

        console.error(
            "System metrics update failed:",
            error
        );
    }
}


/* =========================
   INITIALIZATION
========================= */

createCharts();

updateSensors();

updateStatistics();

updateSystemMetrics();

loadAlertHistory();


setInterval(
    updateSensors,
    3000
);

setInterval(
    updateStatistics,
    5000
);

setInterval(
    updateSystemMetrics,
    3000
);