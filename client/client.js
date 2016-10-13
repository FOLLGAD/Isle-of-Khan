let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let minimap = {};
minimap.canvas = document.getElementById("minimap");
minimap.ctx = minimap.canvas.getContext("2d");

let socket = io();

let gameMap = {};
let tileSize = 64;
let menuActive = false;
let mousePosX;
let mousePosY;

let clientID;
socket.on('initialize', function (data) {
  gameMap.matrix = data.matrix;
  gameMap.width = data.width;
  gameMap.height = data.height;
  clientID = data.id;
  console.log("Your client ID is", clientID);
  drawMinimap();
});

function register(regName) {
  socket.emit('register', regName);
}

ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

minimap.ctx.canvas.width = gameMap.width;
minimap.ctx.canvas.height = gameMap.height;

minimap.scale = 2;

let asdf = false;

let Players = {};
  let Trees = [];
  let Enemies = [];
  let Coins = [];
  let Arrows = [];
  let Bombs = [];

  let Particles = [];

socket.on('packet', function (packet) {
  Players = {};
  Trees = [];
  Enemies = [];
  Coins = [];
  Arrows = [];
  Bombs = [];
  for (let i = 0; i < packet.players.length; i++) {
    Players[packet.players[i].id] = new Character(packet.players[i]);
  }
  for (let i = 0; i < packet.trees.length; i++) {
    Trees.push(new Tree(packet.trees[i]));
  }
  for (let i = 0; i < packet.enemies.length; i++) {
    Enemies.push(new Enemy(packet.enemies[i]));
  }
  for (let i = 0; i < packet.coins.length; i++) {
    Coins.push(new Coin(packet.coins[i]));
  }
  for (let i = 0; i < packet.arrows.length; i++) {
    Arrows.push(new Arrow(packet.arrows[i]));
  }
  for (let i = 0; i < packet.bombs.length; i++) {
    Bombs.push(new Bomb(packet.bombs[i]));
  }
  if (!asdf) {
    update();
    asdf = true;
  }
});

let Img = {};
  Img.char = new Image();
  Img.char.src = '/resources/char.png';
  Img.enemy = new Image();
  Img.enemy.src = '/resources/enemy.png';
  Img.tilemap = new Image();
  Img.tilemap.src = '/resources/tile-map.png';
  Img.tree = new Image();
  Img.tree.src = '/resources/tree.png';
  Img.arrow = new Image();
  Img.arrow.src = '/resources/arrow.png';
  Img.coin = new Image();
  Img.coin.src = '/resources/coin.png';
  Img.wizard = new Image();
  Img.wizard.src = '/resources/wizard.png';
  Img.menuButton = new Image();
  Img.menuButton.src = '/resources/menu-button.png';
  Img.options = new Image();
  Img.options.src = '/resources/options.png';
  Img.crosshair = new Image();
  Img.crosshair.src = '/resources/crosshair.png';
  Img.bomb = new Image();
  Img.bomb.src = '/resources/bomb.png';
  Img.particle = new Image();
  Img.particle.src = '/resources/particle.png';

