const { ipcRenderer } = require("electron");

console.log("menu-bar.js");

let menuBarCnt = document.querySelector(".menu-bar");
let subMenuCnt = menuBarCnt.querySelectorAll(".sub-menu");
let menuItemCnt = menuBarCnt.querySelectorAll("li");

let subMenu1 = subMenuCnt[0];
let subMenu1Item = subMenu1.querySelectorAll("li");

let newGameBtn = subMenu1Item[0];

newGameBtn.addEventListener("click", () => {
    ipcRenderer.send("new-game");
});

let exitBtn = subMenu1Item[1];
exitBtn.addEventListener("click", () => {
    ipcRenderer.send("exit-game");
});

let subMenu2 = subMenuCnt[1];
let subMenu2Item = subMenu2.querySelectorAll("li");

subMenu2Item.forEach((item, index) => {
    item.addEventListener("click", () => {
        createBoard(index);
    });
});

let scoreBoardBtn = menuItemCnt[7];

scoreBoardBtn.addEventListener("click", () => {
    let scores = localStorage.scores

    if (scores) {
        modalContent(scores);
        showHideModal();
    }
});

let aboutBtn = menuItemCnt[8];

console.log(aboutBtn)


aboutBtn.addEventListener("click", () => {

    aboutCnt = "<h1>Sobre:</h1>"
    aboutCnt += "💣"
    aboutCnt += "<p> Buscaminas </p>"
    aboutCnt += "<p>"
    aboutCnt += " <a href='https://www.twitch.tv/altaskur'> <i class='bi bi-github'></i> altaskur</a>"
    aboutCnt += " <a href='https://github.com/altaskur'><i class='bi bi-twitch'></i>altaskur</a>"
    aboutCnt += "</p>"

    modalContent(aboutCnt);
    showHideModal();
});




