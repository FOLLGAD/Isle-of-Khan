// draw functions
function drawMap (){
  for (var i = 0; i < mapArray.length; i++) {
    for (var j = 0; j < mapArray[i].length; j++) {
      ctx.drawImage(tile_map, (mapArray[i][j] % 2) * 8, Math.floor(mapArray[i][j] / 2) * 8, 8, 8, posX, posY, tileSize + 1, tileSize + 1);
      posX += tileSize;
    }
    posX = 0;
    posY += tileSize;
  }
  posX = 0;
  posY = 0;
}
function drawCrossHair() {
  ctx.drawImage(crosshair, mousePosX + camX - 0, mousePosY + camY, 5 * 6, 6 * 6)
}


// for testing;
function spawnMonster() {

}

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
  ctx.fillText(camX + ", " + camY, camX + 100, camY + 100);
  drawHp();
  drawCrossHair();
  ctx.fillText(charX + ", " + charY, camX + 100, camY + 200);
  ctx.restore();
}

setInterval(update, 1000/fps);
