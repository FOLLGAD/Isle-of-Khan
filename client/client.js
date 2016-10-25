let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let minimap = {};
minimap.canvas = document.getElementById("minimap");
minimap.ctx = minimap.canvas.getContext("2d");

let gameMap = {};
let tileSize = 64;
let menuActive = false;
let scoreboardActive = false;
let mousePosX;
let mousePosY;

let audio = {};
{
  audio.bomb = new Audio('./resources/grenade-sound.mp3');
  // audio.bomb.play();
  audio.arrow = new Audio('./resources/bow-fire.mp3');
  // audio.bomb.play();
  audio.bomb.volume = 0.1;
  audio.arrow.volume = 0.1;
}
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

minimap.ctx.canvas.width = gameMap.width;
minimap.ctx.canvas.height = gameMap.height;

minimap.scale = 2;

let Players   = {};
let Trees     = [];
let Enemies   = [];
let Coins     = [];
let Arrows    = [];
let Bombs     = [];
let Particles = [];

let Img = {};
  Img.archer = new Image();
  Img.archer.src = '/resources/classes/archer-spritesheet.png';
  Img.warrior = new Image();
  Img.warrior.src = '/resources/classes/warrior-spritesheet.png';
  Img.enemy = new Image();
  Img.enemy.src = '/resources/enemy.png';
  Img.tilemap = new Image();
  Img.tilemap.src = '/resources/tile-map.png';
  Img.tree = new Image();
  Img.tree.src = '/resources/tree.png';
  Img.arrow = new Image();
  Img.arrow.src = '/resources/arrow.png';
  Img.coin = new Image();
  Img.coin.src = '/resources/heart.png';
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

//Initizialise hotbar
let arrow = {
  cooldown: false,
  cdTimer: 0,
  endTime: 1000,
};
// event handlers
canvas.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("mousemove", nameMousePos, false);

let keyStates = {
  w: false,
  a: false,
  s: false,
  d: false,
  space: false
};
let lastdirection;
function keyDownHandler(e) {
  dispatchForCode(e, keyDownFunction);
}
function keyUpHandler(e) {
  dispatchForCode(e, keyUpFunction);
}
function keyDownFunction(code) {
  switch (code) {
    case 'KeyD':
      if (!keyStates.d) socket.emit('key-press', { inputkey: 'd', state: true });
      keyStates.d = true;
      break;
    case 'KeyA':
      if (!keyStates.a) socket.emit('key-press', { inputkey: 'a', state: true });
      keyStates.a = true;
      break;
    case 'KeyW':
      if (!keyStates.w) socket.emit('key-press', { inputkey: 'w', state: true });
      keyStates.w = true;
      break;
    case 'KeyS':
      if (!keyStates.s) socket.emit('key-press', { inputkey: 's', state: true });
      keyStates.s = true;
      break;
    case 'Space':
      if (!keyStates.space) socket.emit('key-press', { inputkey: 'space', state: true });
      keyStates.space = true;
      break;
    case 'KeyF':
      break;
    case 'KeyV':
      socket.emit('key-press', { inputkey: 'v', state: true });
      break;
    // else if (code == 27) {
    //   menuToggle();
    // }
    case 'KeyC':
      socket.emit('key-press', { inputkey: 'c', state: true });
      break;
    case 'KeyB':
      socket.emit('key-press', { inputkey: 'b', state: true });
      break;
    case 'Tab':
      scoreboardActive = true;
      break;
    default:
      console.log("input did not match any defined");
  // e.preventDefault();
  }
}
function keyUpFunction(code) {
  switch(code) {
    case 'KeyD':
      socket.emit('key-press', { inputkey: 'd', state: false });
      keyStates.d = false;
      break;
    case 'KeyA':
      socket.emit('key-press', { inputkey: 'a', state: false });
      keyStates.a = false;
      break;
    case 'KeyW':
      socket.emit('key-press', { inputkey: 'w', state: false });
      keyStates.w = false;
      break;
    case 'KeyS':
      socket.emit('key-press', { inputkey: 's', state: false });
      keyStates.s = false;
      break;
    case 'Space':
      socket.emit('key-press', { inputkey: 'space', state: false });
      keyStates.space = false;
      break;
    case 'KeyV':
      socket.emit('key-press', { inputkey: 'v', state: true });
      break;
    case 'KeyC':
      socket.emit('key-press', { inputkey: 'c', state: false });
      break;
    case 'KeyB':
      socket.emit('key-press', { inputkey: 'b', state: false });
      break;
    case 'KeyF':
      // socket.emit('key-press', { inputkey: 'f', state: false });
      break;
    case 'Tab':
      scoreboardActive = false;
      break;
    default:
      console.log("input did not match any defined");
  }
  // e.preventDefault();
}
let mouseDown = false;
let lastMouseUpdate = Date.now();
function nameMousePos(e) {
  let mousePos = getMousePos(e);
  mousePosX = mousePos.x;
  mousePosY = mousePos.y;
}
function getMousePos(e) {
  let rect = canvas.getBoundingClientRect();
  scaleX = canvas.width / rect.width;
  scaleY = canvas.height / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  };
}

