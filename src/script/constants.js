const SPRITE_SIZE = 16;
const undoStack = [];
const redoStack = [];

let sprite = new Image()
sprite.src = "'../../../../spriteSheets/testTile.png";

let cElement = document.getElementById('mapDisplay');
const ctx = cElement.getContext("2d");

let currentMode = "editMode";

const tileMap = new Map();


function clampValue(input, min, max) {
  if (input >= min && input <= max) { return input }
  if (input < min) { return min }
  if (input > max) { return max }
}
