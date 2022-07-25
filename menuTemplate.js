const template = [
    // { role: 'appMenu' }

    // { role: 'fileMenu' }
    {
        label: 'Juego',
        submenu: [
            { label :'Nueva partida', role:'reload'},
            { label :'Salir', role:'quit'}
        ]

    },
    {
        label: 'Dificultad',
        submenu: [
            
            { label : 'Fácil'},
            { label : 'Normal'},
            { label : 'Difícil'},
        ]
    },
    {
        label: "Puntuaciones",
        click: () => {
            // const { shell } = require('electron')
            // await shell.openExternal('https://electronjs.org')
            
            //TODO: open window with scores

        }
    },
    {
        label: 'Acerca de',
        submenu: [
            { label : 'Acerca de' , role:'about'}
        ]
    }
    
]

exports.template = template;