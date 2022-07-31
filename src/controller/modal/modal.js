
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
}

