//TODO: lägg till så att alla entities blir rendered i olika ordning beroende på sina Y-värden så det ser ut som att man är bakom den

// update, tick
function update() {
  //DONE:0 HP-bar
  ctx.save();
  resize();
  viewPoint();
  ctx.clearRect(-camX, -camY, canvas.width, canvas.height); //Clears viewPoint
  drawMap();
  tickCoin();
  tickEnemies();
  activate();
  Character.tick();
  drawEnemies();
  tickArrows();
  drawChar();
  Wizard.draw();
  drawTrees();
  drawHp();
  drawGui();
  ctx.drawImage(legs, Character.posX, Character.posY, Character.width*2, Character.height);
  if(menuActive) {menuUpdate();}
  drawCrossHair();
  ctx.fillText(camX + ", " + camY, camX + 50, camY + 120);
  ctx.fillText(Character.posX + ", " + Character.posY, camX + 50, camY + 140);
  ctx.restore();
}

setInterval(update, 1000/fps);

// draw functions

//resize canvas to window size
function resize() {
  ctx.canvas.width  = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  ctx.imageSmoothingEnabled = false;
}

//DONE:30 lägg till så att endast tiles synliga på canvas + buffer på ett block blir rendered varje frame
function drawMap(){
  let posX = 0;
  let posY = 0;
  for (let i = 0; i < mapArray.length; i++) {
    for (let j = 0; j < mapArray[i].length; j++) {
      //laddar endast synliga tiles
      if ((j - 1) * tileSize < camX + ctx.canvas.width && (j + 1) * tileSize > camX && (i - 1) * tileSize < camY + ctx.canvas.height && (i + 1) * tileSize > camY) {
        ctx.drawImage(tile_map, (mapArray[i][j] % 8) * 8, Math.floor(mapArray[i][j] / 8) * 8, 8, 8, posX, posY, tileSize + 1, tileSize + 1);
      }
      posX += tileSize;
    }
    posX = 0;
    posY += tileSize;
  }
}

function drawCrossHair() {
  ctx.drawImage(crosshair, mousePosX + camX - 0, mousePosY + camY, 5 * 6, 6 * 6);

}

function menuToggle() {
  if (menuActive) {
    menuActive = false;
  } else {
    menuActive = true;
  }
  menu = true;
}

function menuUpdate() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(camX, camY, canvas.width, canvas.height);
  ctx.drawImage(options, 0, 0, 70, 8, camX + canvas.width/2 - 70*8/2, camY + 100, 70*8, 8*8);
  ctx.fillStyle = "#fff";
  ctx.fillRect(camX + canvas.width/2-150-100, camY + 300, 200, 50);
  ctx.fillStyle = "#888";
  ctx.fillText("Spawn enemy", camX + canvas.width/2-150-100 + 30, camY + 300 + 30, 200, 50);
}

function getRandom() {
  return Math.random();
}
