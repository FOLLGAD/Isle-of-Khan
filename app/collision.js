function checkObjectCollision(object) {
  tilesSurrounding(object.posX, object.posY, object);
  for (var i = 0; i < colWidth; i++) {
    for (let j = 0; j < colHeight; j++) {
      if (isTileWall(tileX + i, tileY + j, object.canSwim)) {
        if (!!checkTileCollision(tileX + i, tileY + j, object)) {
          return;
        }
      }
    }
  }
}

// checks which tiles are in direct collision with the entity.

function tilesSurrounding(posX, posY, object) {

  tileX = (posX - posX % tileSize) / tileSize;
  if (posX < 0) {
    tileX--;
  }
  tileY = (posY - posY % tileSize) / tileSize;
  if (posY < 0) {
    tileY--;
  }

  colWidth = 1 + (posX + object.width - (posX + object.width) % tileSize) / tileSize - tileX;
  colHeight = 1 + (posY + object.height - (posY + object.height) % tileSize) / tileSize - tileY;
}

function isTileWall(i, j, canSwim) {
  if (i >= tileMapWidth || i < 0 || j >= tileMapHeight || j < 0) {
    return true;
  } else if (mapArray[j][i] == 6) {
    return true;
  } else if (mapArray[j][i] == 7) {
    return !canSwim;
  } else {
    return false;
  }
}

function checkTileCollision(i, j, object) {
  let colDistanceX = (i * tileSize + tileSize / 2) - (object.posX + object.width / 2);
  let colDistanceY = (j * tileSize + tileSize / 2) - (object.posY + object.height / 2);
  if (Math.abs(colDistanceX) < object.width/2 + tileSize / 2 && Math.abs(colDistanceY) < object.height / 2 + tileSize / 2) {
    if (!!object.collision(i, j, colDistanceX, colDistanceY)) {
      return true;
    }
  }
}

function checkForPlayerDmg(i) {
  if (enemies[i].posX < chars[0].posX + chars[0].width && enemies[i].posX + enemies[i].width > chars[0].posX) {
    if (enemies[i].posY < chars[0].posY + chars[0].height && enemies[i].posY + enemies[i].height > chars[0].posY) {
      let d = new Date();
      if (d.getTime() - 500 > lastHit || lastHit == 0) {
        chars[0].hp -= enemies[i].dmg;
        canGetDmg = false;
        lastHit = d.getTime();
      }
    }
  }
}

function checkCircularEntityCollision(obj1, obj2) {
  let disX = obj1.posX + obj1.width / 2 - obj2.posX - obj2.width / 2;
  let disY = obj1.posY + obj1.height / 2 - obj2.posY - obj2.height / 2;
  let hyp = Math.sqrt(disX * disX + disY * disY);
  if (hyp < obj1.radius) {
    let direction = Math.atan2(disX, disY);
    let intensity = (5 + (obj1.radius - hyp)) / 3;
    let dmg = obj1.dmg * intensity;
    let knockback = intensity;
    obj2.getDamaged(direction, dmg, knockback);
  }
}
