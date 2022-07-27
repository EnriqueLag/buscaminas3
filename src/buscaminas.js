const { ipcRenderer } = require("electron");

// Datos del tablero
_CONFIG_ROWS = 10;
_CONFIG_CELLS = 10;


// Datos del juego
_CONFIG_TOTAL_CELLS = _CONFIG_ROWS * _CONFIG_CELLS;
_CONFIG_MINES = Math.floor((_CONFIG_ROWS * _CONFIG_CELLS) / 6);

cellsUndiscovered = _CONFIG_TOTAL_CELLS - _CONFIG_MINES;

flags = _CONFIG_MINES;

locationMines = [];
selectedCell = null;

gameStarted = false;
playTime = 0;

gameStatus = "";

modalStatus = false;



console.log("Número de minas: " + _CONFIG_MINES);
console.log("Número de celdas: " + _CONFIG_TOTAL_CELLS);
console.log("Número de celdas a descubrir: " + cellsUndiscovered);

// Creación del tablero

function createBoard() {

    gameStarted ? (stopCounter(),playTime=0) : null;

    // Datos del juego
    _CONFIG_TOTAL_CELLS = _CONFIG_ROWS * _CONFIG_CELLS;
    _CONFIG_MINES = Math.floor((_CONFIG_ROWS * _CONFIG_CELLS) / 6);

    cellsUndiscovered = _CONFIG_TOTAL_CELLS - _CONFIG_MINES;

    flags = _CONFIG_MINES;

    locationMines = [];
    selectedCell = null;

    gameStarted = false;
    playTime = 0;

    gameStatus = "";

    modalStatus = false;


    table = document.querySelector("table");
    table.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    });
    thead = document.querySelector("thead");
    thead.textContent = "";
    tbody = document.querySelector("tbody");
    tbody.textContent = "";

    let displayScoreBoardCnt = document.querySelector("#scoreBoard").querySelectorAll("section")
    
    let displayMinesCnt =  displayScoreBoardCnt[0].querySelector("div");
    displayMinesCnt.textContent = "Total de 💣: " + flags;
    
    let displayTimeCnt =  displayScoreBoardCnt[1].querySelector("div");
    displayTimeCnt.textContent = "00:00";

    let cellHeadPosition = 0;
    for (let headCell = 0; headCell <= _CONFIG_CELLS; headCell++) {
        let td = document.createElement("td");
        td.textContent = headCell == 0 ? " " : cellHeadPosition++;
        thead.appendChild(td);
    }

    for (let rows = 0; rows < _CONFIG_ROWS; rows++) {
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

}

createBoard();
// Función para calcular el estado de las celdas

