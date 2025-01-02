
var sliderWidth = document.getElementById('numberSliderWidth');
var sliderHeight = document.getElementById('numberSliderHeight');
var sliderValueDisplayWidth = document.getElementById('sliderValueWidth');
var sliderValueDisplayHeight = document.getElementById('sliderValueHeight');
var colorListSizeSlider = document.getElementById('colorListSize');
var shuffleButton = document.getElementById('shuffleButton');
var shuffleRotateButton = document.getElementById('shuffleRotateButton');
var shufflePlacementButton = document.getElementById('shufflePlacementButton');
var colors = ['#808080','#FF7F7F', '#DAFF7F', '#FFD800', '#7FC9FF', '#4CFF00', '#00FFFF', '#FFA500', '#A52A2A', '#008000', '#800080', '#808080', '#800000', '#008080', '#800080', '#808000', '#000080', '#C0C0C0', '#FFD700', '#4B0082', '#FF1493'];
var puzzle;
var buttonsDisabled = false; // Variable pour suivre l'état des boutons
var selectedPieceIndex = -1;

function disableButtons() {
    buttonsDisabled = true;
    shuffleButton.disabled = true;
    shuffleRotateButton.disabled = true;
    shufflePlacementButton.disabled = true;
    sliderWidth.disabled = true;
    sliderHeight.disabled = true;
    colorListSizeSlider.disabled = true;
}

function enableButtons() {
    buttonsDisabled = false;
    shuffleButton.disabled = false;
    shuffleRotateButton.disabled = false;
    shufflePlacementButton.disabled = false;
    sliderWidth.disabled = false;
    sliderHeight.disabled = false;
    colorListSizeSlider.disabled = false;
}

function randomPositiveOrNegative() {
    return Math.random() < 0.5 ? 1 : -1;
}

function genererListePuzzle(n, m, n_colors) {
    var puzzle = [];
    for (var i = 0; i < n * m; i++) {
        puzzle.push([0, 0, 0, 0]);
    }
    for(var j = 0; j < m; j++){
        for(var i = 0; i < n-1; i++){
            var color1 = Math.floor(Math.random() * n_colors) + 1;
            var signe = randomPositiveOrNegative();
            puzzle[i + j*n][1] = signe*color1;
            puzzle[i + 1 + j*n][3] = -signe*color1;
        }
    }
    for(var j = 0; j < m-1; j++){
        for(var i = 0; i < n; i++){
            var color1 = Math.floor(Math.random() * n_colors) + 1;
            var signe = randomPositiveOrNegative();
            puzzle[i + j*n][2] = signe*color1;
            puzzle[i + (j+1)*n][0] = -signe*color1;
        }
    }
    return puzzle;
}

function remuer_piece (n, m, puzzle){
    for(var i = n*m-1; i > 0; i--){
        var j = Math.floor(Math.random() * (i+1));
        if(j != i){
            var save = puzzle[i];
            puzzle[i] = puzzle[j];
            puzzle[j] = save;
        }
    }
    for(var i = 0; i < n*m; i++){
        var k = Math.floor(Math.random() * 3);
        for(var  j = 0; j < k; j++){
            rotation(puzzle[i]);
        }
    }
}

function remuer_piece_rotation (n, m, puzzle){
    for(var i = 0; i < n*m; i++){
        var k = Math.floor(Math.random() * 3);
        for(var  j = 0; j < k; j++){
            rotation(puzzle[i]);
        }
    }
}

function remuer_piece_placement (n, m, puzzle){
    for(var i = n*m-1; i > 0; i--){
        var j = Math.floor(Math.random() * (i+1));
        if(j != i){
            var save = puzzle[i];
            puzzle[i] = puzzle[j];
            puzzle[j] = save;
        }
    }
}

function rotation(piece){
    var save = piece[3];
    piece[3] = piece[2];
    piece[2] = piece[1];
    piece[1] = piece[0];
    piece[0] = save;
}