// event handlers
document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  canvas.addEventListener("mousedown", mouseDownHandler, false);
  canvas.addEventListener("mouseup", mouseUpHandler, false);
  canvas.addEventListener("mousemove", nameMousePos, false);

  function keyDownHandler(e) {
    if (e.keyCode == 68) {
      socket.emit('key-press', { inputkey: 'd', state: true });
    } else if (e.keyCode == 65) {
      socket.emit('key-press', { inputkey: 'a', state: true });
    } else if (e.keyCode == 87) {
      socket.emit('key-press', { inputkey: 'w', state: true });
    } else if (e.keyCode == 83) {
      socket.emit('key-press', { inputkey: 's', state: true });
    } else if (e.keyCode == 32) {
      socket.emit('key-press', { inputkey: 'space', state: true });
    } else if (e.keyCode == 70) {
      let direx = Math.atan2(camX - Players[clientID].posX - Players[clientID].width / 2 + mousePosX, camY - Players[clientID].posY - Players[clientID].height / 2 + mousePosY);
      socket.emit("bomb", direx)
    }
    else if (e.keyCode == 86) {
      socket.emit('key-press', { inputkey: 'v', state: true });
    }
    else if (e.keyCode == 27) {
      menuToggle();
    }
    else if (e.keyCode == 67) {
      socket.emit('key-press', { inputkey: 'c', state: true });
    }
    else if (e.keyCode == 66) {
      socket.emit('key-press', { inputkey: 'b', state: true });
    }
  }
  function keyUpHandler(e) {
    if (e.keyCode == 68) {
      socket.emit('key-press', { inputkey: 'd', state: false });
      frame = 0;
    }
    else if (e.keyCode == 65) {
      socket.emit('key-press', { inputkey: 'a', state: false });
      frame = 0;
    }
    else if (e.keyCode == 87) {
      socket.emit('key-press', { inputkey: 'w', state: false });
      frame = 0;
    }
    else if (e.keyCode == 83) {
      socket.emit('key-press', { inputkey: 's', state: false });
      frame = 0;
    }
    else if (e.keyCode == 32){
      socket.emit('key-press', { inputkey: 'space', state: false });
      frame = 0;
    }
    else if (e.keyCode == 86) {
      socket.emit('key-press', { inputkey: 'v', state: true });
    }
    else if (e.keyCode == 67) {
      socket.emit('key-press', { inputkey: 'c', state: false });
    }
    else if (e.keyCode == 66) {
      socket.emit('key-press', { inputkey: 'b', state: false });
    }
    else if (e.keyCode == 70) {
      socket.emit('key-press', { inputkey: 'f', state: false });
    }
  }
  let mouseDown = false;
  let lastMouseUpdate = Date.now();
  function nameMousePos(e) {
    let mousePos = getMousePos(e);
    mousePosX = mousePos.x;
    mousePosY = mousePos.y;
  };
  function getMousePos(e) {
    let rect = canvas.getBoundingClientRect();
    scaleX = canvas.width / rect.width;
    scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }
  function mouseDownHandler() {
    mouseDown = true;
    if (!menuActive) {
      let direction = Math.atan2(camX - Players[clientID].posX - Players[clientID].width / 2 + mousePosX, camY - Players[clientID].posY - Players[clientID].height / 2 + mousePosY);
      socket.emit('key-press', { inputkey: 'mousebutton', state: true, direction: direction });
    } else {
      checkMenuDown();
    }
  }
  function mouseUpHandler() {
    mouseDown = false;
    socket.emit('key-press', { inputkey: 'mousebutton', state: false });
    checkMenuUp();
  }

function draw() {
  for (let i = 0; i < gameMap.height; i++) {
    let posX = 0;
    let posY = i * tileSize;
    for (let j = 0; j < gameMap.width; j++) {
      if ((j - 1) * tileSize < camX + ctx.canvas.width && (j + 1) * tileSize > camX && (i - 1) * tileSize < camY + ctx.canvas.height && (i + 1) * tileSize > camY) {
        ctx.drawImage(Img.tilemap, (gameMap.matrix[i][j] % 8) * 8, Math.floor(gameMap.matrix[i][j] / 8) * 8, 8, 8, posX, posY, tileSize + 1, tileSize + 1);
      }
      posX += tileSize;
    }
  }
  let drawOrder = [];
  for (let i in Players) {
    drawOrder.push(Players[i]);
  }
  for (let i = 0; i < Trees.length; i++) {
    if (Trees[i].posX < camX + canvas.width + tileSize && Trees[i].posX + Trees[i].width > camX - tileSize && Trees[i].posY < camY + canvas.height + tileSize && Trees[i].posY + Trees[i].height > camY - tileSize) {
      drawOrder.push(Trees[i]);
    }
  }
  for (let i = 0; i < Enemies.length; i++) {
    if (Enemies[i].posX < camX + canvas.width + tileSize && Enemies[i].posX + Enemies[i].width > camX - tileSize && Enemies[i].posY < camY + canvas.height + tileSize && Enemies[i].posY + Enemies[i].height > camY - tileSize) {
      drawOrder.push(Enemies[i]);
    }
  }
  for (let i = 0; i < Coins.length; i++) {
    if (Coins[i].posX < camX + canvas.width + tileSize && Coins[i].posX + Coins[i].width > camX - tileSize && Coins[i].posY < camY + canvas.height + tileSize && Coins[i].posY + Coins[i].height > camY - tileSize) {
      drawOrder.push(Coins[i]);
    }
  }
  for (let i = 0; i < Arrows.length; i++) {
    if (Arrows[i].posX < camX + canvas.width + tileSize && Arrows[i].posX + Arrows[i].width > camX - tileSize && Arrows[i].posY < camY + canvas.height + tileSize && Arrows[i].posY + Arrows[i].height > camY - tileSize) {
      drawOrder.push(Arrows[i]);
    }
  }
  for (let i = 0; i < Bombs.length; i++) {
    if (Bombs[i].posX < camX + canvas.width + tileSize && Bombs[i].posX + Bombs[i].width > camX - tileSize && Bombs[i].posY < camY + canvas.height + tileSize && Bombs[i].posY + Bombs[i].height > camY - tileSize) {
      drawOrder.push(Bombs[i]);
    }
  }
  for (let i = 0; i < Particles.length; i++) {
    if (Particles[i].posX < camX + canvas.width + tileSize && Particles[i].posX + Particles[i].width > camX - tileSize && Particles[i].posY < camY + canvas.height + tileSize && Particles[i].posY + Particles[i].height > camY - tileSize) {
      drawOrder.push(Particles[i]);
    }
  }
  drawOrder.sort(function(a, b) {
    return (a.posY + a.height) - (b.posY + b.height);
  });
  for (i = 0; i < drawOrder.length; i++) {
    drawOrder[i].draw(Img[drawOrder[i].img]);
  }
  // console.log(drawOrder.length);
}

