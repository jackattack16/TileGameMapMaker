const SPRITE_SIZE = 16;
const undoStack = [];
const redoStack = [];

let cElement = document.getElementById('mapDisplay');
const ctx = cElement.getContext("2d");

let sElement = document.getElementById('spriteSelector');
const sCtx = sElement.getContext("2d");


let previewRotation = 0;
let previewMirror = [false, false]; // Horizontal, vertical

const SPRITE_PADDING = 5; // in % of width, same for all sides
let spriteSheetZoom = 2.5;
let SPRITE_SHEET = new Image();
SPRITE_SHEET.src = "../../../../spriteSheets/testTileSpriteSheet.png";
let currentSelectedSprite = 0;
const tempDisplaySize = updateCanvasSize(sElement);

let spriteHitboxes = [];
SPRITE_SHEET.onload = () => {
  console.log("spritesheet loaded");
  renderSpriteSheet(tempDisplaySize);
  initializeInputs();
  loadActionButtons();
  snapToCenter();
}

function updateCanvasSize(canvas) {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  return [canvas.width, canvas.height];
}




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