socket = io();

socket.on()

// event handlers
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousedown", mouseDownHandler, false);
document.addEventListener("mouseup", mouseUpHandler, false);
document.addEventListener('mousemove', nameMousePos, false);

function keyDownHandler(e) {
  if (e.keyCode == 68) {
    io.emit('key-press', { inputkey: 'd', state: true });
  } else if (e.keyCode == 65) {
    io.emit('key-press', { inputkey: 'a', state: true });
  } else if (e.keyCode == 87) {
    io.emit('key-press', { inputkey: 'w', state: true });
  } else if (e.keyCode == 83) {
    io.emit('key-press', { inputkey: 's', state: true });
  } else if (e.keyCode == 32) {
    io.emit('key-press', { inputkey: 'space', state: true });
  } else if (e.keyCode == 70) {
    let direx = Math.atan2(camX - chars[0].posX - chars[0].width / 2 + mousePosX, camY - chars[0].posY - chars[0].height/2 + mousePosY);
    io.emit("bomb", direx)
  }
  else if (e.keyCode == 86) {
    io.emit('key-press', { inputkey: 'v', state: true });
  }
  else if (e.keyCode == 27) {
    menuToggle();
  }
  else if (e.keyCode == 67) {
    io.emit('key-press', { inputkey: 'c', state: true });
  }
  else if (e.keyCode == 66) {
    io.emit('key-press', { inputkey: 'b', state: true });
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 68) {
    io.emit('key-press', { inputkey: 'd', state: false });
    frame = 0;
  }
  else if (e.keyCode == 65) {
    io.emit('key-press', { inputkey: 'a', state: false });
    frame = 0;
  }
  else if (e.keyCode == 87) {
    io.emit('key-press', { inputkey: 'w', state: false });
    frame = 0;
  }
  else if (e.keyCode == 83) {
    io.emit('key-press', { inputkey: 's', state: false });
    frame = 0;
  }
  else if (e.keyCode == 32){
    io.emit('key-press', { inputkey: 'space', state: false });
    frame = 0;
  }
  else if (e.keyCode == 86) {
    io.emit('key-press', { inputkey: 'v', state: true });
  }
  else if (e.keyCode == 67) {
    io.emit('key-press', { inputkey: 'c', state: false });
  }
  else if (e.keyCode == 66) {
    io.emit('key-press', { inputkey: 'b', state: false });
  }
  else if (e.keyCode == 70) {
    io.emit('key-press', { inputkey: 'f', state: false });
  }
}

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

function mouseDownHandler() {
  mouseDown = true;
  checkMenuDown();
}

function mouseUpHandler() {
  mouseDown = false;
  checkMenuUp();
}