let camX;
let camY;

function viewPort() {
  let vpMinx = 0;
  let vpMiny = 0;
  let vpMaxx = gameMap.width * 64 - ctx.canvas.width;
  let vpMaxy = gameMap.height * 64 - ctx.canvas.height;
  camX = Players[clientID].posX + Players[clientID].width / 2 - ctx.canvas.width / 2;
  camY = Players[clientID].posY + Players[clientID].width / 2 - ctx.canvas.height / 2;
  if (camX > vpMaxx) {
    camX = vpMaxx;
  } else if (camX < 0) {
    camX = 0;
  }
  if (camY > vpMaxy) {
    camY = vpMaxy;
  } else if (camY < 0) {
    camY = 0;
  }
  ctx.translate(-camX, -camY)
}

function resize() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  ctx.imageSmoothingEnabled = false;
  offsetMaxX = gameMap.width * tileSize - ctx.canvas.width;
  offsetMaxY = gameMap.height * tileSize - ctx.canvas.height;
}

function drawMinimap() {
  minimap.ctx.clearRect(0, 0, minimap.canvas.width, minimap.canvas.height);
  minimap.canvas.style.opacity = 0.8;
  let colorRep = {
    0: "#11A033",
    1: "#11A033",
    2: "#11A033",
    3: "#8FA3A2",
    4: "#8FA3A2",
    5: "#8FA3A2",
    6: "#006818",
    7: "#0075FD",
    8: "#11A033",
    9: "#11A033",
    10: "#11A033",
    11: "#8FA3A2",
    12: "#8FA3A2",
    13: "#8FA3A2",
    14: "#603000",
    15: null,
    16: "#11A033",
    17: "#11A033",
    18: "#11A033",
    19: "#8FA3A2",
    20: "#8FA3A2",
    21: "#8FA3A2"
  }
  minimap.ctx.canvas.width = gameMap.width * minimap.scale + 4;
  minimap.ctx.canvas.height = gameMap.height * minimap.scale + 4;
  minimap.ctx.lineWidth = 4;
  minimap.ctx.strokeRect(0, 0, minimap.ctx.canvas.width, minimap.ctx.canvas.height);
  for (let i = 0; i < gameMap.width; i++) {
    for (let j = 0; j < gameMap.height; j++) {
      minimap.ctx.fillStyle = colorRep[gameMap.matrix[j][i]];
      minimap.ctx.fillRect(i * minimap.scale + 2, j * minimap.scale + 2, minimap.scale, minimap.scale);
    }
  }
  for (let prop in Players) {
    minimap.ctx.fillStyle = "red";
    minimap.ctx.fillRect(Players[prop].posX / tileSize * minimap.scale + 2, Players[prop].posY / tileSize * minimap.scale + 2, minimap.scale * 2, minimap.scale * 2);
  }
}

function drawCursor() {
  ctx.drawImage(Img.crosshair, mousePosX + camX, mousePosY + camY, 30, 36);
}

function menuToggle() {
  menuActive = !menuActive;
}

function drawGui () {
  ctx.textAlign = "start";
  ctx.fillText("HP: " + Players[clientID].hp, 20 + camX, 50 + camY);
  ctx.fillText("Coins: " + Players[clientID].coins, 20 + camX, 100 + camY);
  ctx.fillText("Kills: " + Players[clientID].kills, 20 + camX, 150 + camY);
  ctx.fillText("Deaths: " + Players[clientID].deaths, 20 + camX, 200 + camY);
}

