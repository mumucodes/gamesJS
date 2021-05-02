const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;


let score = 0;
let gameFrame= 0;
ctx.font = '40px Georgia';
let gameSpeed = 1;
let gameOver = false; 
//mouse interactivity
let canvasPosition = canvas.getBoundingClientRect();


const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click: false
}
canvas.addEventListener('mousedown', function(event){
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
});
canvas.addEventListener('mouseup', function(){
    mouse.click = false;
})
//player
const playerLeft = new Image();
playerLeft.src = './green_fish_swim.png';
const playerRight = new Image();
playerRight.src = './green_fish_swim_right.png';

class Player {
    constructor(){
        this.x = canvas.width/2;
        this.y = canvas.height/2;
        this.radius = 50;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 498;
        this.spriteHeight = 327;
    }
    update(){
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        let theta = Math.atan2(dy, dx);
        this.angle = theta;
        if(mouse.x != this.x){
            this.x -= dx/20;
        }
        if(mouse.y != this.y){
            this.y -= dy/20;
        }
    }
    draw(){
        if(mouse.click){
            ctx.lineWidth = 0.3;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
        // ctx.fillStyle = 'red';
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // ctx.fill();
        // ctx.closePath();
        // ctx.fillRect(this.x, this.y, this.radius, 10);
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        if(this.x >= mouse.x){
            ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 60, 0 - 60, this.spriteWidth/4, this.spriteWidth/4);}
        else {
            ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 60, 0 - 60, this.spriteWidth/4, this.spriteWidth/4);
        }
        ctx.restore();
    }     
}
const player = new Player();

//bubbles
const bubblesArray = [];
const bubbleImage = new Image();
bubbleImage.src = './bubbles.png';

class Bubble{
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 50;
        this.speed = Math.random() * 5 + 1;
        this.distance;
        this.counted = false;
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
    }
    update(){
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx*dx + dy*dy);
    }
    draw(){
        // ctx.fillStyle = 'blue';
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // ctx.fill();
        // ctx.closePath();
        // ctx.stroke();
        ctx.drawImage(bubbleImage, this.x -65, this.y -65, this.radius * 2.7, this.radius * 2.7 );
    }
}
const bubblePop1 = document.createElement('audio');
bubblePop1.src = './sound1.wav';
const bubblePop2 = document.createElement('audio');
bubblePop2.src = './sound2.wav';

function handleBubbles(){
    if(gameFrame % 50 == 0){
        bubblesArray.push(new Bubble());
    }
    for (let i = 0; i < bubblesArray.length; i++){
        bubblesArray[i].update();
        bubblesArray[i].draw();
        if(bubblesArray[i].y < 0 - this.radius *2){
            bubblesArray.splice(i, 1);
            i--;
        } else if(bubblesArray[i].distance < bubblesArray[i].radius + player.radius){
                if(!bubblesArray[i].counted){
                    if(bubblesArray[i].sound == 'sound1'){
                        bubblePop1.play();
                    } else {
                        bubblePop2.play() ;
                    }
                    score++;
                    bubblesArray[i].counted = true;
                    bubblesArray.splice(i, 1);
                    i--;
                }
            }

    }
    
    for (let i = 0; i < bubblesArray.length; i++){

    }
}
//repeating backgrounds
const background = new Image();
background.src = './background1.png'

const BG = {
    x1: 0,
    x2: canvas.width,
    y: 0,
    width: canvas.width,
    height: canvas.height,

}
function handleBackground(){
    BG.x1 -= gameSpeed;
    if(BG.x1 < -BG.width) BG.x1 = BG.width;
    BG.x2 -= gameSpeed;
    if(BG.x2 < -BG.width) BG.x2 = BG.width;
    ctx.drawImage(background, BG.x1, BG.y, BG.width, BG.height);
    ctx.drawImage(background, BG.x2, BG.y, BG.width, BG.height);
}

const enemyImage = new Image();
enemyImage.src = './enemy1.png';

class Enemy {
    constructor(){
        this.x = canvas.width - 200;
        this.y = Math.random() * (canvas.height - 150) + 90;
        this.radius = 60;
        this.speed = Math.random() * 2 + 2;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 475;
        this.spriteHeight = 330;
    }
    draw(){
        // ctx.fillStyle = 'purple';
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // ctx.fill();
        ctx.drawImage(enemyImage, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - 60, this.y - 45  , this.spriteWidth / 4, this.spriteHeight / 4); 
    }
    update(){
        this.x -= this.speed;
        if(this.x < 0 - this.radius * 2){
            this.x = canvas.width + 200;
            this.y = Math.random() * (canvas.height - 150) + 90;
            this.speed = Math.random() * 2 + 2;
        }
        if (gameFrame % 5 == 0){
            this.frame++;
            if(this.frame >= 12) this.frame = 0;
            if(this.frame == 3 || this.frame == 7 || this.frame || 11){
                this.frameX = 0;
            } else {
                this.frameX++;
            }
            if(this.frame < 3) this.frameY = 0;
            else if (this.frame < 7) this.frameY = 1;
            else if (this.frame < 11) this.frameY = 2;
            else this.frameY= 0;
        }
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.radius + player.radius){
            handleGameOver();
        }
    }
}
const enemy1 = new Enemy();
function handleEnemies(){
    enemy1.draw();
    enemy1.update();
   
}
function handleGameOver(){
    ctx.fillStyle = 'white';
    ctx.fillText('GAME OVER, You scored ' + score, 120, 250);
    gameOver = true;
}
//animation loop
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleBackground();
    handleBubbles();
    player.update();
    player.draw();
    handleEnemies();
    ctx.fillStyle = 'black';
    ctx.fillText('score: ' + score, 10, 50);
    gameFrame++;
    if(!gameOver) requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', function(){
    canvasPosition = canvas.getBoundingClientRect();
}); 