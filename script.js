canvasElement = document.getElementById("game-view");
canvasContex = canvasElement.getContext("2d");

function draw() {
    canvasContex.fillStyle = "#33ccff";
    canvasContex.fillRect(0, 0, canvasElement.width, canvasElement.height);
}

function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();