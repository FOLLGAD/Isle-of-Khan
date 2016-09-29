// for testing;
function spawnMonster() {
  //pusha ett nytt enemy-objekt till en array
  if (enemies.length < 1000 && vPressed) {
    let rand = (getRandom()*3+1)*tileSize;
    enemies.push(new Enemy(camX + mousePosX - enemyWidth / 2, camY + mousePosY - enemyHeight / 2, rand, rand));
  }
}
// for testing;
function spawnCoinAtCursor() {
  //pusha ett nytt enemy-object i en array
  if (coins.length < 10000) {
    coins.push(new Coin(camX + mousePosX - 32 / 2, camY + mousePosY - 32 / 2));
  }
}

function drawGui() {
  //TODO: add inventory/hotbar with bow, sword and prehaps food
  ctx.font = "40px Courier";
  ctx.fillText("Coins: " + money, camX + 50, camY + 80);
  ctx.font = "20px Courier";

}

function drawHp() {
  d = new Date();
  if (d.getTime() - 2000 < lastHit || chars[0].hp < 8) {
    ctx.beginPath();
    ctx.fillStyle = "#000";
    ctx.fillRect(chars[0].posX - 20 - 1, chars[0].posY + chars[0].width / 2 - 100 - 1, 10 * 10 + 2, 12);
    ctx.fillStyle = "green";
    ctx.fillRect(chars[0].posX - 20, chars[0].posY + chars[0].width / 2 - 100, chars[0].hp * 10, 10);
    ctx.closePath();
    ctx.fillStyle = "#000";
  }
}

function drawCursor() {
  ctx.drawImage(crosshair, mousePosX + camX - 0, mousePosY + camY, 5 * 6, 6 * 6);
}

function menuToggle() {
  if (menuActive) {
    menuActive = false;
  } else {
    menuActive = true;
  }
  menu = true;
}

function deleteEnemies() {
  enemies = [];
}

let periodicMonsterSpawningBoundBySetIntervalFunctionSetTo2000Milliseconds = setInterval(spawnEnemy, 2000);

let monstersSpawn = true;

function spawnEnemy() {
  let rand = Math.floor((getRandom() * 2) + 1) * tileSize;
  console.log(rand);
  enemies.push(new Enemy(Math.round(getRandom() * tileMapWidth) * tileSize, Math.round(getRandom() * tileMapWidth) * tileSize, rand, rand));
}

function toggleEnemySpawn() {
  if (monstersSpawn == true) {
    clearInterval(periodicMonsterSpawningBoundBySetIntervalFunctionSetTo2000Milliseconds);
    monstersSpawn = false;
  } else {
    periodicMonsterSpawningBoundBySetIntervalFunctionSetTo2000Milliseconds = setInterval(spawnEnemy, 2000);
    monstersSpawn = true;
  }
}

let menuArray = [];

function menuButton(text, n, onClick, mode){
  this.text = text;
  this.mode = mode;
  this.bColour = "#fff";
  this.tColour = "#000";
  this.width = 80 * 8;
  this.height = 8 * 8;
  this.posX = canvas.width / 2 - this.width / 2;
  this.posY = 200 + 150 * n;
  this.img = menuButtonimg;
  this.pressed = false;
  this.draw = function() {
    ctx.fillStyle = this.bColour;
    ctx.drawImage(this.img, 0, this.pressed ? 8 : 0, this.width / 8, this.height / 8, this.posX + camX, this.posY + camY, this.width, this.height);
    ctx.fillStyle = this.bColour;
    ctx.textAlign = "center";
    ctx.fillText(this.text, this.posX + this.width / 2 + camX, this.posY + (this.pressed ? 45 : 37) + camY);
  };
  this.onClick = onClick;
}

menuArray.push(new menuButton("Kill Enemies", 0, deleteEnemies, "push"));
menuArray.push(new menuButton("Toggle Enemy Spawn", 1, toggleEnemySpawn, "toggle"));

function menuUpdate() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(camX, camY, canvas.width, canvas.height);
  ctx.drawImage(options, 0, 0, 70, 8, camX + canvas.width / 2 - 70 * 8 / 2, camY + 100, 70 * 8, 8 * 8);
  ctx.fillStyle = "#fff";
  for (i = 0; i < menuArray.length; i++) {
    menuArray[i].draw();
  }
}

function checkMenuClick() {
  if (menuActive) {
    let lMousePosX = mousePosX;
    let lMousePosY = mousePosY;
    for (i = 0; i < menuArray.length; i++) {
      if (lMousePosX > menuArray[i].posX && lMousePosX < menuArray[i].posX + menuArray[i].width && lMousePosY > menuArray[i].posY && lMousePosY < menuArray[i].posY + menuArray[i].height) {
        menuArray[i].onClick();
        menuArray[i].pressed = !menuArray[i].pressed;
      }
    }
  }
}
