import config from "./game.config.json";

const app = document.getElementById('app');
const game = app.querySelector('.game');
const side = app.querySelector('.side');

const pauseBtn = side.querySelector('.pause');
const resumeBtn = side.querySelector('.resume');
const nextBtn = side.querySelector('.next-level');

const playerName = side.querySelector('.player-name');
const playerScore = side.querySelector('.player-score');
const antiScore = side.querySelector('.anti-score');
const timer = side.querySelector('.timer-number');
const round = side.querySelector('.rounds-number');

let NAME;

let ROUND = 1;
let TIMER = 30000;
let TIMER_INTERVAL;
let APPEARENCE_INTERVAL;
let SCORE = 0;
let ANTISCORE = 0;
let APPEARENCE_TIME = Math.max(100, (TIMER / ((ROUND + 3) * 20)));
let totalHeight = document.documentElement.clientHeight;
let FLOW_SPEED = Math.min(10, 2 + ROUND);
let PAUSE_SCREEN;
let isPaused = false;
let GAME_OVER;


const BUBBLES = [];
// Helper

const createElement = (type, props) => {
    const element = document.createElement(type);
    for (let prop of Object.keys(props))
        element.setAttribute(prop, props[prop]);

    return element;
}

const append = (parent, children) => {
    parent.appendChild(children);
}

const getRandomColor = () => {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const getRandomNumber = (min, max) => {
    return Math.random() * (max - min) + min;
}


// Specific Helper

const renderValues = () => {
    playerName.textContent = NAME;
    playerScore.textContent = SCORE;
    antiScore.textContent = ANTISCORE;
    round.textContent = ROUND;
    timer.textContent = `${TIMER / 1000}s`;
}

const updateValues = () => {
    playerScore.textContent = SCORE;
    antiScore.textContent = ANTISCORE;
}

const updateTimer = () => {
    timer.textContent = `${TIMER / 1000}s`;
}

const startTimer = () => {
    TIMER_INTERVAL = setInterval(() => {
        if(TIMER <= 0) {
            clearInterval(TIMER_INTERVAL);
            clearInterval(APPEARENCE_INTERVAL);
            changeBtnState(false);

            pauseBtn.disabled = true;
            resumeBtn.disabled = true;
        } else if (ANTISCORE > SCORE){
            clearInterval(TIMER_INTERVAL);
            clearInterval(APPEARENCE_INTERVAL);
            gameOverScreen();
            append(game, GAME_OVER);

        } else {
            TIMER = TIMER - 1000;
            updateTimer();
        } 
    }, 1000);
}




const pauseTimer = () => {
    clearInterval(TIMER_INTERVAL);
}

const pauseGenerator = () => {
    clearInterval(APPEARENCE_INTERVAL);
}

const pauseScreen = () => {
    PAUSE_SCREEN = createElement('div', { class: 'pause-screen'});
    PAUSE_SCREEN.textContent = "PAUSED";
}

const gameOverScreen = () => {
    GAME_OVER = createElement('div', { class: 'game-over'});
    GAME_OVER.textContent = "GAME OVER";

    setTimeout(() => {
        window.location.reload();
    }, 1000);
}



const changeBtnState = (state) => {
    nextBtn.disabled = state;
}

const startBubblesFlow = () => {
    APPEARENCE_INTERVAL = setInterval(() => {
        append(game, bubble());
    }, APPEARENCE_TIME);
}

const addBorderColor = (element, color) => {
    element.style.border = `5px solid ${color}`;
}

const popBubble = (bubble, interval, destroyer = 'player') => {
    clearInterval(interval);

    if(destroyer === 'player')
        SCORE++;
    else if (destroyer === 'god')
        ANTISCORE++;

    const index = BUBBLES.indexOf(bubble);

    if(index > -1)
        BUBBLES.splice(index, 1);


    game.removeChild(bubble);

    updateValues();
}

const bubble = () => {
    const element = createElement('div', { class: 'bubble' });
    addBorderColor(element, getRandomColor());

    let bottom = config.BUBBLE_STARTING_POSITION;

    element.style.bottom = `${bottom}px`;
    element.style.left = `${getRandomNumber(config.MIN, config.MAX)}%`;

    element.play = () => {
        element.moveInterval = setInterval(() => {
            if(bottom >= totalHeight){
                popBubble(element, element.moveInterval, 'god');
            } else {
                bottom += FLOW_SPEED;
                element.style.bottom = `${bottom}px`;
            }
        }, config.GEN_SPEED);
    }

    element.play();

    element.pause = () => {
        clearInterval(element.moveInterval);
    }

    element.addEventListener('mouseover', () => {
        popBubble(element, element.moveInterval, 'player'); 
    });

    BUBBLES.push(element);
    return element;
}

const startNewRound = () => {
    ROUND++;
    TIMER = 30000;
    APPEARENCE_TIME = Math.max(100, (TIMER / ((ROUND + 3) * 20)));
    totalHeight = document.documentElement.clientHeight;
    FLOW_SPEED = Math.min(10, 2 + ROUND);
    changeBtnState(true);
    pauseBtn.disabled = false;
    resumeBtn.disabled = false;

    clearInterval(TIMER_INTERVAL);
    clearInterval(APPEARENCE_INTERVAL);

    renderValues();
    startTimer();
    startBubblesFlow()

}



(function __init__(){

    NAME = prompt('Please enter your name').slice(0,16) || 'player';

    pauseBtn.addEventListener('click', () => {

        if(!isPaused) {
            pauseGenerator()
            pauseTimer();
    
            BUBBLES.forEach(bubble => {
                bubble.pause();
            })
    
            pauseScreen();
            append(game, PAUSE_SCREEN);

            isPaused = !isPaused;
            pauseBtn.disabled = true;
            resumeBtn.disabled = false;

        } else {

            return;
        }


       
    })

    resumeBtn.addEventListener('click', () => {

        if(isPaused) {
            startBubblesFlow();
            startTimer();

            BUBBLES.forEach(bubble => {
                bubble.play();
            })

            game.removeChild(PAUSE_SCREEN);

            isPaused = !isPaused;
            pauseBtn.disabled = false;
            resumeBtn.disabled = true;
        } else {
            return;
        }
        
                
    })

    changeBtnState(true);

    renderValues();
    startTimer();
    startBubblesFlow();

    nextBtn.addEventListener('click', () => {
        startNewRound();
    })


})();
