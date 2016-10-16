//recieves death-msg through an elaborate function which recieves them and then displays them.
let socket = io();

socket.on('death-msg', function (object) {
  if (object.killer == object.victim) {
    // deathmsg function here
<<<<<<< HEAD
    deathQueue('<span style="color:red">' + object.victim + "</span> commited suicide");
  } else {
    //deathmsg func
    deathQueue('<span style="color:green">' + object.killer + '</span> killed <span style="color:red">' + object.victim + '</span>');
=======
    deathQueue((object.victim !== "" ? object.victim : "Unknown player") + " commited suicide");
  } else {
    //deathmsg func
    deathQueue((object.killer !== "" ? object.killer : "Unknown player") + " killed " + (object.victim !== "" ? object.killer : "Unknown player"));
>>>>>>> origin/Multi-player
  }
});

socket.on('particle', function (object) {
  let particleAmount = Math.floor(Math.random() * 5) + 6;
  for (let i = 0; i < particleAmount; i++) {
    let part = { x: object.x, y: object.y };
    let direc = Math.random() * Math.PI * 2;
    part.direction = direc;
    Particles.push(new Particle(part));
  }
  // audio.bomb.play();
});

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

let asdf = false;
let lastPacket = Date.now();
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
  lastPacket = packet.sent;
});
