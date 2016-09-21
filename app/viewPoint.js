// viewPoint, camera

var tileMapWidth = mapArray[0].length;
var tileMapHeight = mapArray.length;

var mapSizeX = tileMapWidth * tileSize;
var mapSizeY = tileMapHeight * tileSize;

var offsetMaxX = mapSizeX - canvas.width;
var offsetMaxY = mapSizeY - canvas.height;
var offsetMinX = 0;
var offsetMinY = 0;

var camX = 0;
var camY = 0;

function checkCharCollision() {
  tilesSurrounding();
  for(i = 0; i < 4; i++) {
    if(isTileWall(tileX[i], tileY[i])) {
      checkTileCollision(tileX[i], tileY[i]);
    }
  }
}

//checks which tiles are in direct collision with the player

function tilesSurrounding() {
  tileX[0] = (charX - charX % tileSize) / tileSize;
  tileY[0] = (charY - charY % tileSize) / tileSize;
  tileX[1] = tileX[0] + 1;
  tileY[1] = tileY[0];
  tileX[2] = tileX[0];
  tileY[2] = tileY[0] + 1;
  tileX[3] = tileX[1];
  tileY[3] = tileY[2];
}

function isTileWall(i, j) {
  if (i >= tileMapWidth || i < 0) {
    return true;
  } else if (j >= tileMapHeight || j < 0) {
    return true;
  } else if (mapArray[j][i] == 6 || mapArray[j][i] == 7) {
    return true;
  } else {
    return false;
  }
}

function checkTileCollision(i, j) {
  var colDistanceX = (i * tileSize + tileSize / 2) - (charX + charWidth / 2);
  var colDistanceY = (j * tileSize + tileSize / 2) - (charY + charHeight / 2);

  if (Math.abs(colDistanceX) < Math.abs(colDistanceY)) {
    // Flyttas till ner/upp , Y-led
    if (colDistanceY > 0) {
      charY = j * tileSize - charWidth;
    } else {
      charY = j * tileSize + tileSize;
    }
  } else if (Math.abs(colDistanceX) > Math.abs(colDistanceY)) {
    // Flyttas till höger/vänster , X-led
    if (colDistanceX > 0) {
      charX = i * tileSize - charHeight;
    } else {
      charX = i * tileSize + tileSize;
    }
  }
}

//DONE:10 ladda träden som separata object som ritas efter karaktären, så det ser ut som att man är bakom dem.

function drawTrees() {
  var posX = 0;
  var posY = 0;
  for (var i = 0; i < mapArray.length; i++) {
    for (var j = 0; j < mapArray[i].length; j++) {
      if(mapArray[i][j] == 6) {
        ctx.drawImage(tree, j * tileSize, i * tileSize - tileSize, tileSize, tileSize * 2);
      }
      posX += tileSize;
    }
    posX = 0;
    posY += tileSize;
  }
}

function viewPoint() {
  camX = charX + charWidth / 2 - ctx.canvas.width / 2;
  camY = charY + charHeight / 2 - ctx.canvas.height / 2;

  if (camX > offsetMaxX) {
    camX = offsetMaxX;
  } else if (camX < offsetMinX) {
    camX = offsetMinX;
  }
  if (camY > offsetMaxY) {
    camY = offsetMaxY;
  } else if (camY < offsetMinY) {
    camY = offsetMinY;
  }
  ctx.translate(-camX, -camY);
}

function drawGui() {
  ctx.font = "40px Courier";
  ctx.fillText("Coins: " + points, camX + 50, camY + 80);
  ctx.font = "20px Courier";
}
