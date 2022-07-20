// Datos del tablero
const _CONFIG_ROWS = 18;
const _CONFIG_CELLS = 18;

// Datos del juego
const _CONFIG_TOTAL_CELLS = _CONFIG_ROWS * _CONFIG_CELLS;
const _CONFIG_MINES = Math.floor((_CONFIG_ROWS * _CONFIG_CELLS) / 6);

cellsUndiscovered = _CONFIG_TOTAL_CELLS - _CONFIG_MINES;

flags = _CONFIG_MINES;

locationMines = [];
selectedCell = null;

gameStarted = false;
playTime = 0;


console.log("Número de minas: " + _CONFIG_MINES);
console.log("Número de celdas: " + _CONFIG_TOTAL_CELLS);
console.log("Número de celdas a descubrir: " + cellsUndiscovered);

// Creación del tablero
table = document.querySelector("table");
table.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});
thead = document.querySelector("thead");
tbody = document.querySelector("tbody");


let displayMinesCnt = document.querySelector("#scoreBoard").querySelector("section").querySelector("div");
displayMinesCnt.textContent = "Total de 💣: " + flags;


for (let headCell = 0; headCell <= _CONFIG_CELLS; headCell++) {
    let td = document.createElement("td");
    td.textContent = headCell == 0 ? " " : headCell;
    thead.appendChild(td);
}

for (let rows = 0; rows <= _CONFIG_ROWS; rows++) {
    let tr = document.createElement('tr');

    for (let cells = 0; cells <= _CONFIG_CELLS; cells++) {
        let td = document.createElement('td');

        if (cells == 0) {
            td.textContent = rows;
        } else {
            td.addEventListener('click', cellState);
            td.addEventListener('mouseup', cellOptions);
            td.classList.add('js-cell-undiscovered');
        }

        tr.append(td);
    }

    tbody.append(tr);
}

// Creación de minas

for (let index = 0; index < _CONFIG_MINES; index++) {

    let mRow = Math.floor(Math.random() * _CONFIG_ROWS);
    let mCell = Math.floor(Math.random() * _CONFIG_CELLS);

    // Si la posición es 0, ajustamos la posición
    mCell == 0 ? mCell = 1 : mCell;

    // Comprobamos si existe una mina en la posición
    // en el caso de que sea así, recalculamos la posición
    locationMines.forEach(function (mine) {
        if (mine[0] === mRow && mine[1] === mCell) {
            mRow = Math.floor(Math.random() * _CONFIG_ROWS);
            mCell = Math.floor(Math.random() * _CONFIG_CELLS);
        }
    });
    locationMines.push([mRow, mCell]);
}

// Función para calcular el estado de las celdas

function cellState(event) {

    // Comprobamos el estado de la celda si esta con opciones o no
    let cell = event.target;
    let cellOptions = false;
    cell.classList.forEach(cellState => {
        if (cellState == "js-cell-options") {
            cellOptions = true;
        }
    });

    if (!cellOptions) {

        // Comprobamos si el juego ha empezado
        !gameStarted ? (startCounter(), gameStarted = true) : null;

        discoverCell(cell);

        selectCell(cell);

        let minesAround = 0;

        let cellDOMparent = cell.parentNode;
        let cellPositionDOM = cell.cellIndex;
        let rowPositionDOM = cellDOMparent.rowIndex;

        let isMine = detectMine(rowPositionDOM, cellPositionDOM);

        if (isMine === false) {

            minesAround = numberOfMinesAroundCell(rowPositionDOM, cellPositionDOM);

            minesAround > 0 ? cell.textContent = minesAround : numberOfMinesAdjacent(rowPositionDOM, cellPositionDOM, minesAround);

        } else if (isMine === true) {
            cell.classList.add("js-cell-mine");
            stopCounter();
            console.warn("¡Has perdido!");
            alert("Has perdido");
        }
        //  gym + paseo ? cansado++ : feliz;
    }
}

function detectMine(row, cell) {
    let isMine = false;
    // Comprobamos que la celda actual no sea una mina
    locationMines.forEach(function (mine) {
        if (mine[0] === row && mine[1] === cell) {
            isMine = true;
        }
    });
    return isMine;
}

function discoverCell(cell) {
    cell.classList.remove("js-cell-undiscovered");
    cell.classList.add("js-cell-discovered");

    // Quitamos una celda al total de celdas a descubrir
    cellsUndiscovered--;
    console.log("Celdas a descubrir: " + cellsUndiscovered);


    cell.removeEventListener('click', cellState);
    cell.removeEventListener('mouseup', cellOptions);
}