function dessinPuzzle(puzzle, n, m, selectedPiece, shuffled) {
    var canvas = document.getElementById('myCanvas');
    const container = document.getElementById('canvas-container');

    canvas.width = Math.min(container.clientWidth, container.clientHeight);
    canvas.height = Math.min(container.clientWidth, container.clientHeight);
    var context = canvas.getContext('2d');
    var tailleCarre = Math.min(
        canvas.width / n,
        canvas.height / m
    );

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < n * m; i++) {
        var row = Math.floor(i / n);
        var col = i % n;

        var x = col * tailleCarre;
        var y = row * tailleCarre;

        var piece = puzzle[i];

        // Dessiner les triangles de la pièce
        context.fillStyle = colors[Math.abs(piece[0])];
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x + tailleCarre, y);
        context.lineTo(x + tailleCarre / 2, y + tailleCarre / 2);
        context.closePath();
        context.fill();

        context.fillStyle = colors[Math.abs(piece[1])];
        context.beginPath();
        context.moveTo(x + tailleCarre, y);
        context.lineTo(x + tailleCarre, y + tailleCarre);
        context.lineTo(x + tailleCarre / 2, y + tailleCarre / 2);
        context.closePath();
        context.fill();

        context.fillStyle = colors[Math.abs(piece[3])];
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x, y + tailleCarre);
        context.lineTo(x + tailleCarre / 2, y + tailleCarre / 2);
        context.closePath();
        context.fill();

        context.fillStyle = colors[Math.abs(piece[2])];
        context.beginPath();
        context.moveTo(x + tailleCarre, y + tailleCarre);
        context.lineTo(x, y + tailleCarre);
        context.lineTo(x + tailleCarre / 2, y + tailleCarre / 2);
        context.closePath();
        context.fill();

        // Dessiner le contour du carré
        context.strokeStyle = '#000'; // Couleur du contour
        context.strokeRect(x, y, tailleCarre, tailleCarre);

        // Dessiner les deux diagonales du carré en noir
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x + tailleCarre, y + tailleCarre);
        context.stroke();

        context.beginPath();
        context.moveTo(x + tailleCarre, y);
        context.lineTo(x, y + tailleCarre);
        context.stroke();

        // dessiner les + et -  :
        var policeSizePercentage = 0.4;
        var taillePolice = tailleCarre * policeSizePercentage;
        context.font = taillePolice + 'px Arial';
        context.fillStyle = '#000';
        if(piece[0] > 0){
            context.fillText('+', x + tailleCarre / 2 - 9*taillePolice/32, y + tailleCarre / 4 + taillePolice/4);
        }
        if(piece[0] < 0){
            context.fillText('-', x + tailleCarre / 2 - taillePolice/6, y + tailleCarre / 4 + taillePolice/10);
        }
        if(piece[1] > 0){
            context.fillText('+', x + 3*tailleCarre / 4 - taillePolice/5, y + tailleCarre/2 + 11*taillePolice/32);
        }
        if(piece[1] < 0){
            context.fillText('-', x + 3*tailleCarre / 4  - taillePolice/10, y + tailleCarre/2  + taillePolice/4);
        }
        if(piece[2] > 0){
            context.fillText('+', x + tailleCarre / 2 - 9*taillePolice/32, y + 3*tailleCarre /4 + 5*taillePolice/12);
        }
        if(piece[2] < 0){
            context.fillText('-', x + tailleCarre / 2 - taillePolice/6, y + 3*tailleCarre /4 + taillePolice/3);
        }
        if(piece[3] > 0){
            context.fillText('+', x + tailleCarre / 4 - taillePolice/3, y + tailleCarre /2 + 11*taillePolice/32);
        }
        if(piece[3] < 0){
            context.fillText('-', x + tailleCarre / 4 - taillePolice/5, y + tailleCarre /2 + taillePolice/4);
        }
        context.font = taillePolice - 12 + 'px Arial';
    }

    // Dessiner le contour de la pièce sélectionnée après avoir dessiné toutes les autres pièces
    if (selectedPiece !== -1) {
        var rowSelected = Math.floor(selectedPiece / n);
        var colSelected = selectedPiece % n;

        var xSelected = colSelected * tailleCarre;
        var ySelected = rowSelected * tailleCarre;

        context.strokeStyle = '#FFFFFF'; // Couleur du contour pour la pièce sélectionnée
        context.lineWidth = 5;
        context.strokeRect(xSelected, ySelected, tailleCarre, tailleCarre);
        context.lineWidth = 1;
    }

    if (shuffled) {
        canvas.addEventListener('click', function (event) {
            canvas.width = Math.min(container.clientWidth, container.clientHeight);
            canvas.height = Math.min(container.clientWidth, container.clientHeight);
            tailleCarre = Math.min(
                canvas.width / n,
                canvas.height / m
            );
            var rect = canvas.getBoundingClientRect();
            var clickX = event.clientX - rect.left;
            var clickY = event.clientY - rect.top;
            var clickedPiece = Math.floor(clickX / tailleCarre) + Math.floor(clickY / tailleCarre) * n;

            // Vérifier si la zone cliquée correspond à une pièce existante
            if (clickedPiece < puzzle.length) {
                if (selectedPieceIndex === -1) {
                    // Si aucune pièce n'est sélectionnée, enregistrez l'index de la pièce cliquée
                    selectedPieceIndex = clickedPiece;
                } 
                else {
                    // Si une pièce est déjà sélectionnée, échangez les deux pièces dans la liste
                    var tempPiece = puzzle[selectedPieceIndex];
                    puzzle[selectedPieceIndex] = puzzle[clickedPiece];
                    puzzle[clickedPiece] = tempPiece;
                    selectedPieceIndex = -1; // Réinitialisez la sélection de pièce
                }
                dessinPuzzle(puzzle, sliderWidth.value, sliderHeight.value, selectedPieceIndex, false);
            }
        });

        // Ajouter un gestionnaire d'événements pour détecter la touche "r" du clavier
        document.addEventListener('keydown', function (event) {
            
            if (selectedPieceIndex !== -1 && event.key === 'r') {
                rotation(puzzle[selectedPieceIndex]);
                dessinPuzzle(puzzle, sliderWidth.value, sliderHeight.value, selectedPieceIndex, false);
            }
        });
    }
}

