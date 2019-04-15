var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/client/'));
app.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/client/index.html');
});
exports.emit = function (name, param1) {
  io.emit(name, param1);
};

let port = process.env.PORT || 8080;
server.listen(port);
console.log("server is listening on port", port);

let map = require('./maps/island-map.json');
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
let chars = {}, coins = [], arrows = [], bombs = [], enemies = [], events = [];

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
    clearInterval(intervalStorage[socketID]);
    clearTimeout(intervalStorage[socketID]);
    if (chars.hasOwnProperty(socketID)) {
      delete chars[socketID];
    }
    chars[socketID] = new character.Character(socketID, 500, 500, username, object.class);

    socket.on("chat-msg", function (msg) {
      io.emit("chat-msg", msg, username, new Date());
    });

    socket.on('key-press', function (input) {
      switch (input.inputkey) {
        case "w":
          chars[socketID].walkingUp = input.state;
          break;
        case "a":
          chars[socketID].walkingLeft = input.state;
          break;
        case "s":
          chars[socketID].walkingDown = input.state;
          break;
        case "d":
          chars[socketID].walkingRight = input.state;
          break;
        case "special":
          break;
        case "space":
          break;
        case "attack":
          playerAttack(input, socketID);
          break;
        case "direction-update":
          chars[socketID].aimDirection = input.direction;
          break;
        default:
          console.log(input, "did not match");
      }
    });

    // vvv --- ABILITIES --- vvv
    socket.on('shootArrow', function (obj) {
      if (chars[socketID].class === 'archer') {
          if (obj.state) {
            clearInterval(intervalStorage[socketID]);
            chars[socketID].aimDirection = obj.direction;
            startShooting(chars[socketID], socketID);
          } else {
            clearInterval(intervalStorage[socketID]);
            clearTimeout(intervalStorage[socketID]);
          }
      }
    });
    socket.on('useSword', function (obj) {
      console.log("hello?", chars[socketID])
      if (chars[socketID].class === 'warrior' && obj.state) {
        chars[socketID].attacking = true

        let offset = 0.25 * Math.PI;
        let swordstart = chars[socketID].aimDirection - offset;
        if (swordstart < -Math.Pi) swordstart += Math.PI * 2;
        let swordlength = offset * 2;
        checkSwordCollision(chars[socketID], swordstart, swordlength);
      }
    });
    socket.on('shootSpell', function (obj) {
      if (chars[socketID].class === 'mage') {
        // Do some spelley shite ;D
      }
    });
    socket.on('throwBomb', function (obj) {
      if (!!obj.direction && !!obj.velocity) {
        obj.velocity = Math.min(obj.velocity, 5);
        bombs.push(new projectiles.Bomb(chars[socketID].posX, chars[socketID].posY, obj.direction, 0, 0, socketID, obj.velocity));
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

function checkSwordCollision (attacker, start, length) {
  for (let prop in chars) {
    let eldisX = attacker.posX - chars[prop].posX;
    let eldisY = attacker.posY - chars[prop].posY;
    let dist = Math.sqrt(eldisX * eldisX + eldisY * eldisY);
    if (dist < 256) {
      let dir = Math.atan2(-eldisX, -eldisY);
      let startandlength = start + length;
      if (startandlength > Math.PI) startandlength = startandlength - Math.PI * 2;
      if (chars[prop].id !== attacker.id && start < dir && startandlength > dir) {
        console.log("attacked. direction:",dir);
        console.log("distance:",dist);
        console.log("started:",start);
        console.log("start + length:",startandlength);
        chars[prop].getDamaged(dir, 40, attacker.id, 10);
      }
    }
  }
}

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
  let posX = char.posX + char.width / 2,
  posY = char.posY + char.height / 2;
  arrows.push(new projectiles.Arrow(posX, posY, char.aimDirection, char.id));
  events.push({type: "arrowSound", posX: posX, posY: posY})
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
  packetOrder.event = [];
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
  for (i = 0; i < events.length; i++) {
    if (events[i].posX < viewPort.x + renderDistanceX && events[i].posX > viewPort.x - renderDistanceX && events[i].posY < viewPort.y + renderDistanceY && events[i].posY > viewPort.y - renderDistanceY) {
      packetOrder.event.push(events[i]);
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
    delete: toBeDeleted,
    events: packetOrder.event
  });
  events = [];
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
