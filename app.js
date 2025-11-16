let c = document.querySelector('canvas');
const canvas = c.getContext("2d");

let previewC = document.getElementById('previewTiles');
const preview = previewC.getContext("2d");

let spriteSheetC = document.getElementById('spriteSheetHolder');
const spriteSheetHolder = spriteSheetC.getContext("2d");

let currentTile = 0;
let selectedRow = 0;
let currentLayer = 0;
let currentRotation = 0;

let spriteSheet = new Image()
spriteSheet.src = "spriteSheet.png";

const spriteSize = 64;
const halfSprite = spriteSize/2;
let numberOfSpritesWide;
spriteSheet.onload = () => {
  console.log("Sprite sheet loaded!");
  updatePreview();
  numberOfSpritesWide = spriteSheet.width / spriteSize;
  spriteSheetC.height = spriteSheet.height;
  drawSpriteSheet();
  const imageWidth = spriteSheet.width;
  const numberArea = document.getElementById("numberAdder")
  let html = "";
  const itterations = Math.floor(imageWidth/spriteSize);
  for (let i = 0; i < itterations; i++) { 
    html += `<p class='spriteNumber'>${i+1}</p>`; 
  }
  numberArea.innerHTML = html;
  //layersArray = localStorage.getItem("currentSave");
  loadMap(localStorage.getItem("currentSave"), true);
};

let drawingWall = false;

let layersArray = [];
layersArray[0] = new Set();
switchToLayer(1);

let layersToNotRender = new Set();

let whereTilesHaveBeenPlaced = new Set();

function localSave() {
  let arrayOfSets = [];
  for (let set of layersArray) {
    arrayOfSets.push(Array.from(set).map(value => {
      // assuming your Set stores "x,y;tile;rotation"
      const [coords, tileIndex, rotation, isWall] = value.split(";");
      const [x, y] = coords.split(",").map(n => Math.floor(Number(n) / spriteSize));
      return { x, y, tile: Number(tileIndex), rotation: Number(rotation), wall: (isWall === "true")};
    }));
  }
  localStorage.setItem("currentSave", JSON.stringify(arrayOfSets));
}




function placeTile(x, y, erase) {
  let clampedX = Math.round((Math.ceil(x / spriteSize) * spriteSize) - halfSprite);
  let clampedY = Math.round((Math.ceil(y / spriteSize) * spriteSize) - halfSprite);
  const cordPair = `${clampedX},${clampedY}`;

  if (erase) {
    //canvas.clearRect(clampedX - halfSprite, clampedY - halfSprite, spriteSize, spriteSize);
    removeCord(cordPair);
    renderFromArray();
    return;
  }
  if (checkIfTileExistsAtCord(cordPair)) { removeCord(cordPair); }
  layersArray[currentLayer].add(`${cordPair};${currentTile + (selectedRow * numberOfSpritesWide)};${currentRotation};${drawingWall}`);
  renderFromArray();
}

function drawTileFromSheet(spriteIndex, x, y) {
  let spriteVector = spriteIdToXY(spriteIndex);
  canvas.drawImage(
    spriteSheet,               // source image
    spriteVector[0] * spriteSize,
    spriteVector[1] * spriteSize,
    spriteSize,                // source width
    spriteSize,                // source height
    x,        // destination x (centered)
    y,        // destination y (centered)
    spriteSize,                // destination width
    spriteSize                 // destination height
  );
}

function drawRotatedTile(spriteIndex, x, y, rotation) {
  const angle = (rotation ?? currentRotation) * Math.PI / 180;
  const half = spriteSize / 2;
  let spriteVector = spriteIdToXY(spriteIndex);
  canvas.save();
  canvas.translate(x + half, y + half); // move origin to tile center
  canvas.rotate(angle);
  canvas.drawImage(
    spriteSheet,
    spriteVector[0] * spriteSize,
    spriteVector[1] * spriteSize,
    spriteSize,
    spriteSize,
    -half,  // draw centered around origin
    -half,
    spriteSize,
    spriteSize
  );
  canvas.restore();
}

function spriteIdToXY(spriteId) {
  let spriteVector = [];

  spriteVector[0] = spriteId % numberOfSpritesWide;
  spriteVector[1] = Math.floor(spriteId / numberOfSpritesWide)
  return spriteVector;
}

function drawWallTile(x, y, width, height, canvasToUse) {
  const currentCanvas = canvasToUse ?? canvas;
  currentCanvas.fillStyle = "rgba(255, 0, 0, 0.25)"
  currentCanvas.beginPath(); 
  currentCanvas.fillRect(x, y, height ?? spriteSize, width ?? spriteSize);
  currentCanvas.stroke();
}


function removeCord(cordPair) {
  for (let value of layersArray[currentLayer]) {
    if (value.startsWith(cordPair)) {
      layersArray[currentLayer].delete(value);
      break;
    }
  }
}

