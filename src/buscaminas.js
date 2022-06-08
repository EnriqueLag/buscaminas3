// Datos del tablero
const row = 18;   
const cell = 18
 
// Datos del juego
const mines = Math.floor((row * cell) / 6);
locationMines = [];


// Creación del tablero
thead = document.querySelector("thead");
tbody = document.querySelector("tbody");

for (let headCell = 0; headCell <= cell; headCell++) {
    let td = document.createElement("td");
    td.textContent = headCell;

    thead.appendChild(td);
}

for (let rows = 1; rows <= row; rows++) {
    let tr = document.createElement('tr');

    for (let cells = 0; cells <= cell; cells++) {
        let td = document.createElement('td');

        if (cells == 0 ) {
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

    let mRow = Math.floor(Math.random() * row );
    let mCell = Math.floor(Math.random() * cell);

    // Si la posición es 0, recalcábamos la posición
    mCell == 0 ? mCell = 1 : mCell;

    locationMines.push([mRow, mCell]);
}
console.log("localización de minas: ",locationMines);


// Función para calcular el estado de las celdas

function cellState(event) {

    // Obtenemos la fila actual, previa y siguiente
    let parent = event.target.parentNode;
    let siblingsPrevius = parent.previousElementSibling;
    let siblingsNext = parent.nextElementSibling;

    // obtenemos su posición de celda respecto a su fila
    let cIndex = event.target.cellIndex;
    let rIndex = parent.rowIndex;

    // console.log("siblingsPrevius: ", siblingsPrevius);
    // console.log("parent: ", parent);
    // console.log("siblingsNext: ",siblingsNext);

    // console.log("cIndex: ", cIndex);
    // console.log("rIndex: ", rIndex);

    isMine = false;
    // Comprobamos que la celda actual no sea una mina
    locationMines.forEach(function(mine) {
        if (mine[0] == rIndex && mine[1] == cIndex) {
            event.target.style.backgroundColor = "red";
            event.target.textContent = "💣";
            alert("Has perdido");
            isFinite = true;
        } 
    }); 

    isMine == true ? console.log("¡Has perdido!") : console.log("Puedes continuar");
    
    
}

// function addMines(locationMines) {
//     let rows = document.querySelectorAll('tr');

//     locationMines.forEach(mine => {
//         let td = rows[mine[0]].querySelectorAll('td')[mine[1]];
//         td.textContent = "💣";
//     });
    
// }

