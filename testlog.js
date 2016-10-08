let Players = [];
function Character (dex) {
  this.x = dex;
}
Players.push(new Character("first"));
Players.push(new Character("second and head"));
let assignedChar = Players[1];

console.log(Players.indexOf(assignedChar), Players[0]);
Players.splice(0, 1);

console.log(Players.indexOf(assignedChar), Players[0]);
