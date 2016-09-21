// update, tick
function update() {
  //DONE: HP-bar
  ctx.save();
  ctx.clearRect(-camX, -camY, canvas.width, canvas.height); //Clears viewPoint
  viewPoint();
  drawMap();
  drawCoin();
  walk();
  checkCharCollision();
  drawChar();
  drawTrees();
  ctx.fillText(camX + ", " + camY, camX + 100, camY + 100);
  drawHp();
  if(menuActive) {menuUpdate();}
  drawCrossHair();
  ctx.fillText(charX + ", " + charY, camX + 100, camY + 200);
  ctx.restore();
}

setInterval(update, 1000/fps);

// draw functions


//TODO: lägg till så att endast tiles synliga på canvas + buffer på ett block laddas
function drawMap(){
  var posX = 0;
  var posY = 0;
  for (var i = 0; i < mapArray.length; i++) {
    for (var j = 0; j < mapArray[i].length; j++) {
      ctx.drawImage(tile_map, (mapArray[i][j] % 2) * 8, Math.floor(mapArray[i][j] / 2) * 8, 8, 8, posX, posY, tileSize + 1, tileSize + 1);
      posX += tileSize;
    }
    posX = 0;
    posY += tileSize;
  }
}

function drawCrossHair() {
  ctx.drawImage(crosshair, mousePosX + camX - 0, mousePosY + camY, 5 * 6, 6 * 6);

}

// for testing;
function spawnMonster() {

}

function menuToggle() {
  if (menuActive) {
    menuActive = false;
  } else {
    menuActive = true;
  }
  menu = true;
}

function menuUpdate() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(camX, camY, canvas.width, canvas.height);
  ctx.drawImage(options, 0, 0, 70, 8, camX + canvas.width/2 - 70*8/2, camY + 100, 70*8, 8*8);
  ctx.fillStyle = "#fff";
  ctx.fillRect(camX + canvas.width/2-150-100, camY + 300, 200, 50);
  ctx.fillStyle = "#888";
  ctx.fillText("Spawn enemy", camX + canvas.width/2-150-100 + 30, camY + 300 + 30, 200, 50);
}
