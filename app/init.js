var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//Settings
var attackingSpeed = 2;

var fps = 60;
var walkSpeed = 5;
var frameAdd = 0.1;

var charX = canvas.width / 2;
var charY = canvas.height / 2;
var charVelX = 0;
var charVelY = 0;
var charWidth = 64;
var charHeight = 64;

var tileX = new Array;
var tileY = new Array;

var posX = 0;
var posY = 0;
var tileSize = 8*8;

var mousePosX = 0;
var mousePosY = 0;

var frame = 0;
var attackingFrame = 0;
var direction = "up";
var arrows = [];
var points = 0;
var idle = true;
var idleX = true;
var idleY = true;
var attacking = false;

var rightPressed = false;
var upPressed = false;
var leftPressed = false;
var downPressed = false;

var spacePressed = false;

var collisionY = false;
var collisionX = false;
var collision = false;

// textures and resources

ctx.imageSmoothingEnabled = false;

var coin = document.getElementById("coin");
var walk_right = document.getElementById("walk_right");
var walk_down = document.getElementById("walk_down");
var walk_left = document.getElementById("walk_left");
var walk_up = document.getElementById("walk_up");
var idle_right = document.getElementById("idle_right");
var idle_down = document.getElementById("idle_down");
var idle_left = document.getElementById("idle_left");
var idle_up = document.getElementById("idle_up");
var tile_map = document.getElementById("tile_map");
var crosshair = document.getElementById("crosshair");
var attacking_up = document.getElementById("attacking_up");
var attacking_down = document.getElementById("attacking_down");
var attacking_left = document.getElementById("attacking_left");
var attacking_right = document.getElementById("attacking_right");
