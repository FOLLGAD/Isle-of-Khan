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
  ctx.drawImage(crosshair, mousePosX + camX - 7 / 2 * 8, mousePosY + camY - 7 / 2 * 8, 7 * 8, 7 * 8)
}

// update, tick
function update() {
  //TODO:0 enemies & HP
  //TODO:10 slå med musklick/space
  //TODO:20 slåanimation
  ctx.save();
  viewPoint();
  ctx.clearRect(-camX, -camY, canvas.width, canvas.height); //Clears viewPoint
  drawMap();
  drawCoin();
  walk();
  ctx.fillText(camX + ", " + camY, camX + 100, camY + 100);
  drawCrossHair();
  ctx.fillText(charX + ", " + charY, 200, 200);
  ctx.restore();
}

setInterval(update, 1000/fps);
