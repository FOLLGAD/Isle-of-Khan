function checkObjectCollision(object) {
  tilesSurrounding(object.posX, object.posY, object);
  for (var i = 0; i < colWidth; i++) {
    for (let j = 0; j < colHeight; j++) {
      if (isTileWall(tileX + i, tileY + j, object.canSwim)) {
        checkTileCollision(tileX + i, tileY + j, object);
      }
    }
  }
}

//checks which tiles are in direct collision with the player

function tilesSurrounding(posX, posY, object) {
  tileX = (posX - posX % tileSize) / tileSize;
  tileY = (posY - posY % tileSize) / tileSize;

  colWidth = 1 + (posX + object.width - (posX + object.width) % tileSize) / tileSize - tileX;
  colHeight = 1 + (posY + object.height - (posY + object.height) % tileSize) / tileSize - tileY;
}

function isTileWall(i, j, canSwim) {
  if (i >= tileMapWidth || i < 0 || j >= tileMapHeight || j < 0) {
    return false;
  }
  if (mapArray[j][i] == 6) {
    return true;
  } else if (mapArray[j][i] == 7) {
    return !canSwim;
  } else {
    return false;
  }
}

function checkTileCollision(i, j, object) {
  let colDistanceX = (i * tileSize + tileSize / 2) - (object.posX + object.width / 2);
  let colDistanceY = (j * tileSize + tileSize / 2) - (object.posY + object.width / 2);
  if (Math.abs(colDistanceX) < object.width/2 + tileSize / 2 && Math.abs(colDistanceY) < object.width / 2 + tileSize / 2) {
    object.collision(i, j, colDistanceX, colDistanceY);
  }
}

function checkForPlayerDmg(i) {
  if (enemies[i].posX < Character.posX + Character.width && enemies[i].posX + enemies[i].width > Character.posX) {
    if (enemies[i].posY < Character.posY + Character.height && enemies[i].posY + enemies[i].height > Character.posY) {
      let d = new Date();
      if (d.getTime() - 500 > lastHit || lastHit == 0) {
        Character.hp -= enemies[i].dmg;
        canGetDmg = false;
        lastHit = d.getTime();
      }
    }
  }
}
