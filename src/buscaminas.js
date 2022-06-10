// Datos del tablero
const row = 18;
const cell = 18

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

    let isMine = detectMines(rIndex, cIndex);
    console.log("Datos de la celda: ", rIndex, cIndex, isMine);

    /*  
        Si no hay ninguna mina descubrimos la celda
        Y comprobamos las minas de alrededor
        de lo contrario mostramos la mina y finalizamos el juego.
    */

    if (isMine === false) {
        cell.style.backgroundColor = "rgb(250, 250, 250)";

        // Comprobamos la fila anterior, actual y siguiente.
        let checkRows = [rIndex - 1, rIndex, rIndex + 1];

        for (checkRow in checkRows) {

            let actualRow = checkRows[checkRow];
            let actualCell = cIndex - 1;
            console.log("Evaluando fila: ", actualRow);

            for (let index = 0; index <= 2; index++) {

                console.log("Evaluando la celda: ", actualRow, actualCell);

                if (!(actualRow == rIndex && actualCell == cIndex)) {
                    detectMines(actualRow, actualCell) ? nearbyMines++ : null;
                }
                actualCell++;
            }

            console.log("Minas alrededor: ", nearbyMines);
        }

        console.log("Total de minas: ", nearbyMines);

        // Si existen minas al rededor de la celda
        // mostramos el número de minas en rojo
        // en caso contrario mostramos 0 en azul.
        if (nearbyMines > 0) {
            cell.textContent = nearbyMines;
            cell.style.color = "red";
            cell.style.fontWeight = "bold";
        }

    } else if (isMine === true) {
        console.log("¡Has perdido!");
        cell.style.backgroundColor = "red";
        cell.style.border = "inherit";
        cell.textContent = "💣";
        alert("Has perdido");
    }
}

function detectMines(row, cell) {
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