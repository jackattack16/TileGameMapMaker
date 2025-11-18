window.addEventListener('load', function() {
  renderCanvas();
});

window.addEventListener("resize", (event) => { 
  renderCanvas();
})

cElement.addEventListener("wheel", (event) => { 
  event.preventDefault(); // Prevent page scrolling
  
  let modifyer = 1;
  if (event.shiftKey) { modifyer++ }
  
  // Get mouse position relative to canvas
  const rect = cElement.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  
  // Convert mouse position to world coordinates before zoom
  const worldX = (mouseX / zoom) + cameraPosition.x;
  const worldY = (mouseY / zoom) + cameraPosition.y;

  
  if (event.deltaY > 0) {
    zoom += -0.1 * modifyer;
    zoom = clampValue(zoom, 0.1, 10);
  } else if (event.deltaY < 0) {
    zoom += 0.1 * modifyer;
    zoom = clampValue(zoom, 0.1, 10);
  }
  
  // Adjust camera so the world position under the mouse stays the same
  cameraPosition.x = worldX - (mouseX / zoom);
  cameraPosition.y = worldY - (mouseY / zoom);
  
  renderCanvas();
});

document.addEventListener("keydown", function(e) {
  const keyName = e.key;

  switch (keyName) {
    case "-":
      zoom -= 0.1;
      zoom = clampValue(zoom, 0.1, 10);
      renderCanvas();
      break;
    case "=":
      zoom += 0.1;
      zoom = clampValue(zoom, 0.1, 10);
      renderCanvas();
      break;
      case " ":
        // Calculate the center of the map in world coordinates
        const mapCenterX = (mapWidth * SPRITE_SIZE) / 2;
        const mapCenterY = (mapHeight * SPRITE_SIZE) / 2;
        
        // Get canvas dimensions
        const canvasWidth = cElement.width;
        const canvasHeight = cElement.height;
        
        // Calculate zoom to fit the entire map on screen (with some padding)
        const padding = 1.1; // 10% padding
        const zoomToFitWidth = canvasWidth / (mapWidth * SPRITE_SIZE * padding);
        const zoomToFitHeight = canvasHeight / (mapHeight * SPRITE_SIZE * padding);
        zoom = Math.min(zoomToFitWidth, zoomToFitHeight);
        zoom = clampValue(zoom, 0.1, 5); // Respect your zoom limits
        
        // Position camera so map center is at canvas center
        cameraPosition.x = mapCenterX - (canvasWidth / 2 / zoom);
        cameraPosition.y = mapCenterY - (canvasHeight / 2 / zoom);
        
        renderCanvas(cameraPosition.x, cameraPosition.y);
        break;
  }
});

cElement.addEventListener('mousedown', function(e) {
  console.log(snapMouseToGrid(e));
  if (e.button !== 2) {
    isDragging = true;
    initialDragPos = getCursorPosition(e);
    cameraDragStartPos = { x: cameraPosition.x, y: cameraPosition.y };
  }
});

function snapMouseToGrid(event) {
  const rect = cElement.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  
  // Convert to world coordinates
  const worldX = (mouseX / zoom) + cameraPosition.x;
  const worldY = (mouseY / zoom) + cameraPosition.y;
  
  // Snap to grid
  const snappedTileX = Math.round(worldX / SPRITE_SIZE);
  const snappedTileY = Math.round(worldY / SPRITE_SIZE);
  
  return {
    tileX: snappedTileX,
    tileY: snappedTileY,
    worldX: snappedTileX * SPRITE_SIZE,
    worldY: snappedTileY * SPRITE_SIZE,
    screenX: (snappedTileX * SPRITE_SIZE - cameraPosition.x) * zoom,
    screenY: (snappedTileY * SPRITE_SIZE - cameraPosition.y) * zoom
  };
}

cElement.addEventListener('mousemove', function(e) {
  if (isDragging) { 
    let newDragPos = getCursorPosition(e);

    const xDistance = initialDragPos.x - newDragPos.x;
    const yDistance = initialDragPos.y - newDragPos.y;

    cameraPosition.x = cameraDragStartPos.x + (xDistance / Math.abs(zoom));
    cameraPosition.y = cameraDragStartPos.y + (yDistance / Math.abs(zoom));

    renderCanvas();
  }
});

cElement.addEventListener('mouseup', () => {
  isDragging = false;
});

cElement.addEventListener('mouseleave', () => {
  isDragging = false; 
});

cElement.addEventListener('contextmenu', (e) => {
  e.preventDefault(); // stops the right-click menu from showing
});