function checkIfTileExistsAtCord(cordPair) {
  for (let value of layersArray[currentLayer]) {
    if (value.startsWith(cordPair)) {
      return true;
    }
  }
  return false;
}

function getTileAtCell(x, y) {
  const cellX = Math.floor(x / spriteSize);
  const cellY = Math.floor(y / spriteSize);

  for (let value of layersArray[currentLayer]) {
    const [coords] = value.split(";");
    const [tileX, tileY] = coords.split(",").map(c => Math.floor(c / spriteSize));
    if (tileX === cellX && tileY === cellY) return value;
  }
  return null;
}

function getCursorPosition(canvas3, event, erase) {
  const rect = canvas3.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  //console.log("x: " + x + " y: " + y);
  placeTile(x, y, erase);
}

let isDragging = false;

c.addEventListener('mousedown', function(e) {
  isDragging = true;
  getCursorPosition(c, e, e.buttons === 2)
});

c.addEventListener('mousemove', function(e) {
  if (isDragging) { getCursorPosition(c, e, e.buttons === 2) }
});

c.addEventListener('mouseup', () => {
  isDragging = false;
});

c.addEventListener('mouseleave', () => {
  isDragging = false; 
});

c.addEventListener('contextmenu', (e) => {
  e.preventDefault(); // stops the right-click menu from showing
});



document.addEventListener('keypress', function(e) {
  if (!isNaN(e.key)) {
  if (e.key == 0) { currentTile = 9 } else { currentTile = Number(e.key) - 1 }
  currentRotation = 0;
 //console.log("current tile: " + currentTile, ", current rotation: " + currentRotation);
  updatePreview();
  drawSpriteSheet();
  } else {
    switch (e.key) {
      case "q":
        currentRotation -= 90;
        currentRotation = (currentRotation + 360) % 360;
        break;
      case "e":
        currentRotation += 90;
        currentRotation = (currentRotation + 360) % 360;
        break;
      case "w":
        drawingWall = !drawingWall; // toggle value
        break;
      case "s":
        localSave();
        showAlert("rgba(197, 255, 195, 1)", 1000);
        break;
      case "a":
        selectedRow--;
        if (selectedRow < 0) {
          selectedRow = 0;
        } 
        drawSpriteSheet();
        break;
      case "d":
        selectedRow++;
        if (selectedRow >= (spriteSheet.height / spriteSize)) {
          selectedRow = spriteSheet.height / spriteSize - 1;
        } 
        drawSpriteSheet();
        break;
    }
    //console.log("current tile: " + currentTile, ", current rotation: " + currentRotation);
    updatePreview();
  } 
})

function renderFromArray() {
  canvas.clearRect(0, 0, c.width, c.height);
  let layerOn = 1;
  for(let set of layersArray) {
    if (!layersToNotRender.has(layerOn)) { renderFromSet(set, false) }
    layerOn++;
  }
}

// Preview Tile
function updatePreview() {
  const pHeight = previewC.height;
  const pWidth = previewC.width;

  preview.clearRect(0, 0, pWidth, pHeight);

  const angle = currentRotation * Math.PI / 180;

  preview.save();
  
  // move origin to center
  preview.translate(pWidth / 2, pHeight / 2);
  preview.rotate(angle);

  // draw centered at the new origin
  preview.drawImage(
    spriteSheet,
    currentTile * spriteSize,
    0 + (selectedRow * spriteSize),
    spriteSize,
    spriteSize,
    -pWidth / 2,  // top-left corner relative to center
    -pHeight / 2,
    pWidth,       // stretch to fill the full canvas
    pHeight
  );

  if (drawingWall) { drawWallTile(0-(pWidth / 2), 0-(pHeight / 2), pWidth, pHeight, preview)}
  preview.restore();
}

function renderFromSet(set, clear) {
  if (clear) { canvas.clearRect(0, 0, c.width, c.height) };

  for(let value of set) {
    const xPos = Number(value.split(";")[0].split(",")[0]);
    const yPos = Number(value.split(";")[0].split(",")[1]);
    const tileId = Number(value.split(";")[1]);
    const rotation = Number(value.split(";")[2]);
    const isWall = (value.split(";")[3] === "true");
    drawRotatedTile(tileId, (xPos - halfSprite), (yPos - halfSprite), rotation);

    if (isWall) { drawWallTile((xPos - halfSprite), (yPos - halfSprite)) }

  }
}

function showAlert(color, timeout) {
  document.getElementById('body').style.backgroundColor = color;
  document.getElementById('body').style.transition = `background-color ${timeout/2000}s ease`;
  setTimeout(() => {
    document.getElementById('body').style.backgroundColor = "";
  }, timeout);
}

