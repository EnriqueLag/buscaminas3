const { BrowserWindow } = require('electron')
function createModal(page) {

    const child = new BrowserWindow(
        {
            height: 300,
            width: 400,
            parent: win,
            modal: false,
            show: true,
            resizable: false,
            center: true,
            alwaysOnTop: true,
        });

    switch (page) {
        case "about":
            page = "./src/templates/about.html";
            break;
        case "score":
            page = "./src/templates/score.html";
            break;
    }

    child.loadFile(page);
    child.removeMenu();
    gameStatus = false;
    child.once('ready-to-show', () => {

        child.show();
    });

    child.on('closed', () => {
        gameStatus = true;
    });

}
function changeDifficulty(level){
    gameDifficulty = level;
}

const template = [
    // { role: 'appMenu' }

    // { role: 'fileMenu' }
    {
        label: 'Juego',
        submenu: [
            { label: 'Nueva partida', role: 'reload' },
            { label: 'Salir', role: 'quit' }
        ]

    },
    {
        label: 'Dificultad',
        submenu: [

            {
                label: 'Fácil', click: () => {
                    changeDifficulty(1);
                }
            },
            {
                label: 'Normal',
                click: () => {
                    changeDifficulty(2);
                }
            },
            {
                label: 'Difícil', click: () => {
                    changeDifficulty(3);
                }
            },
        ]
    },
    {
        label: "Puntuaciones",
        click: () => {
            createModal("score");
        }
    },
    {
        label: 'Acerca de',
        submenu: [
            {
                label: 'Acerca de',
                click() {
                    createModal("about");
                }
            }
        ]
    }

]

exports.template = template;