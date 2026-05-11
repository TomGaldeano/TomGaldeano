const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const canvas = document.querySelector('#spaceCanvas');
const ctx = canvas.getContext('2d');
function draw(){
    ctx.fillStyle = "red"
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}
draw()