var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
let fs = require('fs');

app.use(express.static(__dirname + '/client/'));
app.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/client/index.html');
});
exports.emit = function (name, param1) {
  io.emit(name, param1);
};

let port = 8080;
server.listen(port);
console.log("server is listening on port", port);

let map = JSON.parse(fs.readFileSync('./maps/island-map.json', 'utf8'));
exports.map = map;
exports.map.tilesize = 64;

const init = require('./server/init.js');
const character = require('./server/character.js');
const coin = require('./server/coin.js');
const collision = require('./server/collision.js');
const enemy = require('./server/enemy.js');
const npc = require('./server/npc.js');
const projectiles = require('./server/projectiles.js');
const viewPoint = require('./server/viewPoint.js');

let treesArray = [];
function placeTrees() {
  for (let i = 0; i < map.layers[1].objects.length; i++) {
    treesArray.push({
      posX: map.layers[1].objects[i].x * 8,
      posY: map.layers[1].objects[i].y * 8 - map.tilesize,
      width: 64,
      height: 64
    });
  }
}
placeTrees();

const tileSize = 64;

let renderDistanceX = 1000, renderDistanceY = 550;
let chars = {}, coins = [], arrows = [], bombs = [], enemies = [];

let intervalStorage = {};
let toBeDeleted = [];

io.on('connection', function (socket) {
  let clientIp = socket.request.connection.remoteAddress, username, socketID = socket.id;
  console.log("User with ID", socket.id, "connected with IP: " + clientIp);
  socket.emit("initialize", {
    matrix: map.layers[0],
    objects: map.layers[1],
    width: map.width,
    height: map.height,
    id: socket.id
  });
  socket.on('register', function (object) {
    if (object.username === ""){
      let guestCount = 1;
      for (let prop in chars) {
        if (chars[prop].username == "Guest " + guestCount){
          guestCount++;
        }
      }
      username = "Guest " + guestCount;
    }else{
      username = object.username;
    }
    console.log("user registered as: " + username);
    clearInterval(intervalStorage[socket.id]);
    clearTimeout(intervalStorage[socket.id]);
    if (chars.hasOwnProperty(socket.id)) {
      delete chars[socket.id];
    }
    chars[socket.id] = new character.Character(socket.id, 500, 500, username, object.class);

    socket.on("chat-msg", function (msg) {
      io.emit("chat-msg", msg, username, new Date());
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
        case "special":
          if (!!input.direction && !!input.velocity) {
            input.velocity = Math.min(input.velocity, 5);
            bombs.push(new projectiles.Bomb(chars[socket.id].posX, chars[socket.id].posY, input.direction, 0, 0, socket.id, input.velocity));
          }
          break;
        case "space":
          break;
        case "attack":
          if (input.state) {
            clearInterval(intervalStorage[socket.id]);
            chars[socket.id].aimDirection = input.direction;
            startShooting(chars[socket.id], socket.id);
          } else {
            clearInterval(intervalStorage[socket.id]);
            clearTimeout(intervalStorage[socket.id]);
          }
          break;
        case "direction-update":
          chars[socket.id].aimDirection = input.direction;
          break;
        default:
          console.log(input, "did not match");
      }
    });
    socket.on('disconnect', function (socket) {
      console.log("user", socketID, "with the ip", clientIp, "left the server.");
      clearInterval(intervalStorage[socketID]);
      clearTimeout(intervalStorage[socketID]);
      toBeDeleted.push(socketID);
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
  for (let i = 0; i < toBeDeleted.length; i++) {
    delete chars[toBeDeleted[i]];
  }
}

spawnCoin = function () {
  if (coins.length < 25) {
    let spawnX;
    let spawnY;
    do {
      spawnX = Math.floor(Math.random() * map.width) * 64 + 16;
      spawnY = Math.floor(Math.random() * map.height) * 64 + 16;
    }
    while (collision.areTilesFree(spawnX, spawnY, 32, 32));
    coins.push(new coin.Coin(spawnX, spawnY));
  }
};

setInterval(spawnCoin, 1);

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
    sent: Date.now(),
    delete: toBeDeleted
  });
}

// FPS
setInterval(update, 1000 / 30);

let monsterInterval;
let monstersSpawn = false;
function toggleEnemySpawn() {
  if (monstersSpawn === true) {
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
  let posx = Math.floor(Math.random() * map.width) * 64;
  let posy = Math.floor(Math.random() * map.height) * 64;
  while (posx + rand > map.width || posy + rand > map.height) {
    posx = Math.floor(Math.random() * map.width) * 64;
    posy = Math.floor(Math.random() * map.height) * 64;
  }
  enemies.push(new enemy.Enemy(posx, posy, rand, rand));
}