function selectCell(cell) {

    if (selectedCell != null) {
        selectedCell.classList.remove("js-cell-selected");
    }
    selectedCell = cell;
    cell.classList.add("js-cell-selected");
}

function numberOfMinesAroundCell(rowPositionDOM, cellPositionDOM) {
    //console.log("Ejecutando función numberOfMinesArrounCell");
    // Comprobamos la fila anterior, actual y siguiente.

    let minesAround = 0;
    let checkRows = [rowPositionDOM - 1, rowPositionDOM, rowPositionDOM + 1];

    checkRows.map( (checkRow) => {
        
        let actualRow = checkRow; // fila actual
        let actualCell = cellPositionDOM - 1; // celda actual

        if (actualRow >= 0 && actualRow < _CONFIG_ROWS) {

            for (let index = 0; index <= 2; index++) {

                if (actualCell >= 0 && actualCell < _CONFIG_CELLS) {

                    if (!(actualRow == rowPositionDOM && actualCell == cellPositionDOM)) {
                        detectMine(actualRow, actualCell) ? minesAround++ : null;
                    }
                    actualCell++;
                }

            }
        }
    });

    return minesAround;
}

function numberOfMinesAdjacent(rIndex, cIndex) {
    console.log("Ejecutando función numberOfMinesAdjacent");
    let checkRows = [rIndex - 1, rIndex, rIndex + 1];

    let checkCells = [cIndex - 1, cIndex, cIndex + 1];

    let minesDetect = {
        superiorRow: null,
        inferiorRow: null,
        leftCell: null,
        rightCell: null
    };

    // recorremos las filas
    for (let rIndex = 0; rIndex < 3; rIndex++) {

        if (checkRows[rIndex] >= 0 && checkRows[rIndex] <= _CONFIG_ROWS) {

            // recorremos las celdas
            for (let cIndex = 0; cIndex < 3; cIndex++) {

                if (checkCells[cIndex] > 0 && checkCells[cIndex] <= _CONFIG_CELLS) {

                    let actualRow = checkRows[rIndex];
                    let actualCell = checkCells[cIndex];

                    let results = numberOfMinesAroundCell(actualRow, actualCell, 0);

                    // Evaluando las celdas superior, inferior, izquierda y derecha
                    // Comprobamos celdas izquierda y derecha

                    // console.log("Evaluando celda: ", actualRow, actualCell);

                    rIndex == 0 && cIndex == 1 ? minesDetect.superiorRow = [results, actualRow, actualCell] : rIndex == 2 && cIndex == 1 ? minesDetect.inferiorRow = [results, actualRow, actualCell] : null;
                    rIndex == 1 && cIndex == 0 ? minesDetect.leftCell = [results, actualRow, actualCell] : rIndex == 1 && cIndex == 2 ? minesDetect.rightCell = [results, actualRow, actualCell] : null;
                }

            }
        }

    }
    // console.log("Total de evaluaciones: ", minesDetect);

    // comprobamos si el valor del objeto es null
    // si es null, estamos llamando a una celda inexistente.

    // Capturamos las filas y celdas del tablero
    let tbody = document.querySelector("tbody");
    let rows = tbody.querySelectorAll("tr");

    cellsEmpty = [];

    if (minesDetect.superiorRow != null) {
        boardSuperiorCell = rows[minesDetect.superiorRow[1]].querySelectorAll("td")[minesDetect.superiorRow[2]];
        boardSuperiorCell.classList.remove("js-cell-undiscovered");
        boardSuperiorCell.classList.add("js-cell-discovered");

        boardSuperiorCell.removeEventListener("click", cellState);

        if (minesDetect.superiorRow[0] > 0) {
            boardSuperiorCell.textContent = minesDetect.superiorRow[0];
 
        } else {
            numberOfMinesAdjacent(minesDetect.superiorRow[1], minesDetect.superiorRow[2]);
            cellsEmpty.push([minesDetect.superiorRow[1], minesDetect.superiorRow[2]]);
        }
        // Quitamos una celda a descubrir

        console.log("Celdas a descubrir: " + cellsUndiscovered);
    }
    if (minesDetect.inferiorRow != null) {
        boardInferiorCell = rows[minesDetect.inferiorRow[1]].querySelectorAll("td")[minesDetect.inferiorRow[2]];
        boardInferiorCell.classList.remove("js-cell-undiscovered");
        boardInferiorCell.classList.add("js-cell-discovered");

        boardInferiorCell.removeEventListener("click", cellState);

        if (minesDetect.inferiorRow[0] > 0) {
            boardInferiorCell.textContent = minesDetect.inferiorRow[0];
 
        } else {
            cellsEmpty.push([minesDetect.inferiorRow[1], minesDetect.inferiorRow[2]]);
        }
        // Quitamos una celda a descubrir

        console.log("Celdas a descubrir: " + cellsUndiscovered);
    }
    if (minesDetect.leftCell != null) {
        boardSelectedLeftCell = rows[minesDetect.leftCell[1]].querySelectorAll("td")[minesDetect.leftCell[2]];
        boardSelectedLeftCell.classList.remove("js-cell-undiscovered");
        boardSelectedLeftCell.classList.add("js-cell-discovered");

        boardSelectedLeftCell.removeEventListener("click", cellState);

        if (minesDetect.leftCell[0] > 0) {
            boardSelectedLeftCell.textContent = minesDetect.leftCell[0];
    
        } else {
            cellsEmpty.push([minesDetect.leftCell[1], minesDetect.leftCell[2]]);
            numberOfMinesAdjacent(minesDetect.leftCell[1], minesDetect.leftCell[2]);
        }
        // Quitamos una celda a descubrir
        console.log("Celdas a descubrir: " + cellsUndiscovered);
    }
    if (minesDetect.rightCell != null) {
        boardSelectedRightCell = rows[minesDetect.rightCell[1]].querySelectorAll("td")[minesDetect.rightCell[2]];
        boardSelectedRightCell.classList.remove("js-cell-undiscovered");
        boardSelectedRightCell.classList.add("js-cell-discovered");

        boardSelectedRightCell.removeEventListener("click", cellState);

        if (minesDetect.rightCell[0] > 0) {
            boardSelectedRightCell.textContent = minesDetect.rightCell[0];
      
        } else {
            cellsEmpty.push([minesDetect.rightCell[1], minesDetect.rightCell[2]]);
            // numberOfMinesAdjacent(minesDetect.rightCell[1], minesDetect.rightCell[2]);
        }
        // Quitamos una celda a descubrir

        console.log("Celdas a descubrir: " + cellsUndiscovered);
    }

    // TODO: Pasar la función a ciclos;

    // TODO: Averiguar porque al ejecutar el descubrimiento de las celdas, el eje puesto entra en un bucle infinito.
    // TODO: Ejemplo: Descubrir hacia la arriba y hacia la izquierda, arriba y derecha, abajo izquierda y derecha.
    // TODO: pero al  hacer arriba y abajo o izquierda y derecha, entra en bucle infinito.
}

