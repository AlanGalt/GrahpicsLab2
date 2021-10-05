const width = 550;
const height = 550;
let hideAxis = false;
let hideGrid = false;
let timerId;

const figure = new Figure();

const canvasContainer = document.getElementById("canvas-container");

const initial = new p5(initialSketch, canvasContainer);
const transformed = new p5(transformedSketch, canvasContainer);

const translateBtn = document.getElementById("translate-btn");
const scaleBtn = document.getElementById("scale-btn");
const reflectBtn = document.getElementById("reflect-btn");
const rotateBtn = document.getElementById("rotate-btn");
const interval = document.getElementById("rpt-interval");
const stopBtn = document.getElementById("stop-btn");

const controls = document.querySelectorAll("input,button");

for (let i = 0; i < controls.length; i++) { // disable controls
  controls[i].disabled = true;
}

translateBtn.onclick = () => {
  reset();
  figure.current = "translate";
  transformed.translate = true;
  transformed.reflect = false;
  transformed.scale = false;
  transformed.rotate = false;
}

scaleBtn.onclick = () => {
  reset();
  figure.current = "scale";
  let x = parseFloat(document.getElementById("x-scale").value);
  let y = parseFloat(document.getElementById("y-scale").value);
  figure.scaling.x = x;
  figure.scaling.y = y;
  figure.resetResultMatrix();
  figure.scale();
  repeat();
}

reflectBtn.onclick = () => {
  reset();
  figure.current = "reflect";
  transformed.reflect = true;
  transformed.translate = false;
  transformed.scale = false;
  transformed.rotate = false;
}

rotateBtn.onclick = () => {
  reset();
  figure.current = "rotate";
  figure.rotation.angle = parseFloat(document.getElementById("rotate-angle").value);
  if (!figure.rotation.angle) return;
  transformed.rotate = true;
  transformed.reflect = false;
  transformed.scale = false;
  transformed.translate = false;
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

document.getElementById("reset-btn").onclick = () => {
  reset();
  document.getElementById("x-scale").value = "1";
  document.getElementById("y-scale").value = "1";
  document.getElementById("rotate-angle").value = "0";
  document.getElementById("rpt-interval").value = "1";
}

stopBtn.onclick = () => {
  if (stopBtn.innerText === "Остановить" && figure.current.length) {
    clearTimeout(timerId);
    stopBtn.innerText = "Продолжить";
  } else {
    stopBtn.innerText = "Остановить";
    repeat(0);
  } 
}

function repeat(start = parseFloat(interval.value) * 1000) {
  if(!figure.current.length) return;
  stopBtn.disabled = false;
  timerId = setTimeout(function tick() {
    figure[figure.current]();
    console.log("REPEATING");
    timerId = setTimeout(tick, parseFloat(interval.value) * 1000);
  }, start);
}

function reset() {
  clearTimeout(timerId);
  stopBtn.disabled = true;
  figure.transformed = figure.initial;
  stopBtn.innerText = "Остановить";
  figure.resetResultMatrix();
  figure.resetTransfromations();
  figure.updateTable();
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