function exportMap() {
    // Ask user for a filename
  let filename = prompt("Enter filename for your map:", "map.json");
  if (!filename) return; // user cancelled

  // Ensure it ends with .json
  if (!filename.endsWith(".json")) filename += ".json";
  let arrayOfSets = [];
  for (let set of layersArray) {
    arrayOfSets.push(Array.from(set).map(value => {
      // assuming your Set stores "x,y;tile;rotation"
      const [coords, tileIndex, rotation, isWall] = value.split(";");
      const [x, y] = coords.split(",").map(n => Math.floor(Number(n) / spriteSize));
      return { x, y, tile: Number(tileIndex), rotation: Number(rotation), wall: (isWall === "true")};
    }));
  }

  const blob = new Blob([JSON.stringify(arrayOfSets)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function loadMap(fileOrString, skipFileLoad) {
  let text;
  if (!skipFileLoad) {
    text = await fileOrString.text(); // File object path
  } else {
    text = fileOrString; // string from localStorage
  }
  const tiles = JSON.parse(text);

  for (let i = 0; i < tiles.length; i++) {
    layersArray[i] = new Set(
      tiles[i].map(t => {
        const x = t.x * spriteSize + halfSprite;
        const y = t.y * spriteSize + halfSprite;
        return `${x},${y};${t.tile};${t.rotation};${t.wall}`;
      })
    );
    
    console.log(`adding layer ${i}`);
    addLayers(1);
  }
  renderFromArray();
}

document.getElementById("loadBtn").addEventListener("click", () => {
  const fileInput = document.getElementById("loadInput");
  if (fileInput.files.length === 0) return alert("Please select a file");
  
  const file = fileInput.files[0];
  loadMap(file);
});

document.getElementById("exportMap").addEventListener("click", () => {
  exportMap(whereTilesHaveBeenPlaced);
});

function drawSpriteSheet() {
  spriteSheetHolder.clearRect(0, 0, 640, spriteSheet.height);
  spriteSheetHolder.drawImage(spriteSheet, 0, 0);
  spriteSheetHolder.fillStyle = "rgba(255, 255, 255, 0.15)"
  spriteSheetHolder.beginPath()
  spriteSheetHolder.fillRect(0, (0 + (selectedRow * spriteSize)), 640, spriteSize);
  spriteSheetHolder.stroke();
  spriteSheetHolder.strokeStyle = "red"
  spriteSheetHolder.beginPath()
  spriteSheetHolder.rect(currentTile * spriteSize, (0 + (selectedRow * spriteSize)), spriteSize, spriteSize);
  spriteSheetHolder.stroke();
}

spriteSheetC.addEventListener('mousedown', function(e) {
  const rect = spriteSheetC.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const column = Math.floor(x / spriteSize);
  const row = Math.floor(y / spriteSize);

  currentTile = column;
  selectedRow = row;
  updatePreview();
  drawSpriteSheet();

  console.log(`${column}, ${row}`);
});




// Layers

function switchToLayer(layer) {
  try {
    document.getElementById("layer" + Number(currentLayer + 1)).style.backgroundColor = "";
  } catch(er) {
    console.log("Layer was removed");
  }
  currentLayer = layer-1;
  //console.log(`Switching to layer ${currentLayer}`);
  document.getElementById("layer" + layer).style.backgroundColor = "green";
}

function addLayers(amount) {
  if (layersArray.length < 10) {
    let html = ""; 
    const currentAmountOfLayers = layersArray.length;
    for (let i = 0; i < (currentAmountOfLayers + amount); i++) {
      html += `<div class="layerButtonSub" id="layer${i+1}">
        <button class="layerButton" onclick="switchToLayer(${i+1})">${i+1}</button>
        <button onclick="changeLayerVis(${i+1}, layersToNotRender.has(${i+1}), this)" class="${layersToNotRender.has(i + 1) ? "show" : "hide"}">${layersToNotRender.has(i + 1) ? "Show" : "Hide"}</button>
        <button onclick="deleteLayer(${i+1})" class="delete">Delete</button>
      </div> \n`;
    }
    console.log(layersArray.length);
    if (amount > 0) { layersArray.push(new Set()) }
    if(layersArray.length < 10) {
      html += `<div class="layerButtonSub"> \n <button class="layerButton" onclick="addLayers(1)">+</button> \n </div>`; 
    }
    document.getElementById('layerButtons').innerHTML = html;
    
  } else {
    console.log("max layers reached");
  }
  if (amount > 0) {
    switchToLayer(layersArray.length);
  }
}

function deleteLayer(layer) {
  layersArray.splice(layer-1, 1);
  addLayers(0);
  switchToLayer(layersArray.length);
  renderFromArray();
}

function changeLayerVis(layer, show, thisElement) {
  if (show) {
    layersToNotRender.delete(layer);
    thisElement.innerHTML = "Hide";
    thisElement.classList.remove("show");
    thisElement.classList.add("hide");
  } else {
    layersToNotRender.add(layer);
    thisElement.innerHTML = "Show";
    thisElement.classList.remove("hide");
    thisElement.classList.add("show");
  }
  renderFromArray();
}