function cellOptions(event) {

    let cell = event.target;
    cellContent = cell.textContent;

    // comprobamos si es el botón derecho
    if (event.button == 2) {

        if (cellContent == "" && cell.classList[0] == "js-cell-undiscovered") {

            let setFlag = calculateFlags(false);
            if (setFlag) {
                cell.classList.add("js-cell-options");
                cell.textContent = "🚩";
            }
        } else if (cellContent == "🚩") {
            calculateFlags(true);
            cell.textContent = "❓";

        } else if (cellContent == "❓") {
            cell.textContent = "";
            cell.classList.remove("js-cell-options");
        }
    }
}

function calculateFlags(add) {

    add ? flags++ : flags--;

    // if ( flags < 0 ) { 
    //     flags = 0;
    //     return false; 
    // }

    flags < 0 ? (flags = 0, false) : null;

    let displayMinesCnt = document.querySelector("#scoreBoard").querySelector("section").querySelector("div");
    displayMinesCnt.textContent = "Total de 💣: " + flags;
    return true;
}

function stopCounter() {
    window.clearTimeout(counter);
}

function startCounter() {

    counter = window.setInterval(() => {
        playTime++;

        // Pasamos el tiempo a minutos y segundos

        let minutes = Math.floor(playTime / 60);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        let seconds = playTime % 60;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        // Mostramos el tiempo en el marcador
        let displayTimeCnt = document.querySelector("#scoreBoard").querySelectorAll("section")[1].querySelector("div");
        displayTimeCnt.textContent = minutes + ":" + seconds;

    }, 1000);

}



/*
let state = 0;
let strings = ["", "F", "?"];
let len = strings.length;

for(let i = 0; i < 10; i++) {
  let index = state++ % len;
  if(state === len) state = 0;
  console.log(strings[index]);
}

*/
