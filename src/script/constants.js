const SPRITE_SIZE = 16;

let cElement = document.getElementById('mapDisplay');
const ctx = cElement.getContext("2d");

let currentMode = "panMode";
const newTile = new Tile(5, 6, 10);
function clampValue(input, min, max) {
  if (input >= min && input <= max) { return input }
  if (input < min) { return min }
  if (input > max) { return max }
}
