const width = 550;
const height = 550;
let hideAxis = false;
let hideGrid = false;

const figure = new Figure();

const canvasContainer = document.getElementById("canvas-container");

const initial = new p5(initialSketch, canvasContainer);
const transformed = new p5(transformedSketch, canvasContainer);

const translateBtn = document.getElementById("translate-btn");
const scaleBtn = document.getElementById("scale-btn");
const reflectBtn = document.getElementById("reflect-btn");
const rotateBtn = document.getElementById("rotate-btn");

// const zoomSlider = document.getElementById("zoom-input");

const controls = document.querySelectorAll("input,button");

for (let i = 0; i < controls.length; i++) { // disable controls
  controls[i].disabled = true;
}


translateBtn.onclick = () => {
  transformed.translate = true;
}

scaleBtn.onclick = () => {
  let x = parseFloat(document.getElementById("x-scale").value);
  let y = parseFloat(document.getElementById("y-scale").value);
  figure.scaling.x = x;
  figure.scaling.y = y;
  figure.scale();
}

reflectBtn.onclick = () => {
  transformed.reflect = true;
}

rotateBtn.onclick = () => {
  figure.rotation.angle = parseFloat(document.getElementById("rotate-angle").value);
  if (!figure.rotation.angle) return;
  transformed.rotate = true;
}

for (let i = 0; i < 9; i++) { // handle matrix changes
  let cell = document.getElementById(`cell${i}`);
  let row = Math.floor(i / 3);
  let col = i % 3;
  if(i === 6 || i === 7) {
    cell.onchange = () => {
      figure.resultMatrix[row][col] = parseFloat(cell.value) * transformed.step * 2;
      figure.updateTransformed();
    }
  } else {
    cell.onchange = () => {
      figure.resultMatrix[row][col] = parseFloat(cell.value);
      figure.updateTransformed();
    }
  }
  
}

document.getElementById("hide-grid").onchange = () => {
  hideGrid = !hideGrid;
  initial.redraw();
}

document.getElementById("hide-axis").onchange = () => {
  hideAxis = !hideAxis;
  initial.redraw();
}

document.getElementById("hide-helpers").onchange = () => {
  transformed.hideHelpers = !transformed.hideHelpers;
}

function toWorld(screenX, screenY) {
  let worldX = (screenX - width / 2);
  let worldY = -(screenY - height / 2);
  return [worldX, worldY];
}

function toScreen(worldX, worldY) {
  let screenX = worldX + width / 2;
  let screenY = -worldY + height / 2;
  return [screenX, screenY];
}

// zoomInput.oninput = () => {
//   transformed.zoom = parseFloat(zoomInput.value);
// }