// update, tick

// TODO: lägg alla draw-funktioner i separat så att frames inte är bundna med ticks

function update() {
  tickCharacter(chars);
  tickCoin(coins);
  tickEnemies(enemies);
  tickBombs(bombs);
  tickArrows(arrows);
  // CALCULATE VIEWPOINT FOR EACH AND EVERY PLAYER
  calculateViewPoint(chars);
}

let renderDistance = 600;

function createEntityPacket(object) {
  let drawOrder = [];
  for (i = 0; i < chars.length; i++) {
    if (chars[i].posX < camX + renderDistance * 2 && chars[i].posX + renderDistance * 2 > camX && chars[i].posY < camY + renderDistance * 2 && chars[i].posY + chars[i].height > camY - tileSize) {
      drawOrder.push(chars[i]);
    }
  }
  // drawOrder.push(Wizard);
  for (i = 0; i < treesArray.length; i++) {
    if (treesArray[i].posX < camX + renderDistance && treesArray[i].posX + treesArray[i].width > camX && treesArray[i].posY < camY + renderDistance && treesArray[i].posY + treesArray[i].height > camY) {
      drawOrder.push(treesArray[i]);
    }
  }
  for (i = 0; i < enemies.length; i++) {
    if (enemies[i].posX < camX + renderDistance && enemies[i].posX + enemies[i].width > camX && enemies[i].posY < camY + renderDistance && enemies[i].posY + enemies[i].height > camY) {
      drawOrder.push(enemies[i]);
    }
  }
  for (i = 0; i < coins.length; i++) {
    if (coins[i].posX < camX + renderDistance && coins[i].posX + coins[i].width > camX && coins[i].posY < camY + renderDistance && coins[i].posY + coins[i].height > camY) {
      drawOrder.push(coins[i]);
    }
  }
  for (i = 0; i < arrows.length; i++) {
    if (arrows[i].posX < camX + renderDistance && arrows[i].posX + arrows[i].width > camX && arrows[i].posY < camY + renderDistance && arrows[i].posY + arrows[i].height > camY) {
      drawOrder.push(arrows[i]);
    }
  }
  for (i = 0; i < bombs.length; i++) {
    if (bombs[i].posX < camX + renderDistance && bombs[i].posX + bombs[i].width > camX && bombs[i].posY < camY + renderDistance && bombs[i].posY + bombs[i].height > camY) {
      drawOrder.push(bombs[i]);
    }
  }
  for (i = 0; i < particles.length; i++) {
    if (particles[i].posX < camX + renderDistance && particles[i].posX + particles[i].width > camX && particles[i].posY < camY + renderDistance && particles[i].posY + particles[i].height > camY) {
      drawOrder.push(particles[i]);
    }
  }
  // Kanske flytta sort-funktion till clientside, for fuckall reasons
  drawOrder.sort(function(a, b) {
    return (a.posY + a.height) - (b.posY + b.height);
  });
  io.clients[object.id].send("packet", drawOrder);
  console.log(drawOrder.length);
}

setInterval(update, 1000 / fps);

function drawMap() {
  for (let i = 0; i < mapArray.length; i++) {
    let posX = 0;
    let posY = i * tileSize;
    for (let j = 0; j < mapArray[i].length; j++) {
      //laddar endast synliga tiles
      if ((j - 1) * tileSize < camX + renderDistance && (j + 1) * tileSize > camX && (i - 1) * tileSize < camY + renderDistance && (i + 1) * tileSize > camY) {
        ctx.drawImage(tile_map, (mapArray[i][j] % 8) * 8, Math.floor(mapArray[i][j] / 8) * 8, 8, 8, posX, posY, tileSize + 1, tileSize + 1);
      }
      posX += tileSize;
    }
  }
}

function getRandom() {
  return Math.random();
}
