// update, tick

// TODO: lägg alla draw-funktioner i separat så att frames inte är bundna med ticks

function update() {
  ctx.save();
  resize();

  tickCharacter(chars);
  tickCoin(coins);
  tickEnemies(enemies);
  tickBombs(bombs);
  tickArrows(arrows);
  // CALCULATE VIEWPOINT FOR EACH AND EVERY PLAYER
  calculateViewPoint(chars);

  if (menuActive) { menuUpdate(); }
  drawCursor();

  ctx.restore();
}

// 1. Map
// 2. Alla entities (enemies, character, projectiles), inklusive träd, ska drawas i ordning från posY = 0 till posY = canvas.height
// 3. HP-mätare, GUI
// 4. ESC-meny
// 5. Cursor

//TODO: gör träd transparent om man är bakom dem

function draw() {
  // Drawar alla entities efter värdet på dess posY, från högt till lågt
  // Lägger först alla objekt som ska målas i en och samma array, och sorterar dem efter storlek på posY, och callar sist alla deras individuella draw()-funktioner.
  let drawOrder = [];
  for (i = 0; i < chars.length; i++) {
    if (chars[i].posX < camX + canvas.width + tileSize && chars[i].posX + chars[i].width > camX - tileSize && chars[i].posY < camY + canvas.height + tileSize && chars[i].posY + chars[i].height > camY - tileSize) {
      drawOrder.push(chars[i]);
    }
  }
  // drawOrder.push(Wizard);
  for (i = 0; i < treesArray.length; i++) {
    if (treesArray[i].posX < camX + canvas.width + tileSize && treesArray[i].posX + treesArray[i].width > camX - tileSize && treesArray[i].posY < camY + canvas.height + tileSize && treesArray[i].posY + treesArray[i].height > camY - tileSize) {
      drawOrder.push(treesArray[i]);
    }
  }
  for (i = 0; i < enemies.length; i++) {
    if (enemies[i].posX < camX + canvas.width + tileSize && enemies[i].posX + enemies[i].width > camX - tileSize && enemies[i].posY < camY + canvas.height + tileSize && enemies[i].posY + enemies[i].height > camY - tileSize) {
      drawOrder.push(enemies[i]);
    }
  }
  for (i = 0; i < coins.length; i++) {
    if (coins[i].posX < camX + canvas.width + tileSize && coins[i].posX + coins[i].width > camX - tileSize && coins[i].posY < camY + canvas.height + tileSize && coins[i].posY + coins[i].height > camY - tileSize) {
      drawOrder.push(coins[i]);
    }
  }
  for (i = 0; i < arrows.length; i++) {
    if (arrows[i].posX < camX + canvas.width + tileSize && arrows[i].posX + arrows[i].width > camX - tileSize && arrows[i].posY < camY + canvas.height + tileSize && arrows[i].posY + arrows[i].height > camY - tileSize) {
      drawOrder.push(arrows[i]);
    }
  }
  for (i = 0; i < bombs.length; i++) {
    if (bombs[i].posX < camX + canvas.width + tileSize && bombs[i].posX + bombs[i].width > camX - tileSize && bombs[i].posY < camY + canvas.height + tileSize && bombs[i].posY + bombs[i].height > camY - tileSize) {
      drawOrder.push(bombs[i]);
    }
  }
  for (i = 0; i < particles.length; i++) {
    if (particles[i].posX < camX + canvas.width + tileSize && particles[i].posX + particles[i].width > camX - tileSize && particles[i].posY < camY + canvas.height + tileSize && particles[i].posY + particles[i].height > camY - tileSize) {
      drawOrder.push(particles[i]);
    }
  }
  drawOrder.sort(function(a, b) {
    return (a.posY + a.height) - (b.posY + b.height);
  });
  for (i = 0; i < drawOrder.length; i++) {
    drawOrder[i].draw();
  }
  ctx.fillText(drawOrder.length, camX + canvas.width/2, camY + 100);
}

setInterval(update, 1000 / fps);

// draw functions

//resize canvas to window size
function resize() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  ctx.imageSmoothingEnabled = false;
  offsetMaxX = mapSizeX - canvas.width;
  offsetMaxY = mapSizeY - canvas.height;
}

function drawMap() {
  for (let i = 0; i < mapArray.length; i++) {
    let posX = 0;
    let posY = i * tileSize;
    for (let j = 0; j < mapArray[i].length; j++) {
      //laddar endast synliga tiles
      if ((j - 1) * tileSize < camX + ctx.canvas.width && (j + 1) * tileSize > camX && (i - 1) * tileSize < camY + ctx.canvas.height && (i + 1) * tileSize > camY) {
        ctx.drawImage(tile_map, (mapArray[i][j] % 8) * 8, Math.floor(mapArray[i][j] / 8) * 8, 8, 8, posX, posY, tileSize + 1, tileSize + 1);
      }
      posX += tileSize;
    }
  }
}

function getRandom() {
  return Math.random();
}
