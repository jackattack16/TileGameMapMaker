function rotateTile(rotation) {
  console.log(rotation);

  for (let tileArray of tileMap) {
    const tile = tileArray[1];
    if(tile.selected) {
      switch (rotation) {
        case "rotate-right":
          tile.rotation += 90;
          break;
        case "rotate-left":
          tile.rotation -= 90;
        case "flip-h":
          tile.mirrorHorizontal ^= true;
          break;
        case "flip-v":
          tile.mirrorVertical ^= true;
          break;
      }
      renderCanvas();
    }
  }
}

function clearSelected() {
  for (let tileArray of tileMap) {
    const tile = tileArray[1];
    if(tile.selected) {
      tile.selected = false;
    }
  }
}

function isAnyTileSelected() {
  for (let tileArray of tileMap) {
    const tile = tileArray[1];
    if(tile.selected) {
      return true;
    }
  }
}

// TODO: Make work in other dragging direction
function addTilesToSelected() {
  const tileSelectionBox = {0: [], 1: [], 2: [], 3: []} // topLeft, topRight, bottomLeft, bottomRight
  
  let i = 0;
  for (const property in selectionBox) {
    tileSelectionBox[i] = cordToTiles(selectionBox[property].split(",")[0],selectionBox[property].split(",")[1]);
    i++;
  }
  
  const xMin = tileSelectionBox[0][0] - 1;
  const xMax = tileSelectionBox[1][0];
  const yMin = tileSelectionBox[1][1] - 1;
  const yMax = tileSelectionBox[3][1];

  for (const [key, value] of tileMap.entries()) {
    if ((key.split(",")[0] > xMin) && (key.split(",")[0] < xMax) && (key.split(",")[1] < yMax) && (key.split(",")[1] > yMin)) {
      value.selected = true;
    }
  }
}