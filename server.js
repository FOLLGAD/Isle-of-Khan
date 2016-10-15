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

let renderDistanceX = 1000;
let renderDistanceY = 550;
let chars = {};
let coins = [];
let arrows = [];
let bombs = [];
let enemies = [];

let intervalStorage = {};

io.on('connection', function (socket) {
  var socketId = socket.id;
  var clientIp = socket.request.connection.remoteAddress;
  let username;

  console.log("User with ID", socket.id, "connected with IP: " + clientIp);

  socket.emit("initialize", { matrix: map.riverMap.matrix, width: map.riverMap.width, height: map.riverMap.height, id: socket.id });

  socket.on('register', function (user) {
    username = user;
    clearInterval(intervalStorage[socket.id]);
    clearTimeout(intervalStorage[socket.id]);
    if (chars.hasOwnProperty(socket.id)) {
      delete chars[socket.id];
    }
    chars[socket.id] = new character.Character(socket.id, 500, 500, username);

    socket.on("chat-msg", function (msg) {
      io.emit("chat-msg", msg, username, new Date());
    });

    socket.on('bomb', function (direction) {
      bombs.push(new projectiles.Bomb(chars[socket.id].posX, chars[socket.id].posY, direction, chars[socket.id].velX, chars[socket.id].velY, socket.id));
    });
    socket.on('arrow', function (direction) {
      arrows.push(new projectiles.Arrow(chars[socket.id].posX + chars[socket.id].width / 2, chars[socket.id].posY + chars[socket.id].height / 2, direction, chars[socket.id].id));
    });

    socket.on('key-press', function (input) {
      switch (input.inputkey) {
        case "w":
          chars[socket.id].walkingUp = input.state;
          console.log(input.inputkey);
          break;
        case "a":
          chars[socket.id].walkingLeft = input.state;
          console.log(input.inputkey);
          break;
        case "s":
          chars[socket.id].walkingDown = input.state;
          console.log(input.inputkey);
          break;
        case "d":
          chars[socket.id].walkingRight = input.state;
          console.log(input.inputkey);
          break;
        case "f":
          break;
        case "space":
          chars[socket.id].attacking = input.state;
          break;
        case "mousebutton":
          if (input.state && input.direction !== undefined) {
            clearInterval(intervalStorage[socket.id]);
            chars[socket.id].aimDirection = input.direction;
            startShooting(chars[socket.id], socket.id);
          } else {
            clearInterval(intervalStorage[socket.id]);
            clearTimeout(intervalStorage[socket.id]);
          }
          break;
        case "direction-update":
          if (input.direction !== undefined) {
            chars[socket.id].aimDirection = input.direction;
          }
          console.log("direct", input.direction);
          break;
        default:
          console.log("client input did not match any serverside input");
      }
    });
    socket.on('disconnect', function () {
      delete chars[socket.id];
      clearInterval(intervalStorage[socket.id]);
      clearTimeout(intervalStorage[socket.id]);
      console.log(socket.id, "left the server.");
    });
  });
});

function startShooting(char, id) {
  if (Date.now() - char.lastShot > 400) {
    shoot(chars[id]);
    intervalStorage[id] = setInterval(shoot, 400, chars[id]);
  } else {
    intervalStorage[id] = setTimeout(function() {
      shoot(chars[id]);
      intervalStorage[id] = setInterval(shoot, 400, chars[id]);
    }, 400 - (Date.now() - char.lastShot));
  }
}

function shoot(char) {
  arrows.push(new projectiles.Arrow(char.posX + char.width / 2, char.posY + char.height / 2, char.aimDirection, char.id));
  char.lastShot = Date.now();
}

let lastTime = Date.now();
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
  if (coins.length < 200) {
    do {
      var spawnX = Math.floor(Math.random() * map.riverMap.width) * 64 + 16;
      var spawnY = Math.floor(Math.random() * map.riverMap.height) * 64 + 16;
    }
    while (collision.areTilesFree(spawnX, spawnY, 32, 32));
    coins.push(new coin.Coin(spawnX, spawnY));
  }
}

setInterval(spawnCoin, 2000);

// Packet sending
function createEntityPacket(object) {
  let packetOrder = {};
  packetOrder.char = [];
  packetOrder.tree = [];
  packetOrder.enemy = [];
  packetOrder.coin = [];
  packetOrder.arrow = [];
  packetOrder.bomb = [];
  let viewPort = viewPoint.calculateViewPoint(object);
  for (let i in chars) {
    // if (chars[i].posX < viewPort.x + renderDistanceX && chars[i].posX + chars[i].width > viewPort.x - renderDistanceX && chars[i].posY < viewPort.y + renderDistanceY && chars[i].posY + chars[i].height > viewPort.y - renderDistanceY) {
      packetOrder.char.push(chars[i]);
    // }
  }
  // packetOrder.push(Wizard);
  for (i = 0; i < treesArray.length; i++) {
    if (treesArray[i].posX < viewPort.x + renderDistanceX && treesArray[i].posX + treesArray[i].width > viewPort.x - renderDistanceX && treesArray[i].posY < viewPort.y + renderDistanceY && treesArray[i].posY + treesArray[i].height > viewPort.y - renderDistanceY) {
      packetOrder.tree.push(treesArray[i]);
    }
  }
  for (i = 0; i < enemies.length; i++) {
    if (enemies[i].posX < viewPort.x + renderDistanceX && enemies[i].posX + enemies[i].width > viewPort.x - renderDistanceX && enemies[i].posY < viewPort.y + renderDistanceY && enemies[i].posY + enemies[i].height > viewPort.y - renderDistanceY) {
      packetOrder.enemy.push(enemies[i]);
    }
  }
  for (i = 0; i < coins.length; i++) {
    if (coins[i].posX < viewPort.x + renderDistanceX && coins[i].posX + coins[i].width > viewPort.x - renderDistanceX && coins[i].posY < viewPort.y + renderDistanceY && coins[i].posY + coins[i].height > viewPort.y - renderDistanceY) {
      packetOrder.coin.push(coins[i]);
    }
  }
  for (i = 0; i < arrows.length; i++) {
    if (arrows[i].posX < viewPort.x + renderDistanceX && arrows[i].posX + arrows[i].width > viewPort.x - renderDistanceX && arrows[i].posY < viewPort.y + renderDistanceY && arrows[i].posY + arrows[i].height > viewPort.y - renderDistanceY) {
      packetOrder.arrow.push(arrows[i]);
    }
  }
  for (i = 0; i < bombs.length; i++) {
    if (bombs[i].posX < viewPort.x + renderDistanceX && bombs[i].posX + bombs[i].width > viewPort.x - renderDistanceX && bombs[i].posY < viewPort.y + renderDistanceY && bombs[i].posY + bombs[i].height > viewPort.y - renderDistanceY) {
      if (bombs[i].exploded) {
        io.to(object.id).emit('particle', {
          x: bombs[i].posX,
          y: bombs[i].posY
        });
      } else {
        packetOrder.bomb.push(bombs[i]);
      }
    }
  }
  io.to(object.id).emit("packet", {
    players: packetOrder.char,
    trees: packetOrder.tree,
    enemies: packetOrder.enemy,
    coins: packetOrder.coin,
    arrows: packetOrder.arrow,
    bombs: packetOrder.bomb,
    sent: Date.now()
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
