const gameArea = document.getElementById('game');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const startButton = document.getElementById('start-btn');

let score = 0;
let lives = 3;
let gameInterval;
let MushroomsData = [];

async function fetchMushrooms() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Viktoriia-P-H11/Mushrooms_game/main/data.json');
        const data = await response.json();
        MushroomsData = data.mushrooms;
    } catch (error) {
        console.error('Problem with JSON:', error);
    }
}

function createMushroom() {
    if (!MushroomsData.length) return;

    const mushroomInfo = MushroomsData[Math.floor(Math.random() * MushroomsData.length)];
    const mushroom = document.createElement('div');
    mushroom.classList.add('mushroom');
    mushroom.classList.add(mushroomInfo.type);  // Добавление класса для типа гриба
    mushroom.dataset.type = mushroomInfo.type;
    mushroom.dataset.score = mushroomInfo.score || 0;
    mushroom.dataset.damage = mushroomInfo.damage || 0;

    mushroom.style.left = Math.random() * (gameArea.offsetWidth - 50) + 'px';
    mushroom.style.top = '0px';
    gameArea.appendChild(mushroom);

    let fallInterval = setInterval(() => {
        const top = parseInt(mushroom.style.top);
        if (top > gameArea.offsetHeight) {
            clearInterval(fallInterval);
            mushroom.remove();
        } else {
            mushroom.style.top = top + 5 + 'px';
        }
    }, 50);

    mushroom.addEventListener('click', () => {
        clearInterval(fallInterval);
        mushroom.remove();
        if (mushroom.dataset.type === 'good') {
            score += parseInt(mushroom.dataset.score);
        } else {
            lives -= parseInt(mushroom.dataset.damage);
        }
        updateScoreboard();
        if (lives <= 0) endGame();
    });
}

function updateScoreboard() {
    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;
}

function startGame() {
    score = 0;
    lives = 3;
    updateScoreboard();
    startButton.style.display = 'none';
    gameInterval = setInterval(createMushroom, 1000);
}

function endGame() {
    clearInterval(gameInterval);
    alert(`Game over! Your score: ${score}`);
    startButton.style.display = 'block';
    clearGameArea();
}

function clearGameArea() {
    while (gameArea.firstChild) {
        gameArea.firstChild.remove();
    }
}

startButton.addEventListener('click', startGame);
fetchMushrooms();
