let bgColor;
let x = 0;
let buttonRow;
let buttonRow2

function setup() {
  let canvas = createCanvas(400, 300);
  canvas.parent('sketch-holder');

  bgColor = color(200);

  // Skapa en div för knapparna
  buttonRow = createDiv();
  buttonRow.parent('sketch-holder');
  buttonRow.style('margin', '10px');
  buttonRow.id('button-row');

  // Knapp 1
  let bgButton = createButton('Byt bakgrund');
  bgButton.class('button-primary');
  bgButton.parent(buttonRow);
  bgButton.mousePressed(() => {
    bgColor = color(random(255), random(255), random(255));
  });

  // Knapp 2
  let startButton = createButton('Starta');
  startButton.parent(buttonRow);
  startButton.mousePressed(() => {
    loop();
  });

  // Knapp 3
  let stopButton = createButton('Stoppa<br>soppa');
  stopButton.parent(buttonRow);
  stopButton.mousePressed(() => {
    noLoop();
  });

  noLoop(); // startar pausat

  // Knapp 4 (dummy)
  let dummyButton = createButton('Dummy');
    dummyButton.parent(buttonRow);
    dummyButton.mousePressed(() => {
    noLoop();
  });

  noLoop(); // startar pausat

  buttonRow2 = createDiv();
  buttonRow2.parent('sketch-holder');
  buttonRow2.style('margin', '10px');
  buttonRow2.id('button-row2');

  // Knapp 5 (dummy)
  let dummyButton2 = createButton('Dummy');
    dummyButton2.parent(buttonRow2);
    dummyButton2.mousePressed(() => {
    noLoop();
  });

  noLoop(); // startar pausat
}

function draw() {
  background(bgColor);
  fill(255, 0, 0);
  ellipse(x, height / 2, 50, 50);
  x += 2;
  if (x > width) x = 0;
}
