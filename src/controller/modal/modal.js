console.log("modal.js");

let modalCnt = document.querySelector(".js-app-modal");
let modalArticle = modalCnt.querySelector("article").querySelector("div");

modalCnt.addEventListener("click", () => {
    modalCnt.classList.add("js-hidden");
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
    console.log(content)
    modalArticle.innerHTML = content;
    externalLinks();
}