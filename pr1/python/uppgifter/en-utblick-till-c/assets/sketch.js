let t = 0; /*                                          Elapsed time       */
const x = []; /*                                       x-koordinates.     */
const y = []; /*                                       y-coordinates      */
const h = 400; /*                                      Screen height      */
const w = (400 * 16) / 9; /*                           Screen width       */
const s = 20; /*                                       Square side length */
const y0 = h / 2; /*                                   Equilibrium level  */
const A = 180; /*                                      Amplitude.         */
let N = 49; /*                                       Number of squares  */
let T = 10; /*                                       Period time (secs) */
const P = 30; /*                                       Padding in x       */
let NUM_PERIODS = 2; /*.                             Number of periods. */
let omega = -(2 * Math.PI) / T; /*                   Angular frequency  */
let phi = -(2 * Math.PI * NUM_PERIODS) / (N - 1); /* Spatial phaseshift */
/*                                                 between adjacent nodes */
let anim = true;
const BG_COLOR = [50, 50, 60];
const GRID_COLOR = [140, 140, 160];
const WAVE_COLOR = [255, 165, 0];
const IN_PHASE_COLOR = [0, 200, 100];
const OUT_PHASE_COLOR = [150, 80, 220];

function setup() {
  createCanvas(w, h);
  background(BG_COLOR);

  // Button colors
  let canvas = createCanvas(400, 400); // Ange önskad storlek
  canvas.parent('sketch-container'); // Koppla canvaselementet till div:en
  let BGCol = color(200, 130, 0); // Background color
  let FGCol = color(255, 255, 255); // Text color
  let BorderCol = color(255, 180, 50); // Border color

  let toggleButton = createButton("Toggle<br>animation");
  toggleButton.style("font-size", "28px");
  toggleButton.style("background-color", BGCol);
  toggleButton.style("color", FGCol);
  toggleButton.style("border-color", BorderCol);
  toggleButton.mousePressed(toggle_anim);
  toggleButton.position(15, 420);

  let incButton = createButton("Increase<br>speed");
  incButton.style("font-size", "28px");
  incButton.style("background-color", BGCol);
  incButton.style("color", FGCol);
  incButton.style("border-color", BorderCol);
  incButton.mousePressed(increaseSpeed);
  incButton.position(155, 420);

  let decButton = createButton("Decrease<br>speed");
  decButton.style("font-size", "28px");
  decButton.style("background-color", BGCol);
  decButton.style("color", FGCol);
  decButton.style("border-color", BorderCol);
  decButton.mousePressed(decreaseSpeed);
  decButton.position(280, 420);

  let decParticlesB = createButton("Decrease<br>#particles");
  decParticlesB.style("font-size", "28px");
  decParticlesB.style("background-color", BGCol);
  decParticlesB.style("color", FGCol);
  decParticlesB.style("border-color", BorderCol);
  decParticlesB.mousePressed(decParticles);
  decParticlesB.position(415, 420);

  let incParticlesB = createButton("Increase<br>#particles");
  incParticlesB.style("font-size", "28px");
  incParticlesB.style("background-color", BGCol);
  incParticlesB.style("color", FGCol);
  incParticlesB.style("border-color", BorderCol);
  incParticlesB.mousePressed(incParticles);
  incParticlesB.position(558, 420);
  
  let incPeriodsB = createButton("Increase<br>#periods");
  incPeriodsB.style("font-size", "28px");
  incPeriodsB.style("background-color", BGCol);
  incPeriodsB.style("color", FGCol);
  incPeriodsB.style("border-color", BorderCol);
  incPeriodsB.mousePressed(incPeriods);
  incPeriodsB.position(220, 510);
  
  let decPeriodsB = createButton("Decrease<br>#periods");
  decPeriodsB.style("font-size", "28px");
  decPeriodsB.style("background-color", BGCol);
  decPeriodsB.style("color", FGCol);
  decPeriodsB.style("border-color", BorderCol);
  decPeriodsB.mousePressed(decPeriods);
  decPeriodsB.position(360, 510);
}

function render() {
  background(BG_COLOR);

  // Transform coordinates to center in current padding
  const renderX = x.map((xi) => P + ((w - 2 * P) / w) * xi - s / 2);
  const renderY = y.map((yi) => y0 - s / 2 + yi * (A - s / 2));

  // Vertical divider position indices
  const i1 = floor(N / 2) - floor(N / (2 * NUM_PERIODS)); // Left divider
  const i2 = floor(N / 2) + floor(N / (2 * NUM_PERIODS)); // Right divider
  const i3 = floor(N / 2); // Central divider

  // Calc. divider x-vals, shifted to center of oscillating squares
  const X1 = renderX[i1] + s / 2;
  const X2 = renderX[i2] + s / 2;
  const X3 = renderX[i3] + s / 2;

  // Horisontal dividers, shifted to just touch the oscillating squares
  const MAX_Y = y0 - A + (s / 2) * 0;
  const MIN_Y = y0 + A + (s / 2) * 0;
  const MID_Y = h / 2;

  // Render the dividers
  stroke(GRID_COLOR);
  strokeWeight(0.25);
  line(X1, 0, X1, h);
  line(X2, 0, X2, h);
  line(X3, 0, X3, h);
  line(0, MAX_Y, w, MAX_Y);
  line(0, MIN_Y, w, MIN_Y);
  line(0, MID_Y, w, MID_Y);

  // Render loop
  for (let i = 0; i < N; i++) {
    let xi = renderX[i]; // Get current x
    let yi = renderY[i]; // Get current y

    if (i == i1 || i == i2) {
      fill(IN_PHASE_COLOR);
      rect(xi, yi, s, s);
    } else if (i == floor(N / 2)) {
      fill(OUT_PHASE_COLOR);
      rect(xi, yi, s, s);
    } else {
      fill(WAVE_COLOR);
      rect(xi, yi, s, s);
    }
  }
}

function draw() {
  for (let i = 0; i < N; i++) {
    // Will be transformed to fit in viewport when rendering
    y[i] = Math.sin(phi * i - omega * t);
    x[i] = (w / (N - 1)) * i;
  }
  render();
  if (anim) {
    t += deltaTime / 1000; // milli seconds to seconds
  }
}

function toggle_anim() {
  anim = !anim;
  console.log("Animation is", anim ? "ON" : "OFF");
}

function increaseSpeed() {
  if (T > 1.3) {
    T /= 1.5;
    t /= 1.5;
  }
  omega = -(2 * Math.PI) / T;
  console.log("Increase speed!", omega);
}

function decreaseSpeed() {
  if (T < 25) {
    T *= 1.5;
    t *= 1.5;
  }
  omega = -(2 * Math.PI) / T;
}

function decParticles() {
  if (N >= 8) {
    N -= 4;
    phi = -(2 * Math.PI * NUM_PERIODS) / (N - 1);
  }
  console.log("Particle");
}

function incParticles() {
  if (N <= 65) {
    N += 4;
    phi = -(2 * Math.PI * NUM_PERIODS) / (N - 1);
  }
}

function incPeriods() {
  if (NUM_PERIODS <= 3) {
    NUM_PERIODS++;
    phi = -(2 * Math.PI * NUM_PERIODS) / (N - 1);
  }
}

function decPeriods() {
  if (NUM_PERIODS >= 2) {
    NUM_PERIODS--;
    phi = -(2 * Math.PI * NUM_PERIODS) / (N - 1);
  }
}