function menuButton (text, onClick, mode) {
  this.bColour = "#fff";
  this.tColour = "#000";
  this.width = 80 * 8;
  this.height = 8 * 8;
  this.posX = canvas.width / 2 - this.width / 2;
  this.posY = 200 + 150 * menuArray.indexOf(this);
  this.img = Img.menuButton;
  this.clickToggle = false;

  this.text = text;
  this.mode = mode;

  if (this.mode == "push") {
    this.onClick = onClick;
  } else {
    this.onClick = function() {
      this.clickToggle = !this.clickToggle;
      onClick();
    }
  }

  this.draw = function() {
    this.posY = 200 + 150 * menuArray.indexOf(this);
    ctx.fillStyle = this.bColour;
    ctx.drawImage(this.img, 0, this.down ? 8 : 0, this.width / 8, this.height / 8, this.posX + camX, this.posY + camY, this.width, this.height);
    ctx.fillStyle = this.bColour;
    ctx.textAlign = "center";
    let text = this.text;
    if (this.mode == "toggle") {
      let sik;
      if (this.clickToggle) {
        sik = "Off";
      } else {
        sik = "On";
      }
      text = text + sik;
    }
    ctx.fillText(text, this.posX + this.width / 2 + camX, this.posY + (this.down ? 45 : 37) + camY);
  }

  this.active = false;
  this.down = false;

  this.changeDown = function(bool) {
    this.down = bool;
  }

  this.onDown = function() {
    this.active = true;
    if (this.mode == "push") {
      if (!!this.timeOut) {
        clearTimeout(this.timeOut);
      }
      this.down = true;
    } else if (this.mode == "toggle") {
      this.down = true;
    }
  }

  this.onUp = function() {
    this.active = false;
    if (this.mode == "push") {
      if (!!this.timeOut) {
        clearTimeout(this.timeOut);
      }
      this.timeOut = setTimeout(function() { this.changeDown(false); this.timeOut = null; }.bind(this), 100);
    } else if (this.mode == "toggle") {
      this.down = this.clickToggle;
    }
  }

  this.onAbandoned = function() {
    this.active = false;
    if (this.mode == "push") {
      if (!!this.timeOut) {
        clearTimeout(this.timeOut);
      }
      this.down = false;
    } else if (this.mode == "toggle") {
      this.down = this.clickToggle;
    }
  }
}

let menuArray = [];
  menuArray.push(new menuButton("Kill Enemies", function() { console.log("kill enemies"); }, "push"));
  menuArray.push(new menuButton("Enemy Spawning: ", function() { console.log("toggle enemy spawn"); }, "toggle"));

function menuUpdate () {
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(camX, camY, canvas.width, canvas.height);
  ctx.drawImage(Img.options, 0, 0, 70, 8, camX + canvas.width / 2 - 70 * 8 / 2, camY + 100, 70 * 8, 8 * 8);
  ctx.fillStyle = "#fff";
  ctx.fillText("active: " + menuArray[1].active, canvas.width / 2, 700);
  ctx.fillText("down: " + menuArray[1].down, canvas.width / 2, 725);
  ctx.fillText("clickToggle: " + menuArray[1].clickToggle, canvas.width / 2, 750);
  ctx.fillText("enemies: " + Enemies.length, canvas.width / 2, 800);
  ctx.fillText("Arrows: " + Players[clientID].money, canvas.width / 2, 820);
  for (i = 0; i < menuArray.length; i++) {
    if (menuArray[i].active) {
      checkIfStillDown(menuArray[i]);
    }
    menuArray[i].draw();
  }
}

