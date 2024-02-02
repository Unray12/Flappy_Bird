const canvasElement = document.getElementById("game-view");
const canvasContex = canvasElement.getContext("2d");
let frames = 0;
const DEGREE = Math.PI/180 //DEGREE to radian

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
canvasElement.addEventListener("click", function(event) {
    switch (gameState.current) {
        case gameState.getReady:
            gameState.current = gameState.inGame;
            break;
        case gameState.inGame:
            bird.flap();
            break;
        case gameState.gameOver:
            let rect = canvasElement.getBoundingClientRect();
            let clickX = event.clientX - rect.left;
            let clickY = event.clientY - rect.top;
            if (clickX >= startButton.x && clickX <= startButton.x + startButton.width
                && clickY >= startButton.y && clickY <= startButton.y + startButton.height) {
                    bird.resetToReady();
                    pipes.resetToReady();
                    gameState.current = gameState.getReady;
                }
            
            break;
        default:
            console.log("error");
    }
});

const startButton = {
    x: 120,
    y: 263,
    width: 83, 
    height: 29,
}

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

//inheritance of character
class MainCharacter extends Character {
    gravity = 0.22;
    jump = 4;
    speed = 0;
    rotaion = 0;
    scoreGame = {
        bestScore: parseInt(localStorage.getItem("bestScore")) || 0,
        value: 0,
        draw: function() {
            canvasContex.fillStyle = "#FFF";
            canvasContex.strokeStyle = "#000";
    
            if (gameState.current == gameState.inGame) {
                canvasContex.lineWidth = 2;
                canvasContex.font = "35px Teko";
                canvasContex.fillText(this.value, canvasElement.width/2, 50);
                canvasContex.strokeText(this.value, canvasElement.width/2, 50);
            }
            else if (gameState.current == gameState.gameOver){
                canvasContex.font = "25px Teko";
                canvasContex.fillText(this.value, 225, 186);
                canvasContex.strokeText(this.value, 225, 186);
                canvasContex.fillText(this.bestScore, 225, 228);
                canvasContex.strokeText(this.bestScore, 225, 228);
            }
        },
    }
    constructor(x, y, width, height) {
        super(x, y, width, height);
    }

    flap() {
        this.speed = -this.jump;
    }

