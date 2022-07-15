// Datos del tablero
row = 18;
cell = 18;

// Datos del juego
const mines = Math.floor((row * cell) / 6);
locationMines = [];
oldCell = null;

// Creación del tablero
table = document.querySelector("table");
table.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});
thead = document.querySelector("thead");
tbody = document.querySelector("tbody");

for (let headCell = 0; headCell <= cell; headCell++) {
    let td = document.createElement("td");
    td.textContent = headCell == 0 ? " " : headCell;
    thead.appendChild(td);
}

for (let rows = 0; rows <= row; rows++) {
    let tr = document.createElement('tr');

    for (let cells = 0; cells <= cell; cells++) {
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

for (let index = 0; index < mines; index++) {

    let mRow = Math.floor(Math.random() * row);
    let mCell = Math.floor(Math.random() * cell);

    // Si la posición es 0, ajustamos la posición
    mCell == 0 ? mCell = 1 : mCell;

    // Comprobamos si existe una mina en la posición
    // en el caso de que sea así, recalculamos la posición
    locationMines.forEach(function (mine) {
        if (mine[0] === mRow && mine[1] === mCell) {
            mRow = Math.floor(Math.random() * row);
            mCell = Math.floor(Math.random() * cell);
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

        // Comprobamos si había una celda pulsada anteriormente
        if (oldCell != null) {
            oldCell.classList.remove("js-cell-selected");
        }
        // Una vez que se aga clic ya nunca se podrá volver a hacer clic.

        cell.removeEventListener('click', cellState);

        // Variables de la celda
        let nearbyMines = 0;

        oldCell = event.target;

        // Asignamos un color al borde de la celda seleccionada
        cell.classList.add("js-cell-selected");

        // Obtenemos la fila actual, previa y siguiente
        let parent = event.target.parentNode;
        // let siblingsPrevius = parent.previousElementSibling;
        // let siblingsNext = parent.nextElementSibling;

        // obtenemos su posición de celda respecto a su fila
        let cIndex = event.target.cellIndex;
        let rIndex = parent.rowIndex;

        let isMine = detectMine(rIndex, cIndex);

        if (isMine === false) {
            cell.classList.remove("js-cell-undiscovered");
            cell.classList.add("js-cell-discovered");
            nearbyMines = numberOfMinesAroundCell(rIndex, cIndex, nearbyMines);

            // Si existen minas al rededor de la celda
            // mostramos el número de minas en rojo
            // en caso contrario mostramos 0 en azul.
            if (nearbyMines > 0) {
                cell.textContent = nearbyMines;

            } else {

                // Evaluamos las celdas adyacentes
                numberOfMinesAdjacent(rIndex, cIndex, nearbyMines)
            }

        } else if (isMine === true) {
            cell.classList.add("js-cell-mine");

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

function numberOfMinesAroundCell(rIndex, cIndex, nearbyMines) {
    console.log("Ejecutando función numberOfMinesArrounCell");
    // Comprobamos la fila anterior, actual y siguiente.
    let checkRows = [rIndex - 1, rIndex, rIndex + 1];

    for (checkRow in checkRows) {

        let actualRow = checkRows[checkRow]; // fila actual
        let actualCell = cIndex - 1; // celda actual

        if (actualRow >= 0 && actualRow < row) {
            for (let index = 0; index <= 2; index++) {

                if (actualCell >= 0 && actualCell < cell) {

                    if (!(actualRow == rIndex && actualCell == cIndex)) {
                        detectMine(actualRow, actualCell) ? nearbyMines++ : null;
                    }
                    actualCell++;
                }

            }
        }

    }
    return nearbyMines;
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

        if (checkRows[rIndex] >= 0 && checkRows[rIndex] <= row) {

            // recorremos las celdas
            for (let cIndex = 0; cIndex < 3; cIndex++) {

                if (checkCells[cIndex] > 0 && checkCells[cIndex] <= cell) {

                    let actualRow = checkRows[rIndex];
                    let actualCell = checkCells[cIndex];

                    let results = numberOfMinesAroundCell(actualRow, actualCell, 0);

                    // Evaluando las celdas superior, inferior, izquierda y derecha
                    // Comprobamos celdas izquierda y derecha

                    console.log("Evaluando celda: ", actualRow, actualCell);

                    rIndex == 0 && cIndex == 1 ? minesDetect.superiorRow = [results, actualRow, actualCell] : rIndex == 2 && cIndex == 1 ? minesDetect.inferiorRow = [results, actualRow, actualCell] : null;
                    rIndex == 1 && cIndex == 0 ? minesDetect.leftCell = [results, actualRow, actualCell] : rIndex == 1 && cIndex == 2 ? minesDetect.rightCell = [results, actualRow, actualCell] : null;
                }

            }
        }

    }
    console.log("Total de evaluaciones: ", minesDetect);

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
    }

    // TODO: Pasar la función a ciclos;
    // TODO: Averiguar porque al ejecutar el descubrimiento de las celdas, el eje puesto entra en un bucle infinito.
    // TODO: Ejemplo : Descubrir hacia la arriba y hacia la izquierda, arriba y derecha, abajo izquierda y derecha.
    // TODO: pero al  hacer ariba y abajo o izquierda y derecha, entra en bucle infinito.
}

function cellOptions(event) {

    let cell = event.target;
    cellContent = cell.textContent;

    // comprobamos si es el botón derecho
    if (event.button == 2) {

        if (cellContent == "" && cell.classList[0] == "js-cell-undiscovered") {
            cell.classList.add("js-cell-options");
            cell.textContent = "🚩";

        } else if (cellContent == "🚩") {
            cell.textContent = "❓";

        } else if (cellContent == "❓") {
            cell.textContent = "";
            cell.classList.remove("js-cell-options");
        }
    }
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