document.addEventListener("DOMContentLoaded", () => {
  // Load editor action buttons
  {
    let editorActionButtons = document.getElementsByClassName("editor-action-button");
    for(let i = 0; i < editorActionButtons.length; i++) {
      editorActionButtons[i].addEventListener("click", function(e) {
        const buttonName = e.explicitOriginalTarget.name;
        const buttonArray = Array.from(editorActionButtons);
        switch (buttonName) {
          case "zoomOut":
            zoom -= 0.1;
            zoom = clampValue(zoom, 0.1, 10);
            renderCanvas();
            break;
          case "zoomIn":
            zoom += 0.1;
            zoom = clampValue(zoom, 0.25, 5);
            renderCanvas();
            break;
          case "panMode":
            buttonArray.forEach((buttonArray, idx) => {
              buttonArray.classList.toggle("selected", idx == i);
            });
            currentMode = buttonName;
            // Add mode switching function
            break;
          case "selectMode":
            buttonArray.forEach((buttonArray, idx) => {
              buttonArray.classList.toggle("selected", idx == i);
            });
            currentMode = buttonName;
            // Add mode switching function
            break;
          case "editMode":
            buttonArray.forEach((buttonArray, idx) => {
              buttonArray.classList.toggle("selected", idx == i);
            });
            currentMode = buttonName;
            // Add mode switching function
            break;
          case "eraseMode":
            buttonArray.forEach((buttonArray, idx) => {
              buttonArray.classList.toggle("selected", idx == i);
            });
            currentMode = buttonName;
            // Add mode switching function
            break;
        }
      });
    }
  }

// Configuration for each input group
const inputConfigs = {
  'map-color': {
    type: 'color',
    defaultValue: () => getComputedStyle(document.documentElement)
      .getPropertyValue("--primary-bg-color")
      .trim(),
    onChange: (value) => {
      cElement.style.backgroundColor = value;
    }
  },
  'map-infinite': {
    type: 'checkbox',
    defaultValue: false,
    onChange: (checked) => {
      infiniteMap = checked;
      if (infiniteMap) {
        const mapwidth = document.getElementsByName("map-width");
        mapwidth[0].type = "text";
        mapwidth[0].value = "∞";
        mapwidth[0].readOnly = true;
        mapwidth[0].style.userSelect = "none";

        const mapheight = document.getElementsByName("map-height");
        mapheight[0].type = "text";
        mapheight[0].value = "∞";
        mapheight[0].readOnly = true;
        mapheight[0].style.userSelect = "none";
      } else {
        const mapwidth = document.getElementsByName("map-width");
        mapwidth[0].type = "number";
        mapwidth[0].value = mapWidth;
        mapwidth[0].readOnly = false;
        mapwidth[0].style.userSelect = "none";

        const mapheight = document.getElementsByName("map-height");
        mapheight[0].type = "number";
        mapheight[0].value = mapHeight;
        mapheight[0].readOnly = false;
        mapheight[0].style.userSelect = "";
      }
      renderCanvas();
    }
  },
  'grid-color': {
    type: 'color',
    defaultValue: '#515151',
    onChange: (value) => {
      gridColor = value;
      renderCanvas();
    }
  },
  'map-gridlines': {
    type: 'checkbox',
    defaultValue: true,
    onChange: (checked) => {
      renderGridLines = checked;
      renderCanvas();
    }
  },
  'undo-map-color': {
    type: 'button',
    onClick: () => {
      const cssValue = getComputedStyle(document.documentElement)
        .getPropertyValue("--primary-bg-color")
        .trim();
      const mapColorElement = document.getElementsByName("map-color")[0];
      mapColorElement.value = cssValue;
      cElement.style.backgroundColor = cssValue;
    }
  },
  'undo-grid-color': {
    type: 'button',
    onClick: () => {
      const gridColorElement = document.getElementsByName("grid-color")[0];
      gridColorElement.value = '#515151';
      gridColor = '#515151';
      renderCanvas();
    }
  },
  'map-width': {
    type: 'number',
    defaultValue: 128,
    onChange: (value) => {
      mapWidth = value;
      console.log('Map width:', value);
      renderCanvas();
    }
  },
  'map-height': {
    type: 'number',
    defaultValue: 128,
    onChange: (value) => {
      mapHeight = value;
      console.log('Map height:', value);
      renderCanvas();
    }
  }
};

// Initialize all inputs
function initializeInputs() {
  Object.entries(inputConfigs).forEach(([name, config]) => {
    const element = document.getElementsByName(name)[0];
    if (!element) return;

    switch (config.type) {
      case 'color':
        const colorValue = typeof config.defaultValue === 'function' 
          ? config.defaultValue() 
          : config.defaultValue;
        element.value = colorValue;
        if (config.onChange) config.onChange(colorValue);
        element.addEventListener("change", (e) => {
          config.onChange(e.target.value);
        });
        break;

      case 'checkbox':
        element.checked = config.defaultValue;
        element.addEventListener("change", (e) => {
          config.onChange(e.target.checked);
        });
        break;

      case 'number':
        element.value = config.defaultValue;
        element.addEventListener("change", (e) => {
          config.onChange(Number(e.target.value));
        });
        break;

      case 'button':
        element.addEventListener("click", (e) => {
          config.onClick(e);
        });
        break;

      default:
        console.warn(`Unknown input type: ${config.type}`);
    }
  });
}

// Call initialization
initializeInputs();
  
});