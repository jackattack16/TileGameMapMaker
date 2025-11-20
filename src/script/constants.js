const SPRITE_SIZE = 16;
const undoStack = [];
const redoStack = [];

let previewRotation = 0;
let previewMirror = [false, false]; // Horizontal, vertical

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


function cordToTiles(x, y) {
  // Convert to world coordinates
  const worldX = (x / zoom) + cameraPosition.x;
  const worldY = (y / zoom) + cameraPosition.y;
  
  // Snap to grid
  const snappedTileX = Math.floor(worldX / SPRITE_SIZE);
  const snappedTileY = Math.floor(worldY / SPRITE_SIZE);
  return [snappedTileX, snappedTileY];
}