function Bomb (packet) {
  this.posX = packet.posX;
  this.posY = packet.posY;
  this.velX = packet.velX;
  this.velY = packet.velY;
  this.width = 64;
  this.height = 64;
  this.draw = function () {
    ctx.drawImage(Img.bomb, this.posX, this.posY, this.width, this.height);
  }
}
function Arrow (packet) {
  this.posX = packet.posX;
  this.posY = packet.posY;
  this.velX = packet.velX;
  this.velY = packet.velY;
  this.width = 16;
  this.height = 32;
  this.direction = packet.direction;
  this.draw = function() {
    ctx.save();
    ctx.translate(this.posX, this.posY);
    ctx.rotate(Math.PI - this.direction);
    ctx.drawImage(Img.arrow, -this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
  }
}
function Character (packet) {
  this.id = packet.id;
  this.username = packet.username;
  this.posX = packet.posX;
  this.posY = packet.posY;
  this.velX = packet.velX;
  this.velY = packet.velY;
  this.kills = packet.kills;
  this.deaths = packet.deaths;
  this.coins = packet.coins;
  this.hp = packet.hp;
  this.width = 64;
  this.height = 64;
  this.draw = function() {
    ctx.drawImage(Img.char, this.posX, this.posY - this.height, this.width, this.height * 2);
    ctx.font = "28px sans-serif";
    ctx.textAlign = "center";
    ctx.textColor = "white";
    ctx.fillText(this.username, this.posX + this.width / 2, this.posY + this.width / 2 - 102, 10 * 10, 10); //Username

    ctx.fillStyle = "black";
    ctx.fillRect(this.posX - 20, this.posY + this.width / 2 - 100, 10 * 10, 10);
    ctx.fillStyle = "green";
    ctx.fillRect(this.posX - 20, this.posY + this.width / 2 - 100, this.hp * 10, 10);
    ctx.fillStyle = "black";
  }
}
function Tree (packet) {
  this.posX = packet.posX;
  this.posY = packet.posY;
  this.width = 64;
  this.height = 64;
  this.draw = function () {
    ctx.drawImage(Img.tree, this.posX, this.posY - 64, this.width, this.height * 2);
  }
}
function Coin (packet) {
  this.posX = packet.posX;
  this.posY = packet.posY;
  this.width = 32;
  this.height = 32;
  this.draw = function() {
    ctx.drawImage(Img.coin, this.posX, this.posY, this.width, this.height);
  }
}
function Particle (posX, posY, velX, velY, size) {
  this.posX = posX;
  this.posY = posY;
  this.velX = velX;
  this.velY = velY;
  this.size = size;
  this.width = 64;
  this.height = 64;
  this.draw = function() {
    ctx.drawImage(Img.particle, this.posX, this.posY, this.width * this.size, this.height * this.size);
  }
}

function checkMenuUp () {
  if (menuActive) {
    let lMousePosX = mousePosX;
    let lMousePosY = mousePosY;
    for (i = 0; i < menuArray.length; i++) {
      if (menuArray[i].active) {
        if (lMousePosX > menuArray[i].posX && lMousePosX < menuArray[i].posX + menuArray[i].width && lMousePosY > menuArray[i].posY && lMousePosY < menuArray[i].posY + menuArray[i].height) {
          menuArray[i].onClick();
          menuArray[i].onUp();
        } else {
          menuArray[i].onAbandoned();
        }
      }
    }
  }
}

function checkIfStillDown (obj) {
  if (mouseDown) {
    // let lMousePosX = mousePosX;
    // let lMousePosY = mousePosY;
    // if (lMousePosX > obj.posX && lMousePosX < obj.posX + obj.width && lMousePosY > obj.posY && lMousePosY < obj.posY + obj.height) {
    // } else {
    // }
  } else {
    obj.onAbandoned();
  }
}

function checkMenuDown () {
  if (menuActive) {
    let lMousePosX = mousePosX;
    let lMousePosY = mousePosY;
    for (i = 0; i < menuArray.length; i++) {
      if (lMousePosX > menuArray[i].posX && lMousePosX < menuArray[i].posX + menuArray[i].width && lMousePosY > menuArray[i].posY && lMousePosY < menuArray[i].posY + menuArray[i].height) {
        menuArray[i].onDown();
      }
    }
  }
}

let lastTime = Date.now();
function update() {
  requestAnimationFrame(update);
  let deltaTime = Date.now() - lastTime;
  lastTime = Date.now();
  // clientSmoothing(deltaTime);
  ctx.save();
  resize();
  viewPort();
  ctx.clearRect(camX, camY, canvas.width, canvas.height);
  draw();
  drawGui();
  if (menuActive) menuUpdate();
  drawCursor();
  ctx.restore();
}

setInterval(function () {
  if (Players.hasOwnProperty(clientID)) {
    let direction = Math.atan2(camX - Players[clientID].posX - Players[clientID].width / 2 + mousePosX, camY - Players[clientID].posY - Players[clientID].height / 2 + mousePosY);
    socket.emit('key-press', { inputkey: 'direction-update', direction: direction });
  }
}, 200);

function clientSmoothing (deltaTime) {
  for (let i in Players) {
    Players[i].posX += Players[i].velX * deltaTime / 20;
    Players[i].posY += Players[i].velY * deltaTime / 20;
  }
  for (let i = 0; i < Enemies.length; i++) {
    Enemies[i].posX += Enemies[i].velX * deltaTime / 20;
    Enemies[i].posY += Enemies[i].velY * deltaTime / 20;
  }
  for (let i = 0; i < Arrows.length; i++) {
    Arrows[i].posX += Arrows[i].velX * deltaTime / 20;
    Arrows[i].posY += Arrows[i].velY * deltaTime / 20;
  }
  for (let i = 0; i < Bombs.length; i++) {
    Bombs[i].posX += Bombs[i].velX * deltaTime / 20;
    Bombs[i].posY += Bombs[i].velY * deltaTime / 20;
  }
}

setInterval(drawMinimap, 100);
