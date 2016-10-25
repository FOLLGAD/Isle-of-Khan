let serv = require('../server.js');
let map = serv.map;

exports.checkObjectCollision = function (object) {
  if (object.posX + object.width > map.width * map.tilesize) { object.posX = map.width * map.tilesize - object.width; }
  if (object.posX < 0) { object.posX = 0; }
  if (object.posY + object.height > map.height * map.tilesize) { object.posY = map.height * map.tilesize - object.height; }
  if (object.posY < 0) { object.posY = 0; }
  let tiles = tilesSurrounding(object.posX, object.posY, object.width, object.height);
  for (var i = 0; i < tiles.width; i++) {
    for (let j = 0; j < tiles.height; j++) {
      if (isTileWall(tiles.x + i, tiles.y + j, object.canSwim)) {
        checkTileCollision(tiles.x + i, tiles.y + j, object);
      }
    }
  }
};

exports.checkArrowTileCollision = function (object, array) {
  let tiles = tilesSurrounding(object.posX, object.posY, object.width, object.height);
  for (let i = 0; i < tiles.width; i++) {
    for (let j = 0; j < tiles.height; j++) {
      if (isTileWall(tiles.x + i, tiles.y + j, object.canSwim)) {
        object.collision(array);
      }
    }
  }
};

exports.areTilesFree = function (x, y, width, height) {
  let tiles = tilesSurrounding(x, y, width, height);
  for (var i = 0; i < tiles.width; i++) {
    for (let j = 0; j < tiles.height; j++) {
      return isTileWall(tiles.x + i, tiles.y + j, false);
    }
  }
};

// remake for specifically arrows.

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
  if (i < 0 || j < 0 || i >= map.width || j >= map.height) {
    return true;
  } else if (map.layers[0].data[j * map.width + i] === 6 + 1) {
    return true;
  } else if (map.layers[0].data[j * map.width + i] === 7 + 1) {
    return !canSwim;
  } else {
    return false;
  }
}

function checkTileCollision(i, j, object) {
  let colDistanceX = (i * map.tilesize + map.tilesize / 2) - (object.posX + object.width / 2);
  let colDistanceY = (j * map.tilesize + map.tilesize / 2) - (object.posY + object.height / 2);
  if (Math.abs(colDistanceX) < object.width / 2 + map.tilesize / 2 && Math.abs(colDistanceY) < object.height / 2 + map.tilesize / 2) {
    if (!!object.collision(i, j, colDistanceX, colDistanceY)) {
      return true;
    }
  }
}

exports.checkForPlayerDmg = function (obj1, obj2) {
  if (obj1.posX < obj2.posX + obj2.width && obj1.posX + obj1.width > obj2.posX) {
    if (obj1.posY < obj2.posY + obj2.height && obj1.posY + obj1.height > obj2.posY) {
      if (Date.now() - 500 > obj2.lastHit || obj2.lastHit === 0) {
        obj2.hp -= obj1.dmg;
        obj2.canGetDmg = false;
        obj2.lastHit = Date.now();
      }
    }
  }
};

exports.checkCircularEntityCollision = function (obj1, obj2, owner) {
  let disX = obj1.posX + obj1.width / 2 - obj2.posX - obj2.width / 2;
  let disY = obj1.posY + obj1.height / 2 - obj2.posY - obj2.height / 2;
  let hyp = Math.sqrt(disX * disX + disY * disY);
  if (hyp < obj1.radius) {
    let direction = Math.atan2(disX, disY);
    let intensity = (20 + Math.abs(obj1.radius - hyp));
    let dmg = Math.round(obj1.dmg * intensity);
    let knockback = Math.round(intensity);
    obj2.getDamaged(direction, dmg, owner, knockback);
  }
};
