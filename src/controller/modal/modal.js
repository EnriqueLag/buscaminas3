
if ( navigator.userAgent.indexOf('Electron') >= 0 ) {
    console.log("Electron");
    const shell = require('electron').shell
} else {
    console.log("Browser");
}
 



let modalCnt = document.querySelector(".js-app-modal");
let modalCalcelButton = document.querySelector("#modal-cancel");
let modalArticle = modalCnt.querySelector("article").querySelector("div");

modalCalcelButton.addEventListener("click", () => {
    modalCnt.classList.add("js-hidden");
    modalArticle.textContent = "";
    if (gameStarted) {
        startCounter();
    }
});


function showHideModal() {
    modalCnt.classList.toggle("js-hidden");

    if (gameStarted) {
        stopCounter();
    }
}

function modalContent(content) {
    modalArticle.innerHTML = "";
    modalArticle.appendChild(content);
    externalLinks();
}

function externalLinks() {
    let externalLinks = document.querySelectorAll('a[href]');
    externalLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            shell.openExternal(link.href)
        });
    });
}