$('#canvas').mousedown(function(e) {
  e.preventDefault();
  switch (e.which) {
    case 1: // left mouse btn
      //Cooldown
      console.log("cooldown: "+arrow.cdTimer);
      if (arrow.cooldown == false) {
        arrow.cdTimer = 0;
        arrow.cooldown = true;
      $('#canvas').focus();
      let direction = Math.atan2(camX - Players[clientID].posX - Players[clientID].width / 2 + mousePosX, camY - Players[clientID].posY - Players[clientID].height / 2 + mousePosY);
      socket.emit('key-press', { inputkey: 'attack', state: true, direction: direction });
      audio.arrow.play();
      }
      break;
    case 2: // middle mouse button
      break;
    case 3: // right mouse button
      let mouseDifX = camX - Players[clientID].posX - Players[clientID].width / 2 + mousePosX;
      let mouseDifY = camY - Players[clientID].posY - Players[clientID].height / 2 + mousePosY;
      let direx = Math.atan2(mouseDifX, mouseDifY);
      let vel = Math.min(Math.sqrt(Math.pow(mouseDifX, 2) + Math.pow(mouseDifY, 2)) / 90, 5);
      socket.emit('key-press', { inputkey: 'special', direction: direx, velocity: vel });
      break;
    default:
      alert('undefined mouse button pressed');
  }
});
$('#canvas').mouseup(function(e) {
  console.log("mouseup initiated");
  e.preventDefault();
  switch (e.which) {
    case 1: // left mouse button
      socket.emit('key-press', { inputkey: 'attack', state: false });
      break;
    case 2: // middle mouse button
      break;
    case 3: // right mouse button
      socket.emit('key-press', { inputkey: 'special', state: false });
      break;
    default:
      alert('undefined mouse button released');
  }
});

var dispatchForCode = function (event, callback) {
  var code;
  if (event.code !== undefined) {
    code = event.code;
  } else if (event.key !== undefined) {
    code = event.key;
  } else if (event.keyCode !== undefined) {
    code = event.keyCode;
  }
  callback(code);
};

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

var camX;
var camY;

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
  ctx.translate(-camX, -camY);
}

function resize() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  ctx.imageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
  offsetMaxX = gameMap.width * tileSize - ctx.canvas.width;
  offsetMaxY = gameMap.height * tileSize - ctx.canvas.height;
    //   screenWidth = Math.round(window.innerWidth);
    // screenHeight = Math.round(window.innerHeight);
    // calculateUIScale();
    // var a = Math.max(screenWidth / maxScreenWidth, screenHeight / maxScreenHeight);
    // $("#menu-screen").css({transform: "scale(" + uiScale * 0.85 + ")"});
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
  };
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
    if (prop === clientID) {
      minimap.ctx.fillStyle = "Blue";
    } else {
      minimap.ctx.fillStyle = "Red";
    }
    minimap.ctx.fillRect(Players[prop].posX / tileSize * minimap.scale + 2 - minimap.scale / 2, Players[prop].posY / tileSize * minimap.scale + 2 - minimap.scale / 2, minimap.scale * 2, minimap.scale * 2);
  }
}

function drawGui () {
  ctx.textAlign = "start";
  ctx.fillText("HP: " + Players[clientID].hp, 20 + camX, 50 + camY);
  ctx.fillText("Coins: " + Players[clientID].coins, 20 + camX, 100 + camY);
  ctx.fillText("Kills: " + Players[clientID].kills, 20 + camX, 150 + camY);
  ctx.fillText("Deaths: " + Players[clientID].deaths, 20 + camX, 200 + camY);
  ctx.fillText("PosX: " + Players[clientID].posX, 20 + camX, 250 + camY);
  ctx.fillText("PosY: " + Players[clientID].posY, 20 + camX, 300 + camY);
  ctx.fillText("CamX: " + camX, 20 + camX, 350 + camY);
  ctx.fillText("CamY: " + camY, 20 + camX, 400 + camY);
}

