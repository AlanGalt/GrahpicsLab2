class Figure {
  constructor() {
    this.initial = [];
    this.transformed = [];
    this.resultMatrix = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
    this.translation = {
      x: 0,
      y: 0
    };
    this.scaling = {
      x: 0,
      y: 0
    }
    this.reflection = {
      x: 0,
      y: 0
    }
    this.rotation = {
      x: 0,
      y: 0,
      angle: 0
    }
    this.current = "";
  }

  translate() {
    let x = this.translation.x;
    let y = this.translation.y;
    const translationMatrix = [
      [1, 0, 0],
      [0, 1, 0],
      [x, y, 1]
    ];
    this.resultMatrix = matrixDot(this.resultMatrix, translationMatrix);
    this.updateTransformed();
    this.updateTable();
  }

  scale() {
    let x = this.scaling.x;
    let y = this.scaling.y;
    const scalingMatrix = [
      [x, 0, 0],
      [0, y, 0],
      [0, 0, 1]
    ];
    
    this.resultMatrix = matrixDot(this.resultMatrix, scalingMatrix);
    
    this.updateTransformed();
    this.updateTable();
  }
  
  reflect() {
    // saving previous values to later restore them
    const [scaleX, scaleY] = [this.scaling.x, this.scaling.y];
    const [translateX, translateY] = [this.translation.x, this.translation.y];

    this.translation.x = -this.reflection.x;
    this.translation.y = -this.reflection.y;
    this.translate();

    this.scaling.x = -1;
    this.scaling.y = -1;
    this.scale();

    this.translation.x = this.reflection.x;
    this.translation.y = this.reflection.y;
    this.translate();

    [this.scaling.x, this.scaling.y] = [scaleX, scaleY];
    [this.translation.x, this.translation.y] = [translateX, translateY];
  }

  rotate() {
    const [translateX, translateY] = [this.translation.x, this.translation.y];
    const angle = -transformed.radians(this.rotation.angle);
    const rotationMatrix = [
      [Math.cos(angle), -Math.sin(angle), 0],
      [Math.sin(angle), Math.cos(angle),  0],
      [0, 0, 1]
    ];

    this.translation.x = -this.rotation.x;
    this.translation.y = -this.rotation.y;
    this.translate();

    this.resultMatrix = matrixDot(this.resultMatrix, rotationMatrix);

    this.translation.x = this.rotation.x;
    this.translation.y = this.rotation.y;
    this.translate();
    [this.translation.x, this.translation.y] = [translateX, translateY];
  }

  updateTransformed() {
    const result = [];
    for(let point of this.initial) {
      let [pointX, pointY] = toWorld(point.x, point.y);
      let vec = [pointX, pointY, 1];
      let [x1, y1] = vectorMatrixDot(vec, this.resultMatrix);
      [x1, y1] = toScreen(x1, y1);
      result.push(new Point(x1, y1));
    }
    this.transformed = result;
  }
  
  updateTable() {
    for (let i = 0; i < 9; i++) {
      let cell = document.getElementById(`cell${i}`);
      let row = Math.floor(i / 3);
      let col = i % 3;
      if (i === 6 || i === 7) {
        cell.value = (Math.round((this.resultMatrix[row][col] / transformed.step) / 2 * 10) / 10);
      } else {
        cell.value = Math.round(this.resultMatrix[row][col] * 10) / 10;
      }
    }
  }

  resetResultMatrix() {
    this.resultMatrix = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ]; 
  }

  resetTransfromations() {
    this.translation = {
      x: 0,
      y: 0
    };
    this.scaling = {
      x: 0,
      y: 0
    }
    this.reflection = {
      x: 0,
      y: 0
    }
    this.rotation = {
      x: 0,
      y: 0,
      angle: 0
    }
  }
}