sliderWidth.addEventListener('input', function () {
    var selectedValueWidth = sliderWidth.value;
    sliderValueDisplayWidth.textContent = selectedValueWidth;
    puzzle = genererListePuzzle(selectedValueWidth, sliderHeight.value, colorListSizeSlider.value);
    dessinPuzzle(puzzle, selectedValueWidth, sliderHeight.value, -1, false);
});

sliderHeight.addEventListener('input', function () {
    var selectedValueHeight = sliderHeight.value;
    sliderValueDisplayHeight.textContent = selectedValueHeight;
    puzzle = genererListePuzzle(sliderWidth.value, selectedValueHeight, colorListSizeSlider.value);
    dessinPuzzle(puzzle, sliderWidth.value, selectedValueHeight, -1, false);
});

colorListSizeSlider.addEventListener('input', function () {
    var selectedColorListSize = colorListSizeSlider.value;
    colorListSizeValue.textContent = selectedColorListSize;
    puzzle = genererListePuzzle(sliderWidth.value, sliderHeight.value, selectedColorListSize);
    dessinPuzzle(puzzle, sliderWidth.value, sliderHeight.value, -1, false);
});

shuffleButton.addEventListener('click', function () {
    disableButtons(); // Désactiver les boutons après le clic
    remuer_piece(sliderWidth.value, sliderHeight.value, puzzle);
    dessinPuzzle(puzzle, sliderWidth.value, sliderHeight.value, -1, true);
});

shuffleRotateButton.addEventListener('click', function () {
    disableButtons(); // Désactiver les boutons après le clic
    remuer_piece_rotation(sliderWidth.value, sliderHeight.value, puzzle);
    dessinPuzzle(puzzle, sliderWidth.value, sliderHeight.value, -1, true);
});

shufflePlacementButton.addEventListener('click', function () {
    disableButtons(); // Désactiver les boutons après le clic
    remuer_piece_placement(sliderWidth.value, sliderHeight.value, puzzle);
    dessinPuzzle(puzzle, sliderWidth.value, sliderHeight.value, -1, true);
});

var initialPuzzle = genererListePuzzle(sliderWidth.value, sliderHeight.value, colorListSizeSlider.value);
puzzle = initialPuzzle;
dessinPuzzle(initialPuzzle, sliderWidth.value, sliderHeight.value, -1, false);

var canvas = document.getElementById('myCanvas');

function resizeCanvas(){
    dessinPuzzle(puzzle, sliderWidth.value, sliderHeight.value, -1, false)
}