
function exportFile() {
  let mapProperties = [];
  if(infiniteMap) {
    let xMin = null;
    let xMax =  null;
    let yMin = null;
    let yMax =  null;
    for (let tileArray of tileMap) 
      {
        const tile = tileArray[1];

        if (tile.x > xMax) {
          xMax = tile.x
        }
        if (tile.x < xMin) {
          xMin = tile.x
        }

        if (tile.y > yMax) {
          yMax = tile.y
        }
        if (tile.y < yMin) {
          yMin = tile.y
        }
      }
      mapProperties = {
        "height": yMax - yMin, 
        "width": xMax- xMin
      };
  } else {
    mapProperties = {
      "height": mapHeight, 
      "width": mapWidth
    };
  }

  let mergedTileMap = [];
  
  for (let tileArray of tileMap) 
  {
    const tile = tileArray[1];
    mergedTileMap.push(tile);
  }

  let output = [];
  output.push(mapProperties);
  output.push(mergedTileMap);

  

  const blob = new Blob([JSON.stringify(output)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "test.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function loadFile() {
  const fileInput = document.getElementById('inputFile');
  let text;
  text = await fileInput.files[0].text();
  text = JSON.parse(text);
  console.log(text[0]);
  
  let mapWidthElement = document.getElementsByName('map-width')[0];
  let mapHeightElement = document.getElementsByName('map-height')[0];

  mapWidthElement.value = text[0].width;
  mapHeightElement.value = text[0].height;
  mapWidth = text[0].width;
  mapHeight = text[0].height;

  tileMap.clear();
  for (const value of text[1]) {
    tileMap.set((value.x + "," + value.y), value);
  }
  
  renderCanvas();
}

function getByValue(map, searchValue) {
  for (let [key, value] of map.entries()) {
    if (value === searchValue)
      return key;
  }
}