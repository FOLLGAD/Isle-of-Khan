// viewPoint, camera
// let tileMapWidth = riverMap[0].length;
// let tileMapHeight = riverMap.length;
//
// let mapSizeX = tileMapWidth * tileSize;
// let mapSizeY = tileMapHeight * tileSize;

let offsetMinX = 0;
let offsetMinY = 0;

exports.calculateViewPoint = function (obj) {
  let camX = obj.posX + obj.width / 2;
  let camY = obj.posY + obj.height / 2;
  return { x: camX, y: camY };
};
