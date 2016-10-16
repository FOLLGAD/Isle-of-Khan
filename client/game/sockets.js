//recieves death-msg through an elaborate function which recieves them and then displays them.
let socket = io();

socket.on('death-msg', function (object) {
  if (object.killer == object.victim) {
    // deathmsg function here
    deathQueue('<span style="color:red">' + object.victim + "</span> commited suicide");
  }else{
    //deathmsg func
    deathQueue('<span style="color:green">' + object.killer + '</span> killed <span style="color:red">' + object.victim + '</span>');
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

function register(regName, gameClass) {
  socket.emit('register', {username: regName, class: gameClass});
}

let asdf = false;
let lastPacket = Date.now();
socket.on('packet', function (packet) {
  // Players = {};
  Trees = [];
  Enemies = [];
  Coins = [];
  Arrows = [];
  Bombs = [];
  for (let i = 0; i < packet.delete.length; i++) {
    delete Players[packet.delete[i]];
  }
  for (let i = 0; i < packet.players.length; i++) {
    //checks if player does not exist in files
    if (!Players.hasOwnProperty(packet.players[i].id)) {
      Players[packet.players[i].id] = new Character(packet.players[i]);
    }
    for (let prop in packet.players[i]) {
      Players[packet.players[i].id][prop] = packet.players[i][prop];
    }
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
