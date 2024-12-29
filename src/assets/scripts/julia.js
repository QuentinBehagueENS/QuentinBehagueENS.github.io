function drawJuliaSet() {
    const canvas = document.getElementById('juliaCanvas');
    const container = document.querySelector('.juliacontainer');

    // Ajuste la taille réelle du canvas en fonction de celle du conteneur
    canvas.width = Math.min(container.clientWidth, container.clientHeight);
    canvas.height = Math.min(container.clientWidth, container.clientHeight);

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const realPart = parseFloat(document.getElementById('real').value);
    const imagPart = parseFloat(document.getElementById('imag').value);

    const maxIterations = 300;
    const zoom = 2;
    const offsetX = width / 2;
    const offsetY = height / 2;

    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const zx = (x - offsetX) / (width / zoom);
            const zy = (y - offsetY) / (height / zoom);

            let zxTemp = zx;
            let zyTemp = zy;
            let iteration = 0;

            while (zxTemp * zxTemp + zyTemp * zyTemp < 4 && iteration < maxIterations) {
                const xtemp = zxTemp * zxTemp - zyTemp * zyTemp + realPart;
                zyTemp = 2 * zxTemp * zyTemp + imagPart;
                zxTemp = xtemp;
                iteration++;
            }

            const pixelIndex = (y * width + x) * 4;
            const color = iteration === maxIterations ? 0 : (iteration / maxIterations) * 255;

            data[pixelIndex] = (5*color)%256; // Red
            data[pixelIndex + 1] = (20*color)%256; // Green
            data[pixelIndex + 2] = (2*color)%256; // Blue
            data[pixelIndex + 3] = 255; // Alpha
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

// Fonction pour redessiner automatiquement le canvas lors du redimensionnement
function resizeCanvas() {
    drawJuliaSet();
}