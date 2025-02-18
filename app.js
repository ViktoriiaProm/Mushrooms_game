const gameArea = document.getElementById('game');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const startButton = document.getElementById('start-btn');

let score = 0;
let lives = 3;
let gameInterval;
let MushroomsData = [];
// Fetch mushroom data from external JSON file
async function fetchMushrooms() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Viktoriia-P-H11/Mushrooms_game/main/data.json');
        const data = await response.json();
        MushroomsData = data.mushrooms;
    } catch (error) {
        console.error('Problem with JSON:', error);
    }
}
// Create a new mushroom element and add it to the game area
function createMushroom() {
    if (!MushroomsData.length) return;

    const mushroomInfo = MushroomsData[Math.floor(Math.random() * MushroomsData.length)];
    const mushroom = document.createElement('div');
    mushroom.classList.add('mushroom');
    mushroom.classList.add(mushroomInfo.type); 
    mushroom.dataset.type = mushroomInfo.type;
    mushroom.dataset.score = mushroomInfo.score || 0;
    mushroom.dataset.damage = mushroomInfo.damage || 0;
// Randomize mushroom's horizontal position
    mushroom.style.left = Math.random() * (gameArea.offsetWidth - 50) + 'px';
    mushroom.style.top = '0px';
    gameArea.appendChild(mushroom);
 // Animate the mushroom falling
    let fallInterval = setInterval(() => {
        const top = parseInt(mushroom.style.top);
        if (top > gameArea.offsetHeight) {
            clearInterval(fallInterval);
            mushroom.remove();
        } else {
            mushroom.style.top = top + 5 + 'px';
        }
    }, 50);
// Handle mushroom click event
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
// Update the scoreboard
function updateScoreboard() {
    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;
}
// Start the game
function startGame() {
    score = 0;
    lives = 3;
    updateScoreboard();
    startButton.style.display = 'none';
    gameInterval = setInterval(createMushroom, 1000);
}
// End the game
function endGame() {
    clearInterval(gameInterval);
    alert(`Game over! Your score: ${score}`);
    startButton.style.display = 'block';
    clearGameArea();
}
// Clear all mushrooms from the game area
function clearGameArea() {
    while (gameArea.firstChild) {
        gameArea.firstChild.remove();
    }
}

startButton.addEventListener('click', startGame);
fetchMushrooms();
