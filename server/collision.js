let map = require('./map.js');

exports.checkObjectCollision = function (object) {
  let tiles = tilesSurrounding (object.posX, object.posY, object.width, object.height);
  for (var i = 0; i < tiles.width; i++) {
    for (let j = 0; j < tiles.height; j++) {
      if (isTileWall (tiles.x + i, tiles.y + j, object.canSwim)) {
        if (!!checkTileCollision (tiles.x + i, tiles.y + j, object)) {
          return;
        }
      }
    }
  }
}

// checks which tiles are in direct collision with the entity.


function tilesSurrounding(posX, posY, width, height) {
  let tileX = Math.floor(posX / map.tilesize);
  let tileY = Math.floor(posY / map.tilesize);
  if (posX < 0) {
    tileX--;
  }
  if (posY < 0) {
    tileY--;
  }
  let colWidth = 1 + Math.floor(width / map.tilesize);
  let colHeight = 1 + Math.floor(height / map.tilesize);
  return { x: tileX, y: tileY, width: colWidth, height: colHeight };
}

function isTileWall(i, j, canSwim) {
  if (i < 0 || j < 0) {
    return true;
  } else if ((i >= map.riverMap.width || i < 0 || j >= map.riverMap.height || j < 0)) {
    return true;
  } else if (map.riverMap.matrix[j][i] === 6) {
    return true;
  } else if (map.riverMap.matrix[j][i] === 7) {
    return !canSwim;
  } else {
    return false;
  }
}

function checkTileCollision(i, j, object) {
  let colDistanceX = (i * map.tilesize + map.tilesize / 2) - (object.posX + object.width / 2);
  let colDistanceY = (j * map.tilesize + map.tilesize / 2) - (object.posY + object.height / 2);
  if (Math.abs(colDistanceX) < object.width/2 + map.tilesize / 2 && Math.abs(colDistanceY) < object.height / 2 + map.tilesize / 2) {
    if (!!object.collision(i, j, colDistanceX, colDistanceY)) {
      return true;
    }
  }
}

exports.checkForPlayerDmg = function (obj1, obj2) {
  if (obj1.posX < obj2.posX + obj2.width && obj1.posX + obj1.width > obj2.posX) {
    if (obj1.posY < obj2.posY + obj2.height && obj1.posY + obj1.height > obj2.posY) {
      if (Date.now() - 500 > lastHit || lastHit === 0) {
        obj2.hp -= obj1.dmg;
        canGetDmg = false;
        lastHit = Date.now();
      }
    }
  }
}

exports.checkCircularEntityCollision = function (obj1, obj2) {
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
