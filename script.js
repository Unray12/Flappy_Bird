const canvasElement = document.getElementById("game-view");
const canvasContex = canvasElement.getContext("2d");
let frames = 0;

//LOAD SPRITE IMAGE
const sprite = new Image();
sprite.src = "assets/images/sprite.png";

const gameState = {
    current: 0,
    getReady: 0,
    inGame: 1,
    gameOver: 2,
}

//INTERACT TO GAME
document.addEventListener("click", function(event) {

});
class Character {
    animationImg = [];
    x = 0;
    y = 0;
    width = 0;
    height = 0;
    frame = 0;
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    addAnimationImg(sX, sY) {
        this.animationImg.push({sX: sX, sY: sY});
    }

    draw() {
        let currentFrame = this.animationImg[this.frame];
        canvasContex.drawImage(sprite, currentFrame.sX, currentFrame.sY, 
            this.width, this.height, this.x - this.width/2, this.y - this.height/2, this.width, this.height);
    }
}

//GET READY/OVER MESSAGE
class NotifyMessage {
    sX = 0;
    sY = 0;
    width = 0;
    height = 0;
    x = 0;
    y = 0;
    stateToView = 0;

    constructor(sX, sY, width, height, x, y, stateToView) {
        this.sX = sX;
        this.sY = sY;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.stateToView = stateToView;
    }

    centerX() {
        this.x = canvasElement.width/2 - this.width/2;
    }

    centerY() {
        this.y = canvasElement.height/2 - this.height/2;
    }

    draw() {
        if (gameState.current == this.stateToView) {
            canvasContex.drawImage(sprite, this.sX, this.sY, this.width, 
                this.height, this.x, this.y, this.width, this.height);
        }
    }

}

//TAKE BACKGROUND FROME SPRITE
const background = {
    sX: 0,
    sY: 0,
    width: 275,
    height: 226,
    x: 0,
    y: canvasElement.height - 226,

    draw: function() {
        canvasContex.drawImage(sprite, this.sX, this.sY, this.width, 
            this.height, this.x, this.y, this.width, this.height);
        
        canvasContex.drawImage(sprite, this.sX, this.sY, this.width, 
            this.height, this.x + this.width, this.y, this.width, this.height);
    }
}

//TAKE FOREGROUND FROME SPRITE
const foreground = {
    sX: 276,
    sY: 0,
    width: 224,
    height: 112,
    x: 0,
    y: canvasElement.height - 112,

    draw: function() {
        canvasContex.drawImage(sprite, this.sX, this.sY, this.width, 
            this.height, this.x, this.y, this.width, this.height);
        
        //draw to entire screen
        canvasContex.drawImage(sprite, this.sX, this.sY, this.width, 
            this.height, this.x + this.width, this.y, this.width, this.height);
    }
}

//////////////// INIT ////////////////
let bird = new Character(50, 150, 34, 26);
bird.addAnimationImg(276, 112);
bird.addAnimationImg(276, 139);
bird.addAnimationImg(276, 164);
bird.addAnimationImg(276, 139);

let readyMessage = new NotifyMessage(0, 228, 173, 152, 80, 80, gameState.getReady);
readyMessage.centerX();
let gameoverMessage = new NotifyMessage(175, 228, 225, 202, 80, 90, gameState.gameOver);
gameoverMessage.centerX();
//////////////////////////////////////

function draw() {
    canvasContex.fillStyle = "#33ccff";
    canvasContex.fillRect(0, 0, canvasElement.width, canvasElement.height);
    background.draw();
    foreground.draw();
    bird.draw();
    readyMessage.draw();
    gameoverMessage.draw();
}

function gameLoop() {
    draw();
    frames++; 
    requestAnimationFrame(gameLoop);
}


gameLoop();

