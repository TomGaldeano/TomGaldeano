const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 600;
const canvas = document.querySelector('#runCanvas');
const ctx = canvas.getContext('2d');
function draw(){
    ctx.fillStyle = "red"
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}
draw()
console.log("hhh")