function scoreboard () {
  $("#scoreboard-players").html("<tr><th>Username</th><th>Health</th><th>Kills</th><th>Deaths</th></tr>");
  for (let player in Players) {
    $("#scoreboard-players").append("<tr><td>"+Players[player].username+"</td><td>"+Players[player].hp+"</td><td>"+Players[player].kills+"</td><td>"+Players[player].deaths+"</td></tr>");
  }
  //ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  //ctx.fillRect(camX + canvas.width/2, camY + 100, canvas.width/2-100, canvas.height/2);
  //ctx.drawImage(Img.options, 0, 0, 70, 8, camX + canvas.width / 2 - 70 * 8 / 2, camY + 100, 70 * 8, 8 * 8);
}
function leaderboard () {
  $("#leaderboard-players").html("<tr><th>Username</th><th>Health</th><th>Kills</th><th>Deaths</th></tr>");
  for (let player in Players) {
    $("#scoreboard-players").append("<tr><td>"+Players[player].username+"</td><td>"+Players[player].hp+"</td><td>"+Players[player].kills+"</td><td>"+Players[player].deaths+"</td></tr>");
  }
  //ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  //ctx.fillRect(camX + canvas.width/2, camY + 100, canvas.width/2-100, canvas.height/2);
  //ctx.drawImage(Img.options, 0, 0, 70, 8, camX + canvas.width / 2 - 70 * 8 / 2, camY + 100, 70 * 8, 8 * 8);
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
  };
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
  };
}
function Character (packet) {
  this.id = packet.id;
  this.class = "archer";
  this.username = packet.username;
  this.posX     = packet.posX;
  this.packPosX = packet.posX;
  this.posY     = packet.posY;
  this.packPosY = packet.posY;
  this.velX = packet.velX;
  this.velY = packet.velY;
  this.kills = packet.kills;
  this.deaths = packet.deaths;
  this.coins = packet.coins;
  this.hp = packet.hp;
  this.frame = 0;
  // Walking Direction: 0=right, 1=left, 2=down, 3=up;
  this.width = 64;
  this.height = 64;
  this.walkAnim = function (deltaTime) {
    if (this.walking) {
      this.frame += deltaTime;
      if (this.frame > 800) {
        this.frame -= 800;
      }
    } else {
      this.frame = 0;
    }
  };
  this.draw = function() {
    let dir = Math.floor((this.aimDirection / Math.PI + 1) * 2 + 0.5);
    if (dir === 4) dir = 0;
    let pics;
    if (dir === 0 || dir === 2) { pics = 4; } else { pics = 2; }
    if (this.class == "mage") {
      this.class = "archer";
    }
    let pic = Math.floor(this.frame / 200) % pics;
    if (pic == 2) {
      pic = 0;
    }
    if (pic == 3) {
      pic = 2;
    }
    ctx.drawImage(
      Img[this.class],
      pic * 16,
      dir * 32,
      16,
      32,
      this.posX,
      this.posY - this.height,
      this.width,
      this.height * 2
    );
    ctx.font = "12px GameFont";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black';
    ctx.strokeText(this.username, this.posX + this.width / 2, this.posY + this.width / 2 - 105, 10 * 10, 10); //Username
    ctx.fillText(this.username, this.posX + this.width / 2, this.posY + this.width / 2 - 105, 10 * 10, 10); //Username
    ctx.fillStyle = "black";
    ctx.fillRect(this.posX - 20, this.posY + this.width / 2 - 100, 10 * 10, 10);
    ctx.fillStyle = "green";
    ctx.fillRect(this.posX - 20, this.posY + this.width / 2 - 100, this.hp, 10);
    ctx.fillStyle = "red";
    ctx.fillText(this.hp, this.posX, this.posY);
    ctx.fillText(pic, this.posX - 50, this.posY);
    ctx.fillStyle = "white";
  };
}
function Tree (packet) {
  this.posX = packet.posX;
  this.posY = packet.posY;
  this.width = 64;
  this.height = 64;
  this.draw = function () {
    ctx.drawImage(Img.tree, this.posX, this.posY - 64, this.width, this.height * 2);
  };
}
function Coin (packet) {
  this.posX = packet.posX;
  this.posY = packet.posY;
  this.width = 32;
  this.height = 32;
  this.draw = function() {
    ctx.drawImage(Img.coin, this.posX, this.posY, this.width, this.height);
  };
}
function Particle (packet) {
  this.posX = packet.x;
  this.posY = packet.y;
  this.size = 1;
  this.width = 64;
  this.height = 64;
  this.velt = (Math.random() + 1)*0.5;
  this.velX = Math.sin(packet.direction) * this.velt;
  this.velY = Math.cos(packet.direction) * this.velt;
  this.timer = 500;
  this.exploded = false;
  this.tick = function (deltaTime) {
    for (let i = 0; i < deltaTime && this.exploded === false; i++) {
      this.timer -= 1;
      this.velX *= 0.997;
      this.velY *= 0.997;
      this.posX += this.velX;
      this.posY += this.velY;
      if (this.timer <= 0) this.exploded = true;
    }
    if (this.exploded) {
      let indx = Particles.indexOf(this);
      Particles.splice(indx, 1);
      return true;
    }
  };
  this.draw = function () {
    ctx.drawImage(Img.particle, this.posX, this.posY, this.width * this.size, this.height * this.size);
  };
}

