// 게임 화면
const board = document.querySelector('.board');
const cellArray = Array(18).fill(null).map(() => Array());
const boardWidth = 18;
const boardHeight = 15;

// 플레이어
let moveDir;
let currentDir;
let snake = [];
let newTailPos;

// 사과
let applePos = [0, 0];

// 점수판 / 점수
const currentScoreUI = document.querySelector('.currentScore');
const bestScoreUI = document.querySelector('.bestScore');
let currentScore;
let bestScore;

// Modal
const backCover = document.querySelector('.backgroundCover');
const modal = backCover.querySelector('.modal');

// Audio
const eatAudio = new Audio('./Audios/eat.ogg');

let interval;
let isGameStart = false;
let isGameOver = false;

function init() {
    window.onkeydown = (event) => {
        if (event.keyCode == 39 && currentDir !== 'left') {
            moveDir = 'right';
        } else if (event.keyCode == 37 && currentDir !== 'right') {
            moveDir = 'left';
        } else if (event.keyCode == 38 && currentDir !== 'down') {
            moveDir = 'up';
        } else if (event.keyCode == 40 && currentDir !== 'up') {
            moveDir = 'down';
        }

        if (!isGameStart) {
            if (event.keyCode == 39 ||
                event.keyCode == 37 ||
                event.keyCode == 38 ||
                event.keyCode == 40) {
                isGameStart = true;
                gameStart();
            }
        } else if (isGameStart && isGameOver && event.keyCode == 82) {
            location.reload();
        }
    }

    // 플레이어 위치 랜덤 지정
    let posX = Math.floor(Math.random() * (boardWidth - 3)) + 1;
    let posY = Math.floor(Math.random() * (boardHeight - 3)) + 1;
    snake[0] = [posX, posY];

    modal.innerText = 'Press any arrow key to start';
    currentScore = 0;
    bestScore = getCookie('bestScore') != undefined ? getCookie('bestScore') : 0;
    bestScoreUI.innerText = bestScore;

    createBoard();
    createNewApple();
    draw();
}

function createBoard() {
    for (let i = 0; i < boardHeight; i++) {
        for (let j = 0; j < boardWidth; j++) {
            let cell = document.createElement('div');
            board.appendChild(cell);
            cellArray[j][i] = cell;
        }
    }

    console.log(cellArray);
}

function update() {
    move();
    checkState();
    draw();
}

function move() {
    newTailPos = [...snake[snake.length - 1]];

    for (let i = snake.length - 1; i > 0; i--) {
        snake[i] = [...snake[i - 1]];
    }

    currentDir = moveDir;

    switch (currentDir) {
        case 'right':
            snake[0][0]++;
            break;
        case 'left':
            snake[0][0]--;
            break;
        case 'up':
            snake[0][1]--;
            break;
        case 'down':
            snake[0][1]++;
            break;
    }
}

function draw() {
    if (!isGameOver) {
        let cells = document.querySelectorAll('.board div');

        cells.forEach(cell => {
            cell.classList.remove('snake');
        });

        snake.forEach(snakeBody => {
            cellArray[snakeBody[0]][snakeBody[1]].classList.add('snake');
        });

        cellArray[applePos[0]][applePos[1]].classList.add('apple');
    }
}

function checkState() {
    // 벽에 충돌
    if (snake[0][0] < 0 || snake[0][0] > boardWidth - 1 ||
        snake[0][1] < 0 || snake[0][1] > boardHeight - 1) {
            console.log('crash!!')
        gameOver();
    }else { // 꼬리에 충돌
        let idx = 0;
        snake.forEach(snakeBody => {
            if (JSON.stringify(snake[0]) === JSON.stringify(snakeBody) && idx !== 0) {
                gameOver();
            }

            idx++;
        });
    }

    // 사과 먹음
    if (JSON.stringify(snake[0]) === JSON.stringify(applePos)) {
        getApple();
    }
}

function getApple() {
    snake[snake.length] = newTailPos;
    currentScore = currentScore + 10;
    currentScoreUI.innerText = currentScore;
    eatAudio.play();
    createNewApple();
}

function createNewApple() {
    cellArray[applePos[0]][applePos[1]].classList.remove('apple');

    // let filterArray = [];

    // let idx = 0;
    // cellArray.forEach(data => {
    //     let overlap = false;

    //     snake.forEach(snakeBody => {
    //         if (JSON.stringify(data) == JSON.stringify(snakeBody)) {
    //             overlap = true;
    //         }
    //     });

    //     if (!overlap) {
    //         filterArray[idx] = data;
    //         idx++;
    //         console.log(JSON.stringify(data));
    //     }
    // });

    // console.log(filterArray);


    let posX = Math.floor(Math.random() * (boardWidth - 1));
    let posY = Math.floor(Math.random() * (boardHeight - 1));

    applePos = [posX, posY];

    snake.forEach(snakeBody => {
        if (JSON.stringify(snakeBody) == JSON.stringify(applePos)) {
            createNewApple();
        }
    });
}

function gameOver() {
    if (currentScore > bestScore * 1) {
        setCookie('bestScore', currentScore);
        console.log(document.cookie);
    }

    isGameOver = true;
    clearInterval(interval);
    backCover.style.display = 'block';
    modal.innerHTML = `<h1>Game Over</h1><br><br>
                       <h2>Press R to reload<h2>`;
}

function gameStart() {
    backCover.style.display = 'none';
    interval = setInterval(update, 75);
}

function setCookie(name, value) {
    var date = new Date();
    date.setTime(date.getTime() + 9999*24*60*60*1000);
    document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
}
    
function getCookie(key) {
    var result = null;
    var cookie = document.cookie.split(';');
    cookie.some(function (item) {
        // 공백을 제거
        item = item.replace(' ', '');
 
        var dic = item.split('=');
 
        if (key === dic[0]) {
            result = dic[1];
            return true;    // break;
        }
    });
    return result;
}

init();