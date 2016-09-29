//TODO: lägg till så att alla entities blir rendered i olika ordning beroende på sina Y-värden så det ser ut som att man är bakom den

// update, tick

// TODO: lägg alla draw-funktioner i separat så att frames inte är bundna med ticks

function update() {
  ctx.save();
  resize();

  chars[0].tick();
  tickCoin();
  tickEnemies();
  tickArrows();
  // Tick all objects before viewPoint.
    viewPoint();
    drawMap();
  // Draw all objects after viewPoint.
  draw();
  drawHp();
  drawGui();
  
  if (menuActive) { menuUpdate(); }
  drawCursor();

  ctx.restore();
}

//  Vad ska drawas?
// 1. Map
// 2. Alla entities (enemies, character, projectiles), inklusive träd, ska drawas i ordning från posY = 0 till posY = canvas.height
   // Varje entitys ska börja vid ((posY eller posY + height))??
// 3. HP-mätare, GUI
// 4. ESC-meny
// 5. Cursor

//TODO: gör träd transparent om man är bakom dem

function draw() {
  // Drawar alla entities efter värdet på dess posY, från högt till lågt
  // Lägger först alla objekt som ska målas i en och samma array, och sorterar dem efter storlek på posY, och callar sist alla deras individuella draw()-funktioner.
  let drawOrder = [];
  drawOrder.push(chars[0]);
  drawOrder.push(Wizard);
  for (i = 0; i < treesArray.length; i++) {
    drawOrder.push(treesArray[i]);
  }
  for (i = 0; i < enemies.length; i++) {
    drawOrder.push(enemies[i]);
  }
  for (i = 0; i < arrows.length; i++) {
    drawOrder.push(arrows[i]);
  }
  for (i = 0; i < coins.length; i++) {
    drawOrder.push(coins[i]);
  }
  drawOrder.sort(function(a, b) {
    return (a.posY + a.height) - (b.posY + b.height);
  });
  for (i = 0; i < drawOrder.length; i++) {
    drawOrder[i].draw();
  }
}

setInterval(update, 1000/fps);

// draw functions

//resize canvas to window size
function resize() {
  ctx.canvas.width  = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  ctx.imageSmoothingEnabled = false;
  offsetMaxX = mapSizeX - canvas.width;
  offsetMaxY = mapSizeY - canvas.height;
}

//DONE:30 lägg till så att endast tiles synliga på canvas + buffer på ett block blir rendered varje frame
function drawMap(){
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

// TODO: Lägg alla clickables som objekt i en array, och använd sedan x och y-pos för att räkna ut kollision med musklick

function getRandom() {
  return Math.random();
}
