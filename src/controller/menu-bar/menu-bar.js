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
                console.log(item);
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

                modalContent(createScore());
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

    let title = document.createElement("h1");
    title.textContent = "Acerca de";

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
    div.append(title, description, author);

    return div;
}

function createScore() {
    let scoreCnt = document.createElement("div");
    scoreCnt.classList.add("score-cnt");
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
            let levelCnt = document.createElement("div");
            levelCnt.classList.add("level-cnt");

            let levelNameCnt = document.createElement("i");
            levelNameCnt.textContent = levelName;
            levelCnt.appendChild(levelNameCnt);

            let scoreBoardTable = document.createElement("table");

            let scoreBoardTableHead = document.createElement("thead");
            let scocreBoardTableHeadRow = document.createElement("tr");

            let scoreBoardTableHeadCell = document.createElement("th");
            scoreBoardTableHeadCell.textContent = "Nombre";
            scocreBoardTableHeadRow.appendChild(scoreBoardTableHeadCell);

            scoreBoardTableHeadCell = document.createElement("th");
            scoreBoardTableHeadCell.textContent = "Puntuación";
            scocreBoardTableHeadRow.appendChild(scoreBoardTableHeadCell);

            scoreBoardTableHead.appendChild(scocreBoardTableHeadRow);
            scoreBoardTable.appendChild(scoreBoardTableHead);

            let scoreBoardTableBody = document.createElement("tbody");
            difficulty.sort(function (a, b) {
                if (a.points > b.points) {
                    return -1;
                }
                if (a.points < b.points) {
                    return 1;
                }

                return 0;
            }).slice(0, 5).map(item => {

                let scoreBoardTableBodyRow = document.createElement("tr");

                let scoreBoardTableBodyCell = document.createElement("td");
                scoreBoardTableBodyCell.textContent = item.user;
                scoreBoardTableBodyRow.appendChild(scoreBoardTableBodyCell);

                scoreBoardTableBodyCell = document.createElement("td");
                scoreBoardTableBodyCell.textContent = item.points;
                scoreBoardTableBodyRow.appendChild(scoreBoardTableBodyCell);

                scoreBoardTableBody.appendChild(scoreBoardTableBodyRow);


            });
            scoreBoardTable.appendChild(scoreBoardTableBody);
            levelCnt.appendChild(scoreBoardTable);
            scoreCnt.appendChild(levelCnt);
        }

    }

    return scoreCnt;
}