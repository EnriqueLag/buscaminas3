// Datos del tablero
row = 18;
cell = 18

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
            td.style.cursor = "pointer"
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
// // console.log("localización de minas: ", locationMines);


// Función para calcular el estado de las celdas

function cellState(event) {
    // Una vez que se aga clic ya nunca se podrá volver a clicar.
    event.target.removeEventListener('click', cellState);
    // // console.log(locationMines);

    // Comprobamos si había una celda pulsada anteriormente
    if (oldCell != null) {
        oldCell.style.border = "inherit";
    }
    // Variables de la celda
    let nearbyMines = 0;
    let cell = event.target;
    oldCell = event.target;

    // Asignamos un color al borde de la celda seleccionada
    cell.style.border = "1px solid green";

    // Obtenemos la fila actual, previa y siguiente
    let parent = event.target.parentNode;
    // let siblingsPrevius = parent.previousElementSibling;
    // let siblingsNext = parent.nextElementSibling;

    // obtenemos su posición de celda respecto a su fila
    let cIndex = event.target.cellIndex;
    let rIndex = parent.rowIndex;

    // // // console.log("siblingsPrevius: ", siblingsPrevius);
    // // // console.log("parent: ", parent);
    // // // console.log("siblingsNext: ",siblingsNext);

    // // // console.log("cIndex: ", cIndex);
    // // // console.log("rIndex: ", rIndex);

    let isMine = detectMine(rIndex, cIndex);
    // // console.log("Datos de la celda: ", rIndex, cIndex, isMine);


    if (isMine === false) {
        cell.style.backgroundColor = "rgb(250, 250, 250)";

        nearbyMines = numberOfMinesArrounCell(rIndex, cIndex, nearbyMines);

        // // console.log("Total de minas: ", nearbyMines);

        // Si existen minas al rededor de la celda
        // mostramos el número de minas en rojo
        // en caso contrario mostramos 0 en azul.
        if (nearbyMines > 0) {
            cell.textContent = nearbyMines;

            cell.classList.remove('js-cell-undiscovered');
            cell.classList.add('js-cell-discovered');
        } else {
            // // console.log("No hay minas alrededor");
            // Evaluamos las celdas adyacentes

            numberOfMinesAdjacent(rIndex, cIndex, nearbyMines)
        }

    } else if (isMine === true) {
        // // console.log("¡Has perdido!");
        cell.style.backgroundColor = "red";
        cell.style.border = "inherit";
        cell.textContent = "💣";
        console.warn("¡Has perdido!");
        alert("Has perdido");
    }
    //  gym + paseo ? cansado++ : feliz;
}


function detectMine(row, cell) {
    let isMine = false;
    // Comprobamos que la celda actual no sea una mina
    locationMines.forEach(function (mine) {
        if (mine[0] === row && mine[1] === cell) {
            isMine = true;
            // // console.log("Mina localizada en: ", mine);
        }
    });
    return isMine;
}

function numberOfMinesArrounCell(rIndex, cIndex, nearbyMines) {
    console.log("Ejecutando función numberOfMinesArrounCell");
    // Comprobamos la fila anterior, actual y siguiente.
    let checkRows = [rIndex - 1, rIndex, rIndex + 1];

    for (checkRow in checkRows) {


        let actualRow = checkRows[checkRow]; // fila actual
        let actualCell = cIndex - 1; // celda actual

        // console.log("Evaluando fila: ", actualRow);

        if (actualRow >= 0 && actualRow < row) {
            for (let index = 0; index <= 2; index++) {

                if (actualCell >= 0 && actualCell < cell) {

                    // console.log("Evaluando la celda: ", actualRow, actualCell);

                    if (!(actualRow == rIndex && actualCell == cIndex)) {
                        detectMine(actualRow, actualCell) ? nearbyMines++ : null;
                    }
                    actualCell++;
                }

            }
        }



        // // console.log("Minas alrededor: ", nearbyMines);

    }
    return nearbyMines;
}

function numberOfMinesAdjacent(rIndex, cIndex) {
    console.log("Ejecutando función numberOfMinesAdjacent");
    let checkRows = [rIndex - 1, rIndex, rIndex + 1];

    let checkCells = [cIndex - 1, cIndex, cIndex + 1];

    // let superiorRow = checkRows[0];
    // let actualRow = checkRows[1];
    // let inferiorRow = checkRows[2];

    // let leftCell = checkCells[0];
    // let actualCell = checkCells[1];
    // let rightCell = checkCells[2];

    // // Comprobamos las celda superior
    // let superiorCellMines = numberOfMinesArrounCell(superiorRow, actualCell, 0);
    // // Si no hay minas al rededor de la celda subyacente 
    // // Despejamos la celda

    // // Comprobamos la celda izquierda y derecha
    // let leftCellMines = numberOfMinesArrounCell(actualRow, leftCell, 0);
    // let rightCellMines = numberOfMinesArrounCell(actualRow, rightCell, 0);

    // // Comprobamos la celda inferior
    // let inferiorCellMines = numberOfMinesArrounCell(inferiorRow, actualCell, 0);

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

                    let results = numberOfMinesArrounCell(actualRow, actualCell, 0);

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
    // // // console.log("rows: ", rows);

    cellsEmpty = [];

    if (minesDetect.superiorRow != null) {
        boardSuperiorCell = rows[minesDetect.superiorRow[1]].querySelectorAll("td")[minesDetect.superiorRow[2]];
        boardSuperiorCell.style.backgroundColor = "rgb(252, 252, 252)";
        boardSuperiorCell.style.fontWeight = "bold";
        boardSuperiorCell.style.color = "red";
        boardSuperiorCell.style.border = "none";
        boardSuperiorCell.style.cursor = "initial";

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
        boardInferiorCell.style.backgroundColor = "rgb(252, 252, 252)";
        boardInferiorCell.style.fontWeight = "bold";
        boardInferiorCell.style.color = "red";
        boardInferiorCell.style.border = "none";
        boardInferiorCell.style.cursor = "initial";

        boardInferiorCell.removeEventListener("click", cellState);


        if (minesDetect.inferiorRow[0] > 0) {
            boardInferiorCell.textContent = minesDetect.inferiorRow[0];
        } else {
            cellsEmpty.push([minesDetect.inferiorRow[1], minesDetect.inferiorRow[2]]);
        }
    }
    if (minesDetect.leftCell != null) {
        boardSelectedLeftCell = rows[minesDetect.leftCell[1]].querySelectorAll("td")[minesDetect.leftCell[2]];
        boardSelectedLeftCell.style.backgroundColor = "rgb(252, 252, 252)";
        boardSelectedLeftCell.style.fontWeight = "bold";
        boardSelectedLeftCell.style.color = "red";
        boardSelectedLeftCell.style.border = "none";
        boardSelectedLeftCell.style.cursor = "initial";

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
        boardSelectedRightCell.style.backgroundColor = "rgb(252, 252, 252)";
        boardSelectedRightCell.style.fontWeight = "bold";
        boardSelectedRightCell.style.color = "red";
        boardSelectedRightCell.style.border = "none";
        boardSelectedRightCell.style.cursor = "initial";

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

    console.log(event)
    let cell = event.target;
    cellContent = cell.textContent;
    
    // comprobamos si es el botón derecho
    if (event.button == 2) {

        if(cellContent == "" && cell.classList[0] == "td.js-cell-undiscovered" )  {
            cell.textContent = "🚩";
            
        } else if (cellContent == "🚩") {
            cell.textContent = "❓";

        } else if (cellContent == "❓") {
            cell.textContent = "";
            
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
