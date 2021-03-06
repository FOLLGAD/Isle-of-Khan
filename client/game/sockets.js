/*jshint esversion: 6 */
//recieves death-msg through an elaborate function which recieves them and then displays them.
let socket = io();

socket.on('death-msg', function (object) {
  if (object.killer === object.victim) {
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
  audio.bomb.pause();
  audio.bomb.currentTime = 0;
  audio.bomb.play();
});
let gameMap = {}, clientID;
socket.on('initialize', function (data) {
  gameMap.matrix = data.matrix.data;
  gameMap.objects = data.objects;
  gameMap.width = data.width;
  gameMap.height = data.height;
  clientID = data.id;
  drawMinimap();
});

function register(regName, gameClass) {
  socket.emit('register', {username: regName, class: gameClass});
}

let asdf = false;
let lastPacket = Date.now();
socket.on('packet', function (packet) {
  if (packet.events.length > 0) {
  }
  // Players = {};
  Trees = [];
  Enemies = [];
  Coins = [];
  Arrows = [];
  Bombs = [];
  Events = [];
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
      Players[packet.players[i].id].packPosX = packet.players[i].posX;
      Players[packet.players[i].id].packPosY = packet.players[i].posY;
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
  for (let i = 0; i < packet.events.length; i++) {
    Events.push(new Event(packet.events[i]));
  }
  if (!asdf) {
    update();
    asdf = true;
  }
  lastPacket = Date.now();
});
