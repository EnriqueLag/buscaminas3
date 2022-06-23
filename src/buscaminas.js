// Datos del tablero
row = 18;
cell = 18

// Datos del juego
const mines = Math.floor((row * cell) / 6);
locationMines = [];
oldCell = null;

// Creación del tablero
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
console.log("localización de minas: ", locationMines);


// Función para calcular el estado de las celdas

function cellState(event) {
    // Una vez que se aga clic ya nunca se podrá volver a clicar.
    event.target.removeEventListener('click', cellState);
    console.log(locationMines);

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

    // console.log("siblingsPrevius: ", siblingsPrevius);
    // console.log("parent: ", parent);
    // console.log("siblingsNext: ",siblingsNext);

    // console.log("cIndex: ", cIndex);
    // console.log("rIndex: ", rIndex);

    let isMine = detectMine(rIndex, cIndex);
    console.log("Datos de la celda: ", rIndex, cIndex, isMine);


    if (isMine === false) {
        cell.style.backgroundColor = "rgb(250, 250, 250)";

        nearbyMines = numberOfMinesArrounCell(rIndex, cIndex, nearbyMines);

        console.log("Total de minas: ", nearbyMines);

        // Si existen minas al rededor de la celda
        // mostramos el número de minas en rojo
        // en caso contrario mostramos 0 en azul.
        if (nearbyMines > 0) {
            cell.textContent = nearbyMines;
            cell.style.color = "red";
            cell.style.fontWeight = "bold";
        } else {
            console.log("No hay minas alrededor");
            // Evaluamos las celdas adyacentes
            numberOfMinesAdjacent(rIndex, cIndex, nearbyMines)
        }

    } else if (isMine === true) {
        console.log("¡Has perdido!");
        cell.style.backgroundColor = "red";
        cell.style.border = "inherit";
        cell.textContent = "💣";
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
            console.log("Mina localizada en: ", mine);
        }
    });
    return isMine;
}


function numberOfMinesArrounCell(rIndex, cIndex, nearbyMines) {
    // Comprobamos la fila anterior, actual y siguiente.
    let checkRows = [rIndex - 1, rIndex, rIndex + 1];

    for (checkRow in checkRows) {

        let actualRow = checkRows[checkRow]; // fila actual
        let actualCell = cIndex - 1; // celda actual

        console.log("Evaluando fila: ", actualRow);

        for (let index = 0; index <= 2; index++) {

            console.log("Evaluando la celda: ", actualRow, actualCell);

            // Evitamos que se evalué la celda a la que hemos echo click
            if (!(actualRow == rIndex && actualCell == cIndex)) {
                detectMine(actualRow, actualCell) ? nearbyMines++ : null;
            }
            actualCell++;
        }

        console.log("Minas alrededor: ", nearbyMines);

    }
    return nearbyMines;
}

function numberOfMinesAdjacent(rIndex, cIndex) {
    let checkRows = [rIndex - 1, rIndex, rIndex + 1];

    let superiorRow = checkRows[0];
    let actualRow = checkRows[1];
    let inferiorRow = checkRows[2];

    let checkCells = [cIndex - 1, cIndex, cIndex + 1];
    let leftCell = checkCells[0];
    let actualCell = checkCells[1];
    let rightCell = checkCells[2];

    // Comprobamos las celda superior
    let superiorCellMines = numberOfMinesArrounCell(superiorRow, actualCell,0);
    // Si no hay minas al rededor de la celda subyacente 
    // Despejamos la celda

    // Comprobamos la celda izquierda y derecha
    let leftCellMines = numberOfMinesArrounCell(actualRow, leftCell, 0);
    let rightCellMines = numberOfMinesArrounCell(actualRow, rightCell, 0);

    // Comprobamos la celda inferior
    let inferiorCellMines = numberOfMinesArrounCell(inferiorRow, actualCell, 0);

    console.log("---------------------");
    console.log("Minas en las celdas adyacentes de ", checkRows[1], cIndex);
    console.log("Minas en la celda superior: ", [superiorRow, actualCell] , superiorCellMines);
    console.log("Minas en la celda izquierda: ",[actualRow, leftCell] , leftCellMines);
    console.log("Minas en la celda derecha: ",[actualRow, rightCell] , rightCellMines);
    console.log("Minas en la celda inferior: ",[inferiorRow, actualCell] , inferiorCellMines);
   

    // Capturamos las filas y celdas del tablero
    let tbody = document.querySelector("tbody");
    let rows = tbody.querySelectorAll("tr");
    console.log("rows: ", rows);
    let boardRows = [rows[superiorRow], rows[actualRow], rows[inferiorRow]];

    let boardSuperiorCell = boardRows[0].querySelectorAll("td")[actualCell];
    if(superiorCellMines > 0) {
        boardSuperiorCell.textContent = superiorCellMines;
        boardSuperiorCell.style.color = "red";
        boardSuperiorCell.style.fontWeight = "bold";
    }else {
        console.log("------------");
        console.log(superiorRow, actualCell)
        numberOfMinesAdjacent(superiorRow, actualCell)
    }
    boardSuperiorCell.style.backgroundColor = "rgb(250, 250, 250)";
    
    let boardLeftCell = boardRows[1].querySelectorAll("td")[leftCell];
    if(leftCellMines > 0) {
        boardLeftCell.textContent = leftCellMines;
        boardLeftCell.style.color = "red";
        boardLeftCell.style.fontWeight = "bold";
    } else {
        console.log("------------");
        console.log(actualRow, leftCell)
        numberOfMinesAdjacent(actualRow, leftCell)
    }
    boardLeftCell.style.backgroundColor = "rgb(250, 250, 250)";
    
    let boardRightCells = boardRows[1].querySelectorAll("td")[rightCell];
    if(rightCellMines > 0) {
        boardRightCells.textContent = rightCellMines;
        boardRightCells.style.color = "red";
        boardRightCells.style.fontWeight = "bold";
    }
    boardRightCells.style.backgroundColor = "rgb(250, 250, 250)";

    let boardInferiorCells = boardRows[2].querySelectorAll("td")[actualCell];
    if(inferiorCellMines > 0) {
        boardInferiorCells.textContent = inferiorCellMines;
        boardInferiorCells.style.color = "red";
        boardInferiorCells.style.fontWeight = "bold";
    }
    boardInferiorCells.style.backgroundColor = "rgb(250, 250, 250)";

    console.log("Filas a evaluar: ", boardRows);

    // TODO: Evitar que siga calculando las celdas que no existen
    // TODO: Evitar que se pueda hacer click en las celdas que ya están despejadas
    // TODO: Pasar la función a ciclos;
}