function cellState(event, cell) {

    // Comprobamos el estado de la celda si esta con opciones o no
    if (event) {
        cell = event.target;
        // console.warn("Ejecutando cellState mediante el evento: " + event.type);
    } else {
        // console.warn("ejecutando cellState sin evento");
    }

    let cellOptions = false;
    cell.classList.forEach(cellState => {
        if (cellState == "js-cell-options" || cellState == "js-cell-discovered") {
            cellOptions = true;

        }
    });

    if (!cellOptions) {
        // Comprobamos si el juego ha empezado
        !gameStarted ? (startCounter(), gameStarted = true) : null;

        discoverCell(cell);

        selectCell(cell);

        let minesAround = 0;

        let cellRowParentDOM = cell.parentNode;
        let cellPositionDOM = cell.cellIndex;
        let rowPositionDOM = cellRowParentDOM.rowIndex;

        let isMine = detectMine(rowPositionDOM, cellPositionDOM);

        if (isMine === false) {

            minesAround = checkMinesAround(rowPositionDOM, cellPositionDOM);

            // minesAround > 0 ? cell.textContent = minesAround : numberOfMinesAdjacent(rowPositionDOM, cellPositionDOM, minesAround);
            minesAround > 0 ? cell.textContent = minesAround : checkMinesEmpty(rowPositionDOM, cellPositionDOM, cellRowParentDOM);

        } else if (isMine === true) {
            cell.classList.add("js-cell-mine");

            finalGame("fail");


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

    // console.log("Celdas a descubrir: " + cellsUndiscovered);


    cell.removeEventListener('click', cellState);
    cell.removeEventListener('mouseup', cellOptions);

    if (cellsUndiscovered == 0 && gameStatus != "lose") {
        finalGame("win");
    }
}

function selectCell(cell) {

    if (selectedCell != null) {
        selectedCell.classList.remove("js-cell-selected");
    }
    selectedCell = cell;
    cell.classList.add("js-cell-selected");
}

function checkMinesAround(rowPositionDOM, cellPositionDOM) {
    //console.log("Ejecutando función numberOfMinesArrounCell");
    // Comprobamos la fila anterior, actual y siguiente.

    let minesAround = 0;
    let checkRows = [rowPositionDOM - 1, rowPositionDOM, rowPositionDOM + 1];

    checkRows.map((checkRow) => {

        let actualRow = checkRow; // fila actual
        let actualCell = cellPositionDOM - 1; // celda actual

        if (actualRow >= 0 && actualRow <= _CONFIG_ROWS) {

            for (let index = 0; index <= 2; index++) {

                if (actualCell >= 0 && actualCell <= _CONFIG_CELLS) {

                    if (!(actualRow == rowPositionDOM && actualCell == cellPositionDOM)) {
                        detectMine(actualRow, actualCell) ? minesAround++ : null;
                        // console.log("Fila: " + actualRow + " - Celda: " + actualCell + " - Minas: " + minesAround);
                    }
                    actualCell++;
                }

            }
        }
    });

    return minesAround;
}

function checkMinesEmpty(rowPositionDOM, cellPositionDOM, cellRowParentDOM) {
    // console.log(cellRowParentDOM)
    // console.log("Row Position: " + rowPositionDOM + " - Cell Position: " + cellPositionDOM);

    let rowList = [rowPositionDOM - 1, rowPositionDOM, rowPositionDOM + 1];
    let cellList = [cellPositionDOM - 1, cellPositionDOM, cellPositionDOM + 1];

    rowList.map((row) => {
        cellList.map((cell) => {
            if (row >= 0 && row < _CONFIG_ROWS && cell >= 1 && cell <= _CONFIG_CELLS) {
                if (!(row == rowPositionDOM && cell == cellPositionDOM)
                    && !(row == rowList[0] && (cell == cellList[0] || cell == cellList[2]))
                    && !(row == rowList[2] && (cell == cellList[0] || cell == cellList[2]))
                ) {
                    let cellDOM;
                    let rowDOM;

                    // Capturamos la fila
                    if (row == rowList[0]) {
                        rowDOM = cellRowParentDOM.previousElementSibling;
                        cellDOM = rowDOM.children[cell];
                    } else if (row == rowList[1]) {
                        rowDOM = rowPositionDOM;
                        cellDOM = cellRowParentDOM.children[cell];
                    } else if (row == rowList[2]) {
                        rowDOM = cellRowParentDOM.nextElementSibling;
                        cellDOM = rowDOM.children[cell];
                    }

                    // Comprobamos si la celda no esta descubierta
                    if (cellDOM.classList.contains("js-cell-undiscovered")) {

                        let minesArround = checkMinesAround(row, cell);
                        minesArround > 0 ? (cellDOM.textContent = minesArround, discoverCell(cellDOM)) : cellState(null, cellDOM);

                        // console.log("Fila: ", rowDOM, " - Celda: ", cellDOM, " - Minas: " + minesArround);

                    }
                }
            }
        })
    });


    // // Evaluamos si estamos dentro del tablero

    // if ( rowPositionDOM == 0 ) 
    // {
    //     console.log("Estamos en el borde superior");
    // } else if ( rowPositionDOM == _CONFIG_ROWS ){ 
    //     console.log("Estamos en el borde inferior");
    // }

    // if ( cellPositionDOM == 1 ) 
    // {
    //     console.log("Estamos en el borde izquierdo");
    // } else if ( cellPositionDOM == _CONFIG_CELLS ){
    //     console.log("Estamos en el borde derecho");
    // }

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
                // console.log("Limite de banderas? ",setFlag)
            } else {
                cell.textContent = "❓";
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

    // flags < 0 ? (flags = 0, false) : null;

    if (flags < 0) {
        flags = 0;
        return false;
    } else {
        let displayMinesCnt = document.querySelector("#scoreBoard").querySelector("section").querySelector("div");
        displayMinesCnt.textContent = "Total de 💣: " + flags;
        return true;
    }

}

function stopCounter() {
    window.clearTimeout(counter);
}

function startCounter() {

    counter = window.setInterval(() => {
        if (gameStatus != "lose") {
            playTime++;

            // Pasamos el tiempo a minutos y segundos

            let minutes = Math.floor(playTime / 60);
            minutes = minutes < 10 ? "0" + minutes : minutes;
            let seconds = playTime % 60;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            // Mostramos el tiempo en el marcador
            let displayTimeCnt = document.querySelector("#scoreBoard").querySelectorAll("section")[1].querySelector("div");
            displayTimeCnt.textContent = minutes + ":" + seconds;
        }
    }, 1000);

}

function finalGame(type) {

    stopCounter();
    if (type == "win") {
        alert("¡Has ganado! en " + playTime + " minutos");
        console.warn("¡Has ganado! en " + playTime + " segundos");
    } else {
        gameStatus = "lose";
        alert("¡Has perdido! te han faltado " + flags + " minas y " + cellsUndiscovered + " celdas");
    }

    let cells = document.querySelectorAll(".js-cell-undiscovered");
    cells.forEach((cell) => {
        let cellRowParentDOM = cell.parentNode;
        let cellPositionDOM = cell.cellIndex;
        let rowPositionDOM = cellRowParentDOM.rowIndex;
        discoverCell(cell);
        let isMine = detectMine(rowPositionDOM, cellPositionDOM);
        minesAround = checkMinesAround(rowPositionDOM, cellPositionDOM);
        isMine ? (cell.classList.add("js-cell-mine")) : minesAround > 0 ? cell.textContent = minesAround : null;

    });


}
function checkGameStatus() {
    let cntModal = document.querySelector(".js-app-modal");

    counter = window.setInterval(() => {

        ipcRenderer.send('gameStatus');
        ipcRenderer.on('gameStatus', (event, arg) => {

            gameStatus = arg[0];
            gameDifficulty = arg[1];

            function showModal() {
                gameStatus == false ? (cntModal.classList.remove('js-hidden')) : null;

                if (gameStatus == false) {
                    console.log("MEstado del modal:", modalStatus);
                    modalStatus = true;
                    cntModal.classList.remove('js-hidden');
                    gameStarted ? (stopCounter(), modalStatus = true) : null;
                } else {
                    console.log("Estado del modal:", modalStatus);
                    cntModal.classList.add('js-hidden');
                    gameStarted ? console.log("Juego iniciado") : console.log("Juego no iniciado");

                    if (modalStatus == true && gameStarted) {
                        startCounter();
                        modalStatus = false;
                    }
                }
            }

            function changeDifficulty(gameDifficulty) {
                switch (gameDifficulty) {
                    case 0:
                        break;
                    case 1:
                        _CONFIG_ROWS = 5;
                        _CONFIG_CELLS = 5;
                        createBoard();
                        ipcRenderer.send('gameDifficultyChanged');
                        break;
                    case 2:
                        _CONFIG_ROWS = 10;
                        _CONFIG_CELLS = 10;
                        createBoard();
                        ipcRenderer.send('gameDifficultyChanged');
                        break;
                    case 3:
                        _CONFIG_ROWS = 10;
                        _CONFIG_CELLS = 15;
                        createBoard();
                        ipcRenderer.send('gameDifficultyChanged');
                        break;
                }
            }

            showModal();
            changeDifficulty(gameDifficulty);
        });

    }, 1000);
}

checkGameStatus();

//TODO: Generar nuevas funciones individuales para no repetir código.