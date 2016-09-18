
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

function isTileWall(i, j) {
  if (mapArray[i][j] == 3) {
    return true;
  } else {
    return false;
  }
}

// checkar om spelaren går in i en vägg och sätter collision = true och annat skit

function checkTileCollision(i, j) {
  if(charX + charVelX + charWidth > j * tileSize && charX + charVelX < j * tileSize + tileSize) {
    collisionY = true;
  }
  if(charY + charVelY + charHeight  > i * tileSize && charY + charVelY < i * tileSize + tileSize) {
    collisionX = true;
  }
  if (collisionX && collisionY) {
    collision = true;

    if(charVelX > 0) {
      charX = j * tileSize - charWidth;
    } else if (charVelX < 0) {
      charX = j * tileSize + tileSize;
    }

    if(charVelY > 0) {
      charY = i * tileSize - charHeight;
    } else if (charVelY < 0) {
      charY = i * tileSize + tileSize;
    }
  }
  console.log(collision, collisionX, collisionY);
  collisionX = false;
  collisionY = false;
}

function drawCollision() {
  ctx.rect(charX, charY, charWidth, charHeight);
  ctx.stroke();
  ctx.rect(567, 64, tileSize, tileSize);
  ctx.stroke();
}

function viewPoint() {


  camX = charX + charWidth / 2 - canvas.width / 2;
  camY = charY + charHeight / 2 - canvas.height / 2;

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
