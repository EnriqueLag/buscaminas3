const { ipcRenderer } = require("electron");

let menuBarCnt = document.querySelector(".menu-bar");
let subMenuCnt = menuBarCnt.querySelectorAll(".sub-menu");
let menuItemCnt = menuBarCnt.querySelectorAll("li[class='menu-item']");


menuItemCnt.forEach(item => {

    switch (item.textContent) {
        case "Nuevo juego":
            item.addEventListener("click", () => {
                ipcRenderer.send("new-game");
            });
            break;
        case "Salir":
            item.addEventListener("click", () => {
                ipcRenderer.send("exit-game");
            });
        case "Fácil":
            item.addEventListener("click", () => {
                createBoard(0);
                // console.log(item);
            });
            break;
        case "Intermedio":
            item.addEventListener("click", () => {
                createBoard(1);
                console.log(item);
            });
            break;
        case "Difícil":
            item.addEventListener("click", () => {
                createBoard(2);
            });
            break;
        case "Puntuaciones":
            item.addEventListener("click", () => {

                modalContent(showScore());
                showHideModal();
            });
            break;
        case "Acerca de":
            item.addEventListener("click", () => {

                modalContent(createAbout());
                showHideModal();
            });
            break;

        default:
            break;
    }
});

function createAbout() {


    let div = document.createElement("div");
    div.classList.add("about");


    let description = document.createElement("p");
    description.classList.add("description");
    description.textContent = "💣 Buscaminas 💣";

    let version = document.createElement("p");
    version.textContent = "Versión: 0.1.0";

    let author = document.createElement("p");
    author.classList.add("author");

    let twitch = document.createElement("a");
    twitch.href = "https://www.twitch.tv/altaskur";

    let twitchIcon = document.createElement("i");
    twitchIcon.classList.add("bi", "bi-twitch");
    twitch.append(twitchIcon, "Altaskur");

    let github = document.createElement("a");
    github.href = "https://github.com/altaskur";
    githubIcon = document.createElement("i");
    githubIcon.classList.add("bi", "bi-github");
    github.append(githubIcon, "Altaskur");

    author.append(twitch, github);
    description.append(version);
    div.append(description, author);

    return div;
}

function showScore() {
    let showScore_Container = document.createElement("div");
    showScore_Container.classList.add("score-cnt");

    let showScore_title = document.createElement("h1");
    showScore_title.textContent = "Puntuaciones";
    showScore_Container.append(showScore_title);

    for (let i = 0; i < 3; i++) {
        let difficulty = localStorage.getItem(i);
        if (difficulty != null && difficulty.length > 0) {
            difficulty = JSON.parse(difficulty);

            switch (i) {
                case 0:
                    levelName = "Fácil";
                    break;
                case 1:
                    levelName = "Normal";
                    break;
                case 2:
                    levelName = "Difícil";
                    break;
            }
            let showScore_levelContainer = document.createElement("div");
            showScore_levelContainer.classList.add("level-cnt");

            let showScore_levelNameContainer = document.createElement("i");
            showScore_levelNameContainer.textContent = levelName;
            showScore_levelContainer.appendChild(showScore_levelNameContainer);

            let showScore_scoreBoardTable = document.createElement("table");
            showScore_scoreBoardTable.id =
                "showScore-board-table";

            let showScore_tableHead = document.createElement("thead");
            let showScore_tableHead_Row = document.createElement("tr");

            let showScore_tableCell = document.createElement("th");
            showScore_tableCell.textContent = "Nombre";
            showScore_tableHead_Row.appendChild(showScore_tableCell);

            showScore_tableHead_cell = document.createElement("th");
            showScore_tableHead_cell.textContent = "Tiempo";
            showScore_tableHead_Row.appendChild(showScore_tableHead_cell);

            showScore_tableHead.appendChild(showScore_tableHead_Row);
            showScore_scoreBoardTable.appendChild(showScore_tableHead);

            let showScore_tableBody = document.createElement("tbody");
            difficulty.sort(function (a, b) {
                if (a.points > b.points) {
                    return 1;
                }
                if (a.points < b.points) {
                    return -1;
                }

                return 0;
            }).slice(0, 5).map(item => {

                let showScore_tableBody_row = document.createElement("tr");

                let showScore_tableBody_cell = document.createElement("td");

                showScore_tableBody_cell.textContent = item.player;
                showScore_tableBody_row.appendChild(showScore_tableBody_cell);

                showScore_tableBody_cell = document.createElement("td");
                showScore_tableBody_cell.textContent = item.points;
                showScore_tableBody_row.appendChild(showScore_tableBody_cell);

                showScore_tableBody.appendChild(showScore_tableBody_row);

            });
            showScore_scoreBoardTable.appendChild(showScore_tableBody);
            showScore_levelContainer.appendChild(showScore_scoreBoardTable);
        
            showScore_Container.appendChild(showScore_levelContainer);
        }
    }
    let clearBtn = document.createElement("button");
        clearBtn.classList.add("js-modal-button");
        clearBtn.textContent = "Eliminar";
        clearBtn.addEventListener("click", () => {
            window.localStorage.clear();
            showHideModal();
        });
    let p = document.createElement("p");
    p.appendChild(clearBtn);
    showScore_Container.appendChild(p);

    return showScore_Container;
}

function addScore(_gameDifficulty,playTime){

    let addScore_container = document.createElement("form");
    addScore_container.classList.add("score-cnt","score-add-cnt");

    let addScore_inputTitle = document.createElement("h1");
    addScore_inputTitle.textContent = "Añadir puntuación";


    let addScore_playerNameInput = document.createElement("input");
    addScore_playerNameInput.type = "text";
    addScore_playerNameInput.placeholder = "AAA";
    addScore_playerNameInput.value = "";
    addScore_playerNameInput.classList.add("player-name-input");
    addScore_playerNameInput.maxLength="3";
    addScore_playerNameInput.required = true;
    addScore_playerNameInput.focus();
    addScore_playerNameInput.id = "player-name-input";

    let addScore_playerNameLabel = document.createElement("label");
    addScore_playerNameLabel.htmlFor = "score-time-input";
    addScore_playerNameLabel.textContent = "Nombre:";
    
    let addScore_scoreInput = document.createElement("input");
    addScore_scoreInput.type = "number";
    addScore_scoreInput.value = playTime;
    addScore_scoreInput.disabled = true;

    let addScore_scoreLabel = document.createElement("label");
    addScore_scoreLabel.htmlFor = "score-input";
    addScore_scoreLabel.textContent = "Tiempo:";

    let addScore_p = document.createElement("p");

    let addScore_SendInput = document.createElement("input");
    addScore_SendInput.type = "submit";
    addScore_SendInput.value = "Enviar";
    addScore_SendInput.classList.add("js-modal-button");
    addScore_p.appendChild(addScore_SendInput);
    
    addScore_container.addEventListener("submit",  (event) => { 
        event.preventDefault();
        console.log(playTime)
        savePoints(_gameDifficulty, playTime, playerNameInput.value);
        showHideModal();
    });

    addScore_container.append(addScore_inputTitle,addScore_playerNameLabel, addScore_playerNameInput, addScore_scoreLabel, addScore_scoreInput, addScore_p);
    return addScore_container;

}