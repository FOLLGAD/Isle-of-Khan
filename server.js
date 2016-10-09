var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/client/'));

app.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/client/index.html');
});

let port = 8080;
server.listen(port);
console.log("server is listening on port", port);

const map = require('./server/map.js');
const init = require('./server/init.js');
const character = require('./server/character.js');
const coin = require('./server/coin.js');
const collision = require('./server/collision.js');
const enemy = require('./server/enemy.js');
const npc = require('./server/npc.js');
const projectiles = require('./server/projectiles.js');
const viewPoint = require('./server/viewPoint.js');

let treesArray = [];
init.placeTrees(treesArray, map.riverMap.matrix);

let tileSize = 64;

let renderDistance = 900;
let chars = {};
let coins = [];
let arrows = [];
let bombs = [];
let enemies = [];

let intervalStorage = {};

io.on('connection', function (socket) {
  console.log("User with ID", socket.id, "connected");
  chars[socket.id] = new character.Character(socket.id, 500, 500);

  socket.emit("initialize", { map: map.riverMap.matrix, id: socket.id });

  socket.on('bomb', function (direction) {
    bombs.push(new projectiles.Bomb(chars[socket.id].posX, chars[socket.id].posY, direction, chars[socket.id].velX, chars[socket.id].velY, chars[socket.id].id));
  });
  socket.on('arrow', function (direction) {
    arrows.push(new projectiles.Arrow(chars[socket.id].posX, chars[socket.id].posY, direction, chars[socket.id].id));
  });

  socket.on('key-press', function (input) {
    switch (input.inputkey) {
      case "w":
        chars[socket.id].walkingUp = input.state;
        break;
      case "a":
        chars[socket.id].walkingLeft = input.state;
        break;
      case "s":
        chars[socket.id].walkingDown = input.state;
        break;
      case "d":
        chars[socket.id].walkingRight = input.state;
        break;
      case "f":
        break;
      case "space":
        chars[socket.id].attacking = input.state;
        break;
      case "mousebutton":
        if (input.state) {
          clearInterval(intervalStorage[socket.id]);
          chars[socket.id].aimDirection = input.direction;
          startShooting(chars[socket.id], socket.id);
        } else {
          clearInterval(intervalStorage[socket.id]);
        }
        break;
      case "direction":
        chars[socket.id].aimDirection = input.direction;
        break;
      default:
        console.log("client input did not match any serverside input");
    }
  });

  socket.on('disconnect', function () {
    delete chars[socket.id];
    console.log(chars);
    console.log(socket.id, "left the server.");
  });
});

function startShooting(char, id) {
  if (Date.now() - char.lastShot > 400) {
    shoot(chars[id]);
    intervalStorage[id] = setInterval(shoot, 400, chars[id]);
  } else {
    intervalStorage[id] = setTimeout(function() {
      intervalStorage[id] = setInterval(shoot, 400, chars[id]);
    }, Date.now() - char.lastShot);
  }
}

function shoot(char) {
  arrows.push(new projectiles.Arrow(char.posX, char.posY, char.aimDirection, char.id));
  char.lastShot = Date.now();
}

let lastTime;
function update() {
  let deltaTime = Date.now() - lastTime;
  lastTime = Date.now();
  for (let prop in chars) {
    chars[prop].tick(deltaTime);
  }
  coin.tickCoins(coins, chars);
  enemy.tickEnemies(enemies, !!chars[Object.keys(chars)[0]] ? chars[Object.keys(chars)[0]] : { posX: 0, posY: 0, real: false }, deltaTime);
  projectiles.tickBombs(bombs, deltaTime, enemies, chars);
  projectiles.tickArrows(arrows, deltaTime, enemies, chars);
  for (let i in chars) {
    createEntityPacket(chars[i]);
  }
}

spawnCoin = function () {
  coins.push(new coin.Coin(Math.round(Math.random() * map.riverMap.width) * map.riverMap.tilesize + 16, Math.round(Math.random() * map.riverMap.height) * map.riverMap.tilesize + 16));
}

setInterval(spawnCoin, 1000);

// Packet sending
function createEntityPacket(object) {
  let drawOrder = {};
  drawOrder.char = [];
  drawOrder.tree = [];
  drawOrder.enemy = [];
  drawOrder.coin = [];
  drawOrder.arrow = [];
  drawOrder.bomb = [];
  let viewPort = viewPoint.calculateViewPoint(object);
  for (let i in chars) {
    if (chars[i].posX < viewPort.x + renderDistance && chars[i].posX + chars[i].width > viewPort.x - renderDistance && chars[i].posY < viewPort.y + renderDistance && chars[i].posY + chars[i].height > viewPort.y - renderDistance) {
      drawOrder.char.push(chars[i]);
    }
  }
  // drawOrder.push(Wizard);
  for (i = 0; i < treesArray.length; i++) {
    if (treesArray[i].posX < viewPort.x + renderDistance && treesArray[i].posX + treesArray[i].width > viewPort.x - renderDistance && treesArray[i].posY < viewPort.y + renderDistance && treesArray[i].posY + treesArray[i].height > viewPort.y - renderDistance) {
      drawOrder.tree.push(treesArray[i]);
    }
  }
  for (i = 0; i < enemies.length; i++) {
    if (enemies[i].posX < viewPort.x + renderDistance && enemies[i].posX + enemies[i].width > viewPort.x - renderDistance && enemies[i].posY < viewPort.y + renderDistance && enemies[i].posY + enemies[i].height > viewPort.y - renderDistance) {
      drawOrder.enemy.push(enemies[i]);
    }
  }
  for (i = 0; i < coins.length; i++) {
    if (coins[i].posX < viewPort.x + renderDistance && coins[i].posX + coins[i].width > viewPort.x - renderDistance && coins[i].posY < viewPort.y + renderDistance && coins[i].posY + coins[i].height > viewPort.y - renderDistance) {
      drawOrder.coin.push(coins[i]);
    }
  }
  for (i = 0; i < arrows.length; i++) {
    if (arrows[i].posX < viewPort.x + renderDistance && arrows[i].posX + arrows[i].width > viewPort.x - renderDistance && arrows[i].posY < viewPort.y + renderDistance && arrows[i].posY + arrows[i].height > viewPort.y - renderDistance) {
      drawOrder.arrow.push(arrows[i]);
    }
  }
  for (i = 0; i < bombs.length; i++) {
    if (bombs[i].posX < viewPort.x + renderDistance && bombs[i].posX + bombs[i].width > viewPort.x - renderDistance && bombs[i].posY < viewPort.y + renderDistance && bombs[i].posY + bombs[i].height > viewPort.y - renderDistance) {
      drawOrder.bomb.push(bombs[i]);
    }
  }
  io.to(object.id).emit("packet", {
    players: drawOrder.char,
    trees: drawOrder.tree,
    enemies: drawOrder.enemy,
    coins: drawOrder.coin,
    arrows: drawOrder.arrow,
    bombs: drawOrder.bomb
  });
}

setInterval(update, 1000 / 60);

let monsterInterval;
let monstersSpawn = false;
function toggleEnemySpawn() {
  if (monstersSpawn == true) {
    clearInterval(monsterInterval);
    monstersSpawn = false;
  } else {
    monsterInterval = setInterval(spawnEnemy, 1000);
    monstersSpawn = true;
  }
}
// toggleEnemySpawn();
function spawnEnemy() {
  let rand = Math.floor((Math.random() * 2) + 1) * tileSize;
  let posx = Math.floor(Math.random() * map.riverMap.width) * 64;
  let posy = Math.floor(Math.random() * map.riverMap.height) * 64;
  while (posx + rand > map.riverMap.width || posy + rand > map.riverMap.height) {
    posx = Math.floor(Math.random() * map.riverMap.width) * 64;
    posy = Math.floor(Math.random() * map.riverMap.height) * 64;
  }
  enemies.push(new enemy.Enemy(posx, posy, rand, rand));
}
