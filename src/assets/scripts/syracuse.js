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

function generateSyracuse() {
    const inputNumber = document.getElementById("inputNumber").value;
    const n = parseInt(inputNumber);
    if (isNaN(n) || n <= 0) {
        alert("Please enter a valid positive integer.");
        return;
    }
    const sequence = generateSyracuseSequence(n);
    updateChart(sequence);
}

// Chart.js setup
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

function updateChart(sequence) {
    syracuseChart.data.labels = Array.from({ length: sequence.length }, (_, i) => i); // Steps
    syracuseChart.data.datasets[0].data = sequence; // Sequence values
    syracuseChart.update();
}