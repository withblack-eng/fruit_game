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


// 生成新对象
function newObject() {
    const objType = Math.random() < 0.75 ? 'fruit' : 'bomb';
    const img = objType === 'fruit' ? fruitImages[Math.floor(Math.random() * fruitImages.length)] : bombImage;
    const x = Math.random() * (width - 50); // 随机水平位置
    const y = Math.random() * (height - 50); // 随机垂直位置，直接在背景图内生成

    objects.push({
        img,
        x,
        y,
        type: objType,
        cut: false,
        width: 150, 
        height: 150,
        spawnTime: Date.now() // 记录生成时间
    });
}

// 检查两个对象是否重叠
function isOverlapping(obj1, obj2) {
    return (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
    );
}
// 绘制对象
function drawObjects() {
    objects.forEach(obj => {
        ctx.drawImage(obj.img, obj.x, obj.y, obj.width, obj.height);
    });
}
// ... 已有代码 ...

// 开始游戏事件
startButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    canvas.style.display = 'block';
    const scoreDisplay = document.getElementById('scoreDisplay');
    const livesDisplay = document.getElementById('livesDisplay');
    if (scoreDisplay && livesDisplay) {
        scoreDisplay.style.display = 'block';
        livesDisplay.style.display = 'block';
    }
    startButton.style.display = 'none'; 
    gameLoop();
});
// ... 已有代码 ...
// 移动对象
function moveObjects() {
    for (let i = objects.length - 1; i >= 0; i--) {
        const obj = objects[i];
        const currentTime = Date.now();
        // 检查是否已经过了 2 秒
        if (currentTime - obj.spawnTime >= 2000) { 
            objects.splice(i, 1);
        }
    }
}


// 检查切割
function checkCut(x, y) {
    for (let i = objects.length - 1; i >= 0; i--) {
        const obj = objects[i];
        if (x > obj.x && x < obj.x + obj.width && y > obj.y && y < obj.y + obj.height) {
            if (obj.type === 'fruit') {
                score += 10;
                obj.cut = true;
                objects.splice(i, 1);
            } else {
                endGame();
                return;
            }
        }
    }
}
// ... 已有代码 ...
// 初始化定时器，每 100000 毫秒（100 秒）生成一次水果
let spawnInterval = setInterval(newObject, 100000);
// 游戏循环
function gameLoop() {
    // 清空画布
    ctx.clearRect(0, 0, width, height);
    // 绘制游戏进行中背景图
    ctx.drawImage(gameBackgroundImage, 0, 0, width, height);

    //  移除原本随机生成水果的逻辑
      if (Math.random() < 0.005) { 
          newObject();
      }

    drawObjects();
    moveObjects();
    updateDisplay();

    if (lives > 0) {
        requestAnimationFrame(gameLoop);
    } else {
        // 游戏结束时清除定时器
        clearInterval(spawnInterval);
    }
}


// 绘制对象
function drawObjects() {
    objects.forEach(obj => {
        ctx.drawImage(obj.img, obj.x, obj.y, obj.width, obj.height);
    });
}

// ... 已有代码 ...
// 结束游戏函数
function endGame() {
    lives = 0;
    // 绘制结束背景图
    ctx.drawImage(endBackgroundImage, 0, 0, width, height);
    ctx.fillStyle = 'white';
    ctx.font = '36px Arial';
    ctx.fillText(`最终分数: ${score}，游戏结束！`, width / 2 - 200, height / 2);
}
// 假设不同水果有不同的分数
const fruitScores = {
    type1: 10,
    type2: 10,
    type3: 10
};

// 点击事件处理
gameCanvas.addEventListener('click', (event) => {
    if (gameOver) return;

    const rect = gameCanvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    objects.forEach((obj, index) => {
        const distance = Math.sqrt((clickX - obj.x) ** 2 + (clickY - obj.y) ** 2);
        if (distance < 20) {
            if (obj.isBomb) {
                endGame();
            } else {
                // 根据水果类型增加不同分数
                score += fruitScores[obj.type] || 10; 
                objects.splice(index, 1);
            }
        }
    });
});
// 更新显示
function updateDisplay() {
    
    const scoreDisplay = document.getElementById('scoreDisplay');
    if (scoreDisplay && livesDisplay) {
        
        scoreDisplay.textContent = `分数: ${score}`;
    }
}

// 鼠标点击事件
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    checkCut(x, y);
    
});

// 开始游戏事件
startButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    canvas.style.display = 'block';
    document.getElementById('scoreDisplay').style.display = 'block';
    document.getElementById('livesDisplay').style.display = 'block';
    gameLoop();
});

// 页面加载完成后绘制开始背景图
window.addEventListener('load', () => {
    const startScreenCtx = startScreen.getContext('2d');
    startScreenCtx.drawImage(startBackgroundImage, 0, 0, startScreen.width, startScreen.height);
});