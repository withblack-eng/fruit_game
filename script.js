// 获取画布和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 获取开始按钮和开始界面
const startButton = document.getElementById('startButton');
const startScreen = document.getElementById('startScreen');

// 加载背景图片
const startBackgroundImage = new Image();
startBackgroundImage.src = '6.jpg';
const gameBackgroundImage = new Image();
gameBackgroundImage.src = '8.jpg';
const endBackgroundImage = new Image();
endBackgroundImage.src = '8.jpg';

// 游戏参数
const width = canvas.width;
const height = canvas.height;
let score = 0;
let lives = 3;
const objects = [];
const fruitImages = [
    new Image(),
    new Image(),
    new Image()
];
fruitImages[0].src = '1.png';
fruitImages[1].src = '2.png';
fruitImages[2].src = '3.png';
const bombImage = new Image();
bombImage.src = '4.png';

// 自定义参数
const BOMB_SPAWN_PROBABILITY = 0.4; // 炸弹出现概率40%
const CENTER_ZONE_RATIO = 0.6;      // 中间区域占比60%
const SPAWN_INTERVAL = 5000;        // 每5秒生成一个对象

// 生成新对象（优化版）
function newObject() {
    const objType = Math.random() < (1 - BOMB_SPAWN_PROBABILITY) ? 'fruit' : 'bomb';
    const img = objType === 'fruit' ? fruitImages[Math.floor(Math.random() * fruitImages.length)] : bombImage;
    
    // 计算中间区域
    const centerZoneWidth = width * CENTER_ZONE_RATIO;
    const centerZoneHeight = height * CENTER_ZONE_RATIO;
    const centerX = width/2 - centerZoneWidth/2;
    const centerY = height/2 - centerZoneHeight/2;

    // 位置生成逻辑
    let x, y;
    if (objType === 'bomb') {
        x = centerX + Math.random() * centerZoneWidth;
        y = centerY + Math.random() * centerZoneHeight;
    } else {
        x = Math.random() * (width - 50);
        y = Math.random() * (height - 50);
    }

    // 边界约束
    x = Math.max(0, Math.min(x, width - 50));
    y = Math.max(0, Math.min(y, height - 50));

    objects.push({
        img,
        x,
        y,
        type: objType,
        cut: false,
        width: 150,
        height: 150,
        spawnTime: Date.now()
    });
}

// 移动对象
function moveObjects() {
    for (let i = objects.length - 1; i >= 0; i--) {
        const obj = objects[i];
        if (Date.now() - obj.spawnTime >= 2000) {
            objects.splice(i, 1);
        }
    }
}

// 检查切割
function checkCut(x, y) {
    for (let i = objects.length - 1; i >= 0; i--) {
        const obj = objects[i];
        if (x > obj.x && x < obj.x + obj.width && 
            y > obj.y && y < obj.y + obj.height) {
            if (obj.type === 'fruit') {
                score += 10;
                objects.splice(i, 1);
            } else {
                lives = 0;
                endGame();
            }
        }
    }
}

// 游戏循环
let spawnInterval = setInterval(newObject, SPAWN_INTERVAL);
function gameLoop() {
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(gameBackgroundImage, 0, 0, width, height);

    if (Math.random() < 0.02) newObject(); // 高频随机生成
    drawObjects();
    moveObjects();
    updateDisplay();

    lives > 0 ? requestAnimationFrame(gameLoop) : clearInterval(spawnInterval);
}

// 绘制对象
function drawObjects() {
    objects.forEach(obj => {
        ctx.drawImage(obj.img, obj.x, obj.y, obj.width, obj.height);
    });
}

// 更新显示
function updateDisplay() {
    const scoreDisplay = document.getElementById('scoreDisplay');
    const livesDisplay = document.getElementById('livesDisplay');
    if (scoreDisplay && livesDisplay) {
        scoreDisplay.textContent = `分数: ${score}`;
        livesDisplay.textContent = `生命: ${lives}`;
    }
}

// 结束游戏
function endGame() {
    ctx.drawImage(endBackgroundImage, 0, 0, width, height);
    ctx.fillStyle = 'white';
    ctx.font = '36px Arial';
    ctx.fillText(`最终分数: ${score}，游戏结束！`, width/2 - 200, height/2);
}

// 事件监听
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    checkCut(e.clientX - rect.left, e.clientY - rect.top);
});

startButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    canvas.style.display = 'block';
    document.getElementById('scoreDisplay').style.display = 'block';
    document.getElementById('livesDisplay').style.display = 'block';
    gameLoop();
});

// 初始化
window.addEventListener('load', () => {
    const startScreenCtx = startScreen.getContext('2d');
    startScreenCtx.drawImage(startBackgroundImage, 0, 0, startScreen.width, startScreen.height);
});