    resetToReady() {
        this.speed = 0;
        this.rotaion = 0 * DEGREE;
        this.y = 150; //set the bird to initial position
        this.scoreGame.value = 0; //reset score
        
    }
    draw() {
        let currentFrame = this.animationImg[this.frame];
        canvasContex.save();
        canvasContex.translate(this.x, this.y);
        canvasContex.rotate(this.rotaion);
        //because the canvas origin is the bird center
        canvasContex.drawImage(sprite, currentFrame.sX, currentFrame.sY, 
            this.width, this.height, -this.width/2, -this.height/2, this.width, this.height);
        canvasContex.restore();
    }
    updateImage() {
        //GAME READY --> THE BIRD FLAPS SlOWLY
        // 1 period to update next image = 10 frames of hole games
        this.periodUpdate = gameState.current == gameState.getReady ? 10 : 5;
        this.frame += (frames % this.periodUpdate == 0) ? 1 : 0;
        //the frame of character loops to final element in animation in array and turn to the first
        this.frame = this.frame % this.addAnimationImg.length;

        if (gameState.current == gameState.getReady) {
            this.resetToReady()
        }
        else {
            this.speed += this.gravity;
            this.y += this.speed;
            //condition falling to lose game
            if (this.y + this.height/2 >= canvasElement.height - foreground.height) {
                this.y = canvasElement.height - foreground.height - this.height/2;
                if (gameState.current == gameState.inGame)
                    gameState.current = gameState.gameOver;
            }
            
            if (this.speed < this.jump) {//the bird flapping
                this.rotaion = -25 * DEGREE;
            } 
            else if (this.speed - this.jump < 1){
                this.rotaion = 25 * DEGREE;
                this.frame = 1; //falling so stop flapping
            }
            else {
                this.rotaion = 90 * DEGREE;
                this.frame = 1; //falling so stop flapping
            }
        }
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

class Obsacle {
    sX = 0;
    sY = 0;
    x = 0;
    y = 0;
    width = 0;
    height = 0;
    stateToView = 1;
    constructor(sX, sY, width, height, x, y, stateToView, mainCharacter) {
        this.sX = sX;
        this.sY = sY;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.stateToView = stateToView;
        this.mainCharacter = mainCharacter;
    }

    draw() {
        if (gameState == this.stateToView) {
            canvasContex.drawImage(sprite, this.sX, this.sY, this.width, 
                this.height, this.x, this.y, this.width, this.height);
        }
    }
}

class PairPipes extends Obsacle {
    bottom = {sX: 0, sY: 0};
    top = {sX: 0, sY: 0};
    gap = 0;
    quantityMove = 0;
    positionOfToPipe = [];
    maxYPosition = -150; //for limit the top pipe

    constructor(botSX, botSY, topSX, topSY, gap, quantityMove, stateToView, mainCharacter) {
        super(0, 0, 53, 400, 0, 0, stateToView, mainCharacter);
        this.bottom.sX = botSX;
        this.bottom.sY = botSY;
        this.top.sX = topSX;
        this.top.sY = topSY;
        this.gap = gap;
        this.quantityMove = quantityMove;
    }

    resetToReady() {
        this.positionOfToPipe = [];
    }
    mainCharacterCollision(pipesPos) {
        if ((this.mainCharacter.x + this.mainCharacter.width / 2 >= pipesPos.x  && 
        this.mainCharacter.y - this.mainCharacter.height / 2 <= pipesPos.y + this.height)) {
            return true;
        } 
        
        if ((this.mainCharacter.x + this.mainCharacter.width / 2 >= pipesPos.x && 
        this.mainCharacter.y + this.mainCharacter.height / 2 >= pipesPos.y + this.height + this.gap)) {
            return true;
        }
        return false;
    }

    draw() {
        for (let i = 0; i < this.positionOfToPipe.length; i++) {
            let p = this.positionOfToPipe[i];
            let topYPos = p.y;
            let bottomYPos = p.y + this.height + this.gap;

            //TOP PIPE
            canvasContex.drawImage(sprite, this.top.sX, this.top.sY, this.width, 
                this.height, p.x, topYPos, this.width, this.height);
            //BOTTOM PIPE
            canvasContex.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.width, 
                this.height, p.x, bottomYPos, this.width, this.height);
        }
    }

    updateImage() {
        if (gameState.current == this.stateToView) {
            if (frames % 100 == 0) { //create new pipes every 100 frames game
                this.positionOfToPipe.push({
                    x: canvasElement.width,
                    y: this.maxYPosition * (Math.random() + 1)
                });
            }
            // if (this.positionOfToPipe.length > 0 &&
            //     this.positionOfToPipe[0].x < this.mainCharacter.x - this.mainCharacter.width/2) {
            //     scoreGame.value += 1;
            //     scoreGame.bestScore = Math.max(scoreGame.value, scoreGame.bestScore);
            //     localStorage.setItem("bestScore", scoreGame.bestScore);
            // }
            for (let i = 0; i < this.positionOfToPipe.length; i++) {
                let p = this.positionOfToPipe[i];
                
                if (this.mainCharacterCollision(p))
                    gameState.current = gameState.gameOver;

                p.x -= this.quantityMove; //move the pipes to the left
                //delete pipe goes beyond the canvas
                if (p.x + this.width < 0) {
                    this.positionOfToPipe.shift();
                    this.mainCharacter.scoreGame.value += 1;
                    this.mainCharacter.scoreGame.bestScore = Math.max(this.mainCharacter.scoreGame.value, this.mainCharacter.scoreGame.bestScore);
                    localStorage.setItem("bestScore", this.mainCharacter.scoreGame.bestScore);
                }
            }
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
    quantityMove: 1,

    draw: function() {
        canvasContex.drawImage(sprite, this.sX, this.sY, this.width, 
            this.height, this.x, this.y, this.width, this.height);
        
        //draw to entire screen
        canvasContex.drawImage(sprite, this.sX, this.sY, this.width, 
            this.height, this.x + this.width, this.y, this.width, this.height);
    },

    updateImage: function() {
        if (gameState.current == gameState.inGame) { //move the foreground
            this.x = (this.x - this.quantityMove) % (this.width / 2);
        }
    }
}


//////////////// INIT ////////////////
let bird = new MainCharacter(50, 150, 34, 26);
bird.addAnimationImg(276, 112);
bird.addAnimationImg(276, 139);
bird.addAnimationImg(276, 164);
bird.addAnimationImg(276, 139);

let readyMessage = new NotifyMessage(0, 228, 173, 152, 80, 80, gameState.getReady);
readyMessage.centerX();
let gameoverMessage = new NotifyMessage(175, 228, 225, 202, 80, 90, gameState.gameOver);
gameoverMessage.centerX();

let pipes = new PairPipes(502, 0, 553, 0, 90, 2, gameState.inGame, bird);
//////////////////////////////////////

function draw() {
    canvasContex.fillStyle = "#33ccff";
    canvasContex.fillRect(0, 0, canvasElement.width, canvasElement.height);
    background.draw();
    pipes.draw(); //under foreground on background
    
    foreground.draw();
    bird.draw();
    readyMessage.draw();
    gameoverMessage.draw();
    bird.scoreGame.draw();
    
}

function updateImage() {
    bird.updateImage();
    foreground.updateImage();
    pipes.updateImage();
}

function gameLoop() {
    updateImage();
    draw();
    frames++; 
    requestAnimationFrame(gameLoop);
}


gameLoop();

