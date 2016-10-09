let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

let socket = io();

let gameMap = [];
let tileSize = 64;
let menuActive = false;
let mousePosX;
let mousePosY;

let clientID;
socket.on('initialize', function (data) {
  gameMap = data.map;
  clientID = data.id;
  setInterval(update, 1000/60);
  console.log("Your client ID is", clientID);
});

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
  for (let yeahboi in packet.players) {
    Players[packet.players[yeahboi].id] = new Character(packet.players[yeahboi]);
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
  // drawOrder.sort(function(a, b) {
  //   return (a.posY + a.height) - (b.posY + b.height);
  // });
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
  document.addEventListener("mousedown", mouseDownHandler, false);
  document.addEventListener("mouseup", mouseUpHandler, false);
  document.addEventListener("mousemove", nameMousePos, false);

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
    if (mouseDown && Date.now() - lastMouseUpdate > 50) {
      lastMouseUpdate = Date.now();
      let direction = Math.atan2(camX - Players[clientID].posX - Players[clientID].width / 2 + mousePosX, camY - Players[clientID].posY - Players[clientID].height / 2 + mousePosY);
      console.log(direction);
      socket.emit('key-press', { inputkey: 'direction-update', direction: direction });
    }
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
  for (let i = 0; i < gameMap.length; i++) {
    let posX = 0;
    let posY = i * tileSize;
    for (let j = 0; j < gameMap[i].length; j++) {
      if ((j - 1) * tileSize < camX + ctx.canvas.width && (j + 1) * tileSize > camX && (i - 1) * tileSize < camY + ctx.canvas.height && (i + 1) * tileSize > camY) {
        ctx.drawImage(Img.tilemap, (gameMap[i][j] % 8) * 8, Math.floor(gameMap[i][j] / 8) * 8, 8, 8, posX, posY, tileSize + 1, tileSize + 1);
      }
      posX += tileSize;
    }
  }
  let drawOrder = [];
  for (let i in Players) {
    drawOrder.push(Players[i]);
  }
  for (i = 0; i < Trees.length; i++) {
    if (Trees[i].posX < camX + canvas.width + tileSize && Trees[i].posX + Trees[i].width > camX - tileSize && Trees[i].posY < camY + canvas.height + tileSize && Trees[i].posY + Trees[i].height > camY - tileSize) {
      drawOrder.push(Trees[i]);
    }
  }
  for (i = 0; i < Enemies.length; i++) {
    if (Enemies[i].posX < camX + canvas.width + tileSize && Enemies[i].posX + Enemies[i].width > camX - tileSize && Enemies[i].posY < camY + canvas.height + tileSize && Enemies[i].posY + Enemies[i].height > camY - tileSize) {
      drawOrder.push(Enemies[i]);
    }
  }
  for (i = 0; i < Coins.length; i++) {
    if (Coins[i].posX < camX + canvas.width + tileSize && Coins[i].posX + Coins[i].width > camX - tileSize && Coins[i].posY < camY + canvas.height + tileSize && Coins[i].posY + Coins[i].height > camY - tileSize) {
      drawOrder.push(Coins[i]);
    }
  }
  for (i = 0; i < Arrows.length; i++) {
    if (Arrows[i].posX < camX + canvas.width + tileSize && Arrows[i].posX + Arrows[i].width > camX - tileSize && Arrows[i].posY < camY + canvas.height + tileSize && Arrows[i].posY + Arrows[i].height > camY - tileSize) {
      drawOrder.push(Arrows[i]);
    }
  }
  for (i = 0; i < Bombs.length; i++) {
    if (Bombs[i].posX < camX + canvas.width + tileSize && Bombs[i].posX + Bombs[i].width > camX - tileSize && Bombs[i].posY < camY + canvas.height + tileSize && Bombs[i].posY + Bombs[i].height > camY - tileSize) {
      drawOrder.push(Bombs[i]);
    }
  }
  for (i = 0; i < Particles.length; i++) {
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
}

let camX;
let camY;

function viewPort() {
  let vpMinx = 0;
  let vpMiny = 0;
  let vpMaxx = gameMap[0].length * 64 - ctx.canvas.width;
  let vpMaxy = gameMap.length * 64 - ctx.canvas.height;
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

function drawHp() {
  ctx.fillStyle = "green";
  ctx.fillRect(Players[clientID].posX - 20, Players[clientID].posY + Players[clientID].width / 2 - 100, Players[clientID].hp * 10, 10);
  ctx.fillStyle = "#000";
  ctx.fillRect(Players[clientID].posX - 20 - 1, Players[clientID].posY + Players[clientID].width / 2 - 100 - 1, 10 * 10 + 2, 12);
}

function drawCursor() {
  ctx.drawImage(Img.crosshair, mousePosX + camX, mousePosY + camY, 30, 36);
}

function menuToggle() {
  if (menuActive) {
    menuActive = false;
  } else {
    menuActive = true;
  }
  menu = true;
}

function drawGui () {
}

function menuButton(text, onClick, mode) {
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

function menuUpdate() {
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
  this.posX = packet.posX;
  this.posY = packet.posY;
  this.velX = packet.velX;
  this.velY = packet.velY;
  this.hp = packet.hp;
  this.width = 64;
  this.height = 64;
  this.draw = function() {
    ctx.drawImage(Img.char, this.posX, this.posY - this.height, this.width, this.height * 2);
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

function checkMenuUp() {
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

function checkIfStillDown(obj) {
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

function checkMenuDown() {
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

function update() {
  ctx.save();
  resize();
  viewPort();
  ctx.clearRect(camX, camY, canvas.width, canvas.height);
  draw();
  drawHp();
  drawGui();
  if (menuActive) menuUpdate();
  drawCursor();
  ctx.restore();
}
