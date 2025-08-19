const waveSketch = (p) => {
  // Some constants
  const SCREEN_HEIGHT = 400;
  const SCREEN_WIDTH = (SCREEN_HEIGHT * 16) / 9;
  const pi = Math.PI;
  const NUM_POINTS = 200; // Num of x-vals
  const X1_NORM = 1 / 4; // Vertical gridline...
  const X2_NORM = 2 / 4; // ...positions in terms of...
  const X3_NORM = 3 / 4; // ...screenwidth
  const Y0 = 1 / 2; // Baseline's relative position
  const A_MAX = 0.9 / 2; // Maximum amplitude in terms of screenheight
  const A0 = 0.7; // Initial relative amplitude
  const V0 = 0.2; // Initial propagation speed, viewports per second
  const f0 = 0.4; // Initial frequency4typ
  const GRID_COLOR = [180, 160, 140];
  const BG_COLOR = [244, 232, 209];
  const WAVE_COLOR = [106, 140, 175];
  const PARTICLE_COLOR = [217, 79, 79];

  // The axis arrays
  const x = []; // x-axis
  const y = []; // y-axis

  // Variables
  let t = 0; // Running time, seconds
  let amp = A0;
  let v = V0; // Current propagation speed
  let f = f0;
  let lambda = v / f; // Wavelength
  let k = (2 * pi) / lambda; // Wave number
  let omega = k * v; // Angular speed
  let anim = true;

  // Visual elements
  let sketchHolder; // Visual representation of the whole app
  let canvas; // The graph area
  let controlRow; // Button and slider area
  let buttonAnim; // Button
  let sliderContainer;
  let ampSlider;
  let speedSlider;
  let freqSlider;
  let waveInfo; // The info box

  p.setup = () => {
    // All the content of app
    sketchHolder = p.select("#trans-wave"); // Use this selector in HTML
    // Uncomment to visaulize the sketchHolder area
    // sketchHolder.style("background-color", "lightblue");

    // Graph is drawn on canvas
    canvas = p.createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
    canvas.parent(sketchHolder);
    p.background(BG_COLOR);

    // Create controlRow
    controlRow = p.createDiv();
    controlRow.id("control-row");
    controlRow.class("control-row");
    controlRow.style("margin", "10px");
    controlRow.parent(sketchHolder);
    controlRow.style("background-color", "#F8F0E8");
    controlRow.style("width", "800px");
    controlRow.style("border-radius", "8px");
    // controlRow.style("box-shadow", "0 2px 4px rgba(0, 0, 0, 0.1)");
    controlRow.style("border-style", "solid");
    controlRow.style("border-width", "0.5px");
    controlRow.style("border-color", "black");

    // Create waveInfo
    waveInfo = p.createDiv();
    waveInfo.parent(sketchHolder);
    waveInfo.id("wave-info");
    waveInfo.class("wave-info");
    waveInfo.style("background-color", "#F8F0E8");
    waveInfo.style("width", "800px");
    waveInfo.style("border-radius", "8px");
    // waveInfo.style("box-shadow", "0 2px 4px rgba(0, 0, 0, 0.1)");
    waveInfo.style("margin", "10px");
    waveInfo.style("border-style", "solid");
    waveInfo.style("border-width", "0.5px");
    waveInfo.style("border-color", "black");

    waveInfo.html(`
      <div class="info-row">
        <span class="info-label">Frekvens:</span>
        <span class="info-value" id="freq-value">${p.nf(f, 1, 2)} Hz</span>
      </div>
      <div class="info-row">
        <span class="info-label">Utbredningshastighet:</span>
        <span class="info-value" id="speed-value">${p.nf(
          // nf converts value to string
          v, // The value
          1, // String width
          2 // Number of decimals
        )} viewport/s</span>
      </div>
      <div class="info-row">
        <span class="info-label">Amplitud:</span>
        <span class="info-value" id="amp-value">${
          p.int(amp * 100) + " %"
        }</span>        
  
      </div>
  `);

    // Function to create buttons
    const makeButton = (label, handler) => {
      const btn = p.createButton(label);
      btn.class("button button-primary");
      btn.parent(controlRow);
      btn.mousePressed(handler);
      return btn;
    };

    // Funktion för att skapa slider-etikett-par
    const makeSliderWithLabel = (labelText, min, max, start, step) => {
      sliderContainer = p.createDiv();
      sliderContainer.class("slider-container");
      sliderContainer.parent(controlRow);
      // Uncomment to visualize sliderContainer area.
      // sliderContainer.style("background-color", "lightblue");

      let slider = p.createSlider(min, max, start, step);
      slider.class("slider-control");
      slider.parent(sliderContainer);
      slider.style("margin", "10px 10px 5px 10px"); // Marginal runt slider

      let label = p.createP(labelText);
      label.class("slider-label");
      label.parent(sliderContainer);
      label.style("text-align", "center");
      label.style("margin", "0");

      return slider;
    };

    // Create button
    buttonAnim = makeButton("Animering<br>av / på", () => {
      anim = !anim;
    });

    // Create sliders with labels

    /* -- Frequency slider------------------------------------------------- */
    // Create
    freqSlider = makeSliderWithLabel(
      "Frekvens", // Slider label
      0, // Slider min
      1, // Slider max
      f0, // Slider init
      1/9); // Slider step

    // Update
    freqSlider.input(() => {
      f = freqSlider.value();
      f = f * 0.9 + 0.1;
      document.getElementById("freq-value").innerText = p.nf(f, 1, 2) + " Hz";
    });

    // Each slider's nominal values are in [0, 1] in steps of 1/9,
    // but transformed on update to a actual usable value and steps
    // of 0.1. The sliders doesn't need to be in this range, we could
    // set the real values directly in slider. But it's nice to separete.
    
    /* -- Speed slider---------------------------------------------------- */
    // Create
    speedSlider = makeSliderWithLabel(
      "Utbredningshastighet", // Slider label
      0, // Slider min
      1, // Slider max
      V0, // Slider init
      1 / 9 // Slider step
    );

    // Update
    speedSlider.input(() => {
      v = speedSlider.value();
      v = v * 0.9 + 0.1; // Transform to viewports / s, start at 0.1
      document.getElementById("speed-value").innerText =
        p.nf(v, 1, 2) + " viewport/s";
    });

    /* -- Amplitude slider------------------------------------------------- */
    // Create
    ampSlider = makeSliderWithLabel(
      "Amplitud", // Slider label
      0, // Slider min
      1, // Slider max
      A0, // Slider init
      1 / 9 // Slider step
    );

    // Update
    ampSlider.input(() => {
      amp = ampSlider.value();
      // Transform to parts of half window, start at 0.1
      amp = p.round(amp * 0.9 + 0.1, 1);
      document.getElementById("amp-value").innerText = p.int(amp * 100) + " %";
    });

    /* -------------------------------------------------------------------- */
  };

  p.draw = () => {
    lambda = v / f;
    k = (2 * pi * f) / v;
    omega = k * v;
    for (let i = 0; i <= NUM_POINTS; i++) {
      let xi = i / NUM_POINTS; // Interval: [0, 1]
      // Nominal values, to be transformed on render
      y[i] = -Math.sin(k * xi - omega * t);
      x[i] = xi;
    }

    render();
    if (anim) {
      t += p.deltaTime / 1000; // Add frametime in seconds
    }
  };

  function render() {
    p.background(BG_COLOR);

    const renderAmp = amp * SCREEN_HEIGHT * A_MAX;
    // Scale and translate y to viewport
    const renderY = y.map((yi) => renderAmp * yi + Y0 * SCREEN_HEIGHT);
    // Scale x-axis to viewport width
    const renderX = x.map((xi) => SCREEN_WIDTH * xi); 

    let x1 = x[p.floor(NUM_POINTS * X1_NORM)] * SCREEN_WIDTH;
    let x2 = x[p.floor(NUM_POINTS * X2_NORM)] * SCREEN_WIDTH;
    let x3 = x[p.floor(NUM_POINTS * X3_NORM)] * SCREEN_WIDTH;

    p.stroke(WAVE_COLOR);
    p.strokeWeight(2);
    p.beginShape();
    for (let i = 0; i < x.length; i++) {
      // Add vertices
      p.vertex(renderX[i], renderY[i]);
    }
    p.endShape(); // Plot vertices

    p.stroke(GRID_COLOR);
    p.strokeWeight(0.5);
    
    // Vertical gridlines
    p.line(x1, 0, x1, SCREEN_HEIGHT); // Left
    p.line(x2, 0, x2, SCREEN_HEIGHT); // Middle
    p.line(x3, 0, x3, SCREEN_HEIGHT); // Right
    
    // Horizontal gridlines
    p.line(
      0,
      Y0 * SCREEN_HEIGHT - A_MAX * SCREEN_HEIGHT,
      SCREEN_WIDTH,
      Y0 * SCREEN_HEIGHT - A_MAX * SCREEN_HEIGHT
    ); // Upper
    
    p.line(0, Y0 * SCREEN_HEIGHT, SCREEN_WIDTH, Y0 * SCREEN_HEIGHT); // Middle
    
    p.line(
      0,
      Y0 * SCREEN_HEIGHT + A_MAX * SCREEN_HEIGHT,
      SCREEN_WIDTH,
      Y0 * SCREEN_HEIGHT + A_MAX * SCREEN_HEIGHT
    ); // Lower

    p.fill(PARTICLE_COLOR);
    p.circle(x1, renderY[p.floor(NUM_POINTS * X1_NORM)], 10);
    p.circle(x2, renderY[p.floor(NUM_POINTS * X2_NORM)], 10);
    p.circle(x3, renderY[p.floor(NUM_POINTS * X3_NORM)], 10);
    p.noFill();
  }
};

// Create instance
new p5(waveSketch);

