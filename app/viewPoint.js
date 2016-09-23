// viewPoint, camera

let tileMapWidth = mapArray[0].length;
let tileMapHeight = mapArray.length;

let mapSizeX = tileMapWidth * tileSize;
let mapSizeY = tileMapHeight * tileSize;

let offsetMaxX = mapSizeX - canvas.width;
let offsetMaxY = mapSizeY - canvas.height;
let offsetMinX = 0;
let offsetMinY = 0;

let camX = 0;
let camY = 0;

function checkObjectCollision(object) {
  tilesSurrounding(object.posX, object.posY);
  for(i = 0; i < 4; i++) {
    if(isTileWall(tileX[i], tileY[i])) {
      checkTileCollision(tileX[i], tileY[i], object);
    }
  }
}

//checks which tiles are in direct collision with the player

function tilesSurrounding(posX, posY) {
  tileX[0] = (posX - posX % tileSize) / tileSize;
  tileY[0] = (posY - posY % tileSize) / tileSize;
  tileX[1] = tileX[0] + 1;
  tileY[1] = tileY[0];
  tileX[2] = tileX[0];
  tileY[2] = tileY[0] + 1;
  tileX[3] = tileX[1];
  tileY[3] = tileY[2];
}

function isTileWall(i, j) {
  if (i >= tileMapWidth || i < 0 || j >= tileMapHeight || j < 0) {
    return true;
  } else if (mapArray[j][i] == 6 || mapArray[j][i] == 7) {
    return true;
  } else {
    return false;
  }
}

function checkTileCollision(i, j, object) {
  let colDistanceX = (i * tileSize + tileSize / 2) - (object.posX + object.width / 2);
  let colDistanceY = (j * tileSize + tileSize / 2) - (object.posY + object.height / 2);
  if (Math.abs(colDistanceX) < object.width && Math.abs(colDistanceY) < object.height) {
    object.collision(i, j, colDistanceX, colDistanceY);
  }
}

//DONE:20 ladda träden som separata object som ritas efter karaktären, så det ser ut som att man är bakom dem.

function drawTrees() {
  let posX = 0;
  let posY = 0;
  for (let i = 0; i < mapArray.length; i++) {
    for (let j = 0; j < mapArray[i].length; j++) {
      if(mapArray[i][j] == 6) {
        ctx.drawImage(tree, j * tileSize, i * tileSize - tileSize, tileSize, tileSize);
      }
      posX += tileSize;
    }
    posX = 0;
    posY += tileSize;
  }
}

function viewPoint() {
  camX = Character.posX + Character.width / 2 - ctx.canvas.width / 2;
  camY = Character.posY + Character.height / 2 - ctx.canvas.height / 2;

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
  //TODO: add inventory/hotbar with bow, sword and prehaps food
  ctx.font = "40px Courier";
  ctx.fillText("Coins: " + points, camX + 50, camY + 80);
  ctx.font = "20px Courier";
}