function updateParticles (deltaTime) {
  for (let i = 0; i < Particles.length; i++) {
    if (Particles[i].tick(deltaTime)) i--;
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
    for (let i = 0; i < menuArray.length; i++) {
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
  let sincePacket = Date.now() - lastPacket;
  // clientSmoothing(sincePacket);
  //ctx.font="30px sans-serif"; NOT WORKING?
  ctx.save();
  resize();
  updateParticles(deltaTime);
  viewPort();
  ctx.clearRect(camX, camY, canvas.width, canvas.height);
  for (let prop in Players) {
    Players[prop].walkAnim(deltaTime);
  }
  draw();
  drawGui();
  if (menuActive) menuUpdate();
  if (scoreboardActive) {
    $("#scoreboard").show();
  }else{
  $("#scoreboard").hide();
  }
  scoreboard();
  arrowCooldown(deltaTime);
  // drawCursor();
  ctx.restore();
}
let lastDirection;
setInterval(function () {
  if (Players.hasOwnProperty(clientID)) {
    let direction = Math.atan2(camX - Players[clientID].posX - Players[clientID].width / 2 + mousePosX, camY - Players[clientID].posY - Players[clientID].height / 2 + mousePosY);
    if (direction !== lastDirection) {
      socket.emit('key-press', { inputkey: 'direction-update', direction: direction });
      lastDirection = direction;
    }
  }
}, 100);

function clientSmoothing (sincePacket) {
  console.log(sincePacket);
  for (let i in Players) {
    Players[i].posX = Players[i].packPosX + Players[i].velX * sincePacket;
    Players[i].posY = Players[i].packPosY + Players[i].velY * sincePacket;
  }
  for (let i = 0; i < Enemies.length; i++) {
    Enemies[i].posX = Enemies[i].posX + Enemies[i].velX * sincePacket;
    Enemies[i].posY = Enemies[i].posY + Enemies[i].velY * sincePacket;
  }
  for (let i = 0; i < Arrows.length; i++) {
    Arrows[i].posX = Arrows[i].posX + Arrows[i].velX * sincePacket;
    Arrows[i].posY = Arrows[i].posY + Arrows[i].velY * sincePacket;
  }
  for (let i = 0; i < Bombs.length; i++) {
    Bombs[i].posX = Bombs[i].posX + Bombs[i].velX * sincePacket;
    Bombs[i].posY = Bombs[i].posY + Bombs[i].velY * sincePacket;
  }
}

setInterval(drawMinimap, 100);

let deathMsgArray = [];
let deathTimer = false;
function deathQueue (msg) {
  if (!!msg) {
    deathMsgArray.push(msg);
  }
  if (deathTimer === false && deathMsgArray.length !== 0) {
    deathTimer = true;
    $("#death-messages").html('<h1>' + deathMsgArray[0] + '</h1>');
    $("#death-messages").fadeIn("slow", function() {
      setTimeout(function() {
        $("#death-messages").fadeOut("slow", function() {
          $("#death-messages h1").empty();
          console.log(deathMsgArray.splice(0, 1));
          deathTimer = false;
          deathQueue();
        });
      }, 1000);
    });
  }
}
function arrowCooldown(deltaTime){
  arrow.cdTimer = arrow.cdTimer + deltaTime;
  if (arrow.cdTimer >= arrow.endTime) {
    arrow.cooldown = false;
    arrow.cdTimer = 0;
    console.log("arrow cooldown refreshed.")
  }else{
  }

    console.log(arrow.cooldown)
}
