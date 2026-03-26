const items = [
    "Minim 1 cadru cu Gica Hagi", "Jucator schibat inainte de pauza", "Suporter intra pe teren", "Tricou dat jos dupa gol", "Arbitrul merge la VAR",
    "Cartonas rosu", "Huiduieli la imn", "Suntem furati", "Penalti acordat", "Bataie/Incaierare generala",
    "Comentatorii vor avea minim o referinta culinara", "Comentatori spun de Stefan cel Mare", "Prelungiri", "Minim un jucator face cu ochiul la imn",
    "Arda Guler, jucatorul lui Real Madrid", "Minim un debut la nationala Romaniei", "Minim 1 cadru cu R.Burleanu", "Gol cu capu", "Mingea loveste Bara",
    "Gol din afara terenului", "Gol din greseala/norocos", "Minge scoasa de pe linia portii", "Comentatori vor aminti de ultimul meci contra Turciei(2017)", "Penalty ratat/aparat"
];

let state = JSON.parse(localStorage.getItem("bingoState")) || null;

function shuffle(array) {
    return array.sort(() => 0.5 - Math.random());
}

function createBoard() {


    const board = document.getElementById("board");
    board.innerHTML = "";

    state.board.forEach((text, i) => {
        const div = document.createElement("div");
        div.classList.add("cell");
        div.innerText = text;

        if (state.checked[i]) div.classList.add("checked");

        if (i === 12) {
    div.classList.add("joker"); // stil special
} else {
    div.onclick = () => toggleCell(i);
}

        board.appendChild(div);
    });

}

function toggleCell(index) {
    state.checked[index] = !state.checked[index];

    playClick();

    save();
    createBoard();
    checkWin();
    
}

function checkWin() {
    const c = state.checked;

    const lines = [
        [0,1,2,3,4],
        [5,6,7,8,9],
        [10,11,12,13,14],
        [15,16,17,18,19],
        [20,21,22,23,24],

        [0,5,10,15,20],
        [1,6,11,16,21],
        [2,7,12,17,22],
        [3,8,13,18,23],
        [4,9,14,19,24],

        [0,6,12,18,24],
        [4,8,12,16,20]
    ];

    for (let line of lines) {
        if (line.every(i => c[i])) {
            highlightWin(line);
            showWin();
            break;
        }
    }
}

function highlightWin(line) {
    const cells = document.querySelectorAll(".cell");

    line.forEach(i => {
        cells[i].classList.add("win");
    });
}

function showWin() {
    document.getElementById("winPopup").classList.remove("hidden");

    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
    });

    playWinSound();
}

function playClick() {
    const sound = document.getElementById("clickSound");
    sound.currentTime = 0;
    sound.play().catch(e => console.log("Audio error:", e));
}

function playWinSound() {
    const sound = document.getElementById("winSound");
    sound.currentTime = 0;
    sound.play().catch(e => console.log("Audio error:", e));
}


function newGame() {

    let shuffled = shuffle([...items]);

    // luăm doar 24
    let selected = shuffled.slice(0, 24);

    // inserăm joker pe poziția 12
    selected.splice(12, 0, "🏆");

    state = {
        board: selected,
        checked: Array(25).fill(false)
    };

    state.checked[12] = true;

    document.querySelectorAll(".cell").forEach(c => c.classList.remove("win"));

    save();
    createBoard();
}

function save() {
    localStorage.setItem("bingoState", JSON.stringify(state));
}

function closePopup() {
    document.getElementById("winPopup").classList.add("hidden");

    const winSound = document.getElementById("winSound");
    winSound.pause();        // ⏸️ oprește
    winSound.currentTime = 0; // 🔄 reset la început
}

if (!state) newGame();
else createBoard();