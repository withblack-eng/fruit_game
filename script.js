// 获取画布和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 获取开始按钮和开始界面
const startButton = document.getElementById('startButton');
const startScreen = document.getElementById('startScreen');

// 加载图片资源（新增加载完成检测）
let loadedImages = 0;
const totalImages = 5; // 3水果 + 1炸弹 + 3背景图

// 加载背景图片
const startBackgroundImage = new Image();
startBackgroundImage.onload = () => { loadedImages++; checkAllLoaded(); };
startBackgroundImage.src = '6.jpg';

const gameBackgroundImage = new Image();
gameBackgroundImage.onload = () => { loadedImages++; checkAllLoaded(); };
gameBackgroundImage.src = '8.jpg';

const endBackgroundImage = new Image();
endBackgroundImage.onload = () => { loadedImages++; checkAllLoaded(); };
endBackgroundImage.src = '8.jpg';

// 加载水果和炸弹图片
const fruitImages = [
    new Image(),
    new Image(),
    new Image()
];
fruitImages.forEach(img => {
    img.onload = () => { loadedImages++; checkAllLoaded(); };
});
fruitImages[0].src = '1.png';
fruitImages[1].src = '2.png';
fruitImages[2].src = '3.png';

const bombImage = new Image();
bombImage.onload = () => { loadedImages++; checkAllLoaded(); };
bombImage.src = '4.png';

// 游戏参数
const width = canvas.width;
const height = canvas.height;
let score = 0;
let lives = 3;
let gameStarted = false; // 新增游戏状态检测
const objects = [];

// 自定义参数
const BOMB_SPAWN_PROBABILITY = 0.4;
const CENTER_ZONE_RATIO = 0.6;
const SPAWN_INTERVAL = 5000;

// 检测所有资源加载完成
function checkAllLoaded() {
    if (loadedImages === totalImages && !gameStarted) {
        // 资源加载完成后显示开始按钮
        startButton.style.display = 'block';
        const startScreenCtx = startScreen.getContext('2d');
        startScreenCtx.drawImage(startBackgroundImage, 0, 0, startScreen.width, startScreen.height);
    }
}

// 生成新对象
function newObject() {
    const objType = Math.random() < (1 - BOMB_SPAWN_PROBABILITY) ? 'fruit' : 'bomb';
    const img = objType === 'fruit' ? fruitImages[Math.floor(Math.random() * fruitImages.length)] : bombImage;
    
    // 位置生成逻辑
    let x, y;
    if (objType === 'bomb') {
        const centerZoneWidth = width * CENTER_ZONE_RATIO;
        const centerZoneHeight = height * CENTER_ZONE_RATIO;
        x = (width/2 - centerZoneWidth/2) + Math.random() * centerZoneWidth;
        y = (height/2 - centerZoneHeight/2) + Math.random() * centerZoneHeight;
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
        width: 50,  // 修正为实际图片尺寸
        height: 50, // 修正为实际图片尺寸
        spawnTime: Date.now()
    });
}

// 其他函数保持不变（drawObjects/moveObjects/checkCut等）...

// 游戏循环
function gameLoop() {
    if (!gameStarted) return;

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(gameBackgroundImage, 0, 0, width, height);

    drawObjects();
    moveObjects();
    updateDisplay();

    if (lives > 0) {
        requestAnimationFrame(gameLoop);
    } else {
        endGame();
    }
}

// 事件监听（修改后）
startButton.addEventListener('click', () => {
    if (loadedImages !== totalImages) {
        alert("资源尚未加载完成，请稍候！");
        return;
    }
    gameStarted = true;
    startScreen.style.display = 'none';
    canvas.style.display = 'block';
    document.getElementById('scoreDisplay').style.display = 'block';
    document.getElementById('livesDisplay').style.display = 'block';
    spawnInterval = setInterval(newObject, SPAWN_INTERVAL);
    gameLoop();
});

// 初始化隐藏开始按钮
startButton.style.display = 'none';
