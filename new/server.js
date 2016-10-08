var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname));

app.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

let port = 8080;
server.listen(port);
console.log("server is listening on port", port);

const character = require('./character.js');
const coin = require('./coin.js');
const collision = require('./collision.js');
const enemy = require('./enemy.js');
const gui = require('./gui.js');
const init = require('./init.js');
const keyHandler = require('./keyHandler.js');
const main = require('./main.js');
const map = require('./map.js');
const npc = require('./npc.js');
const projectiles = require('./projectiles.js');
const viewPoint = require('./viewPoint.js');

io.on('connection', function (socket) {
  console.log("User with ID", socket.id, "connected");
  chars.push(new Character(socket.id, 50, 50)) - 1;
  let assignedChar = chars[chars.length];

  io.on('bomb', function (direction) {
    bombs.push(new Bomb(assignedChar.posX, assignedChar.posY, direction, assignedChar.velX, assignedChar.velY, assignedChar.id));
  });

  io.on('arrow', function (direction) {
    arrows.push(new Arrow( assignedChar.posX, assignedChar.posY, direction, assignedChar.id));
  });

  io.on('')

  io.on('disconnect', function () {
    index = chars.indexOf(assignedChar);
    chars.splice(index, 1);
  });
});
