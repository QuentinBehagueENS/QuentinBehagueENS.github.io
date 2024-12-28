function generateSyracuseSequence(n) {
    let sequence = [n];
    while (n !== 1) {
        if (n % 2 === 0) {
            n = n / 2;
        } else {
            n = 3 * n + 1;
        }
        sequence.push(n);
    }
    return sequence;
}

function calculateMetrics(sequence, seed) {
    const altitudeMax = Math.max(...sequence);
    const timeToOne = sequence.length - 1; // Temps de vol: nombre d'itérations pour atteindre 1
    const timeInAltitude = sequence.findIndex(value => value < seed); // Temps avant d'être inférieur à la graine
    return {
        altitudeMax,
        timeToOne,
        timeInAltitude: timeInAltitude === -1 ? timeToOne : timeInAltitude, // Si jamais on ne redescend pas, utilisez le temps total
    };
}

function generateSyracuse() {
    const inputNumber = document.getElementById("inputNumber").value;
    const n = parseInt(inputNumber);
    if (isNaN(n) || n <= 0) {
        alert("Please enter a valid positive integer.");
        return;
    }
    const sequence = generateSyracuseSequence(n);
    const metrics = calculateMetrics(sequence, n);
    updateChart(sequence);
    displayMetrics(metrics);
}

// Fonction pour mettre à jour le graphique
function updateChart(sequence) {
    syracuseChart.data.labels = Array.from({ length: sequence.length }, (_, i) => i); // Steps
    syracuseChart.data.datasets[0].data = sequence; // Sequence values
    syracuseChart.update();
}

// Fonction pour afficher les métriques
function displayMetrics(metrics) {
    const metricsDiv = document.getElementById("metrics");
    metricsDiv.innerHTML = `
        <p><strong>Temps de vol :</strong> ${metrics.timeToOne}</p>
        <p><strong>Temps de vol en altitude :</strong> ${metrics.timeInAltitude}</p>
        <p><strong>Altitude maximale :</strong> ${metrics.altitudeMax}</p>
    `;
}

// Configuration Chart.js
const ctx = document.getElementById("syracuseChart").getContext("2d");
const syracuseChart = new Chart(ctx, {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "Suite de Syracuse",
            data: [],
            borderColor: "rgb(27, 96, 46)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 2,
            pointRadius: 3
            
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false, // Permet de s'adapter aux tailles flexibles
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Itération"
                }
            },
            y: {
                title: {
                    display: true,
                    text: "Altitude"
                }
            }
        }
    }
});
