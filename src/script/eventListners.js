window.addEventListener('load', function() {
  renderCanvas(cameraPosition[0], cameraPosition[1]);
});

window.addEventListener("resize", (event) => { 
  renderCanvas(cameraPosition[0], cameraPosition[1]);
})

document.addEventListener("keydown", function(e) {
  const keyName = e.key;

  switch (keyName) {
    case "-":
      zoom -= 0.1;
      zoom = clampValue(zoom, 0.5, 5);
      renderCanvas(cameraPosition[0], cameraPosition[1]);
      break;
    case "=":
      zoom += 0.1;
      zoom = clampValue(zoom, 0.5, 5);
      renderCanvas(cameraPosition[0], cameraPosition[1]);
      break;
    case " ":
      cameraPosition = [0, 0];
      renderCanvas(cameraPosition[0], cameraPosition[1]);
  }
})

cElement.addEventListener('mousedown', function(e) {
  if (currentMode === "panMode") {
    isDragging = true;
    initialDragPos = getCursorPosition(e);
    cameraDragStartPos = cameraPosition;
  }
});

cElement.addEventListener('mousemove', function(e) {
  if (isDragging && currentMode === "panMode") { 
    let newDragPos = getCursorPosition(e);

    const xDistance = initialDragPos[0] - newDragPos[0];
    const yDistance = initialDragPos[1] - newDragPos[1];

    cameraPosition = [(cameraDragStartPos[0] + xDistance) / Math.abs(zoom), (cameraDragStartPos[1] + yDistance) / Math.abs(zoom)]
    renderCanvas(cameraPosition[0], cameraPosition[1]);
  }
});

cElement.addEventListener('mouseup', () => {
  isDragging = false;
});

cElement.addEventListener('mouseleave', () => {
  isDragging = false; 
});



document.addEventListener("DOMContentLoaded", () => {
  let editorActionButtons = document.getElementsByClassName("editor-action-button");
  for(let i = 0; i < editorActionButtons.length; i++) {
    editorActionButtons[i].addEventListener("click", function(e) {
      const buttonName = e.explicitOriginalTarget.name;
      const buttonArray = Array.from(editorActionButtons);
      switch (buttonName) {
        case "zoomOut":
          zoom -= 0.1;
          zoom = clampValue(zoom, 0.5, 5);
          renderCanvas(cameraPosition[0], cameraPosition[1]);
          break;
        case "zoomIn":
          zoom += 0.1;
          zoom = clampValue(zoom, 0.25, 5);
          renderCanvas(cameraPosition[0], cameraPosition[1]);
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
});