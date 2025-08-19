const longSketch = (p) => {
  const SCREEN_HEIGHT = 400;
  const SCREEN_WIDTH = (SCREEN_HEIGHT * 16) / 9;
  const P_SIZE = 5;
  const BG_COLOR = [244, 232, 209];
  const WAVE_COLOR = [217, 79, 79];
  const PADDING = 4 * P_SIZE;
  const pi = Math.PI;
  const f0 = 0.4; // 0 maps to 0.5 Hz, 1 maps to 2 Hz
  const v0 = 1 / 3; // 0 maps to 0.1 viewports per second, 1 maps to 1
  const amp0 = 4 / 9;
  const ROW_DENS = 0.6; // Value 0 maps to 5 rows, 1 maps to 45
  const COL_DENS = 0.6; // Value 0 maps to 8 cols, 1 maps to 85

  const x = [];
  const y = [];

  let pixelXDensity; // Number of pixels in one row (horiozontally)
  let pixelYDensity; // Number of pixels in one column (vertically)
  let amp = amp0; // ([3, 30])
  let v = v0; // Propagation speed ([0.25, 1])
  let f = f0; // Frequency ([0.5, 2])
  let lambda = v / f;
  let k = (2 * pi) / lambda; // Wave number
  let omega = k * v; // Angular speed

  let t = 0;
  let anim = true;

  p.setup = () => {
    p.createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);

    // Skapa sketch-holder om den inte finns
    let sketchHolder = p.select("#sketch-holder-2");
    if (!sketchHolder) {
      sketchHolder = p.createDiv();
      sketchHolder.id("sketch-holder-2");
      sketchHolder.style("margin", "20px");
    }

    let canvas = p.createCanvas(711, 400);
    canvas.parent(sketchHolder);

    let controlRow;
    controlRow = p.createDiv();
    controlRow.id("control-row");
    controlRow.class("control-row");
    controlRow.style("margin", "10px");
    controlRow.parent(sketchHolder);
    controlRow.style("background-color", "#F8F0E8");
    controlRow.style("width", "800px");
    controlRow.style("border-radius", "8px");
    controlRow.style("border-style", "solid");
    controlRow.style("border-width", "0.5px");
    controlRow.style("border-color", "black");

    let buttonArea;
    buttonArea = p.createDiv();
    buttonArea.id("button-area");
    buttonArea.class("button-area");
    buttonArea.style("margin", "10px");
    buttonArea.parent(controlRow);

    let sliderArea;
    sliderArea = p.createDiv();
    sliderArea.id("slider-area");
    sliderArea.class("slider-area");
    sliderArea.style("margin", "0px");
    sliderArea.parent(controlRow);

    let sliderHolderR1;
    sliderHolderR1 = p.createDiv();
    sliderHolderR1.id("slider-holder-R1");
    sliderHolderR1.class("slider-holder-R1");
    sliderHolderR1.style("margin", "10px");
    sliderHolderR1.parent(sliderArea);

    let sliderHolderR2;
    sliderHolderR2 = p.createDiv();
    sliderHolderR2.id("slider-holder-R2");
    sliderHolderR2.class("slider-holder-R2");
    sliderHolderR2.style("margin", "10px");
    sliderHolderR2.parent(sliderArea);

    let sliderContainerR11;
    sliderContainerR11 = p.createDiv();
    sliderContainerR11.class("skider-cointainer");
    sliderContainerR11.parent(sliderHolderR1);

    let sliderContainerR12;
    sliderContainerR12 = p.createDiv();
    sliderContainerR12.class("skider-cointainer");
    sliderContainerR12.parent(sliderHolderR1);

    let sliderContainerR13;
    sliderContainerR13 = p.createDiv();
    sliderContainerR13.class("skider-cointainer");
    sliderContainerR13.parent(sliderHolderR1);

    let sliderContainerR21;
    sliderContainerR21 = p.createDiv();
    sliderContainerR21.class("skider-cointainer");
    sliderContainerR21.parent(sliderHolderR2);

    let sliderContainerR22;
    sliderContainerR22 = p.createDiv();
    sliderContainerR22.class("skider-cointainer");
    sliderContainerR22.parent(sliderHolderR2);

    const freqSlider = p.createSlider(0, 1, f0, 1 / 9);
    freqSlider.class("slider-control");
    freqSlider.parent(sliderContainerR11);

    const speedSlider = p.createSlider(0, 1, v0, 1 / 9);
    speedSlider.class("slider-control");
    speedSlider.parent(sliderContainerR12);

    const ampSlider = p.createSlider(0, 1, amp0, 1 / 9);
    ampSlider.class("slider-control");
    ampSlider.parent(sliderContainerR13);

    const rowDensitySlider = p.createSlider(0, 1, ROW_DENS, 1 / 9);
    rowDensitySlider.class("slider-control");
    rowDensitySlider.parent(sliderContainerR21);

    const colDensitySlider = p.createSlider(0, 1, COL_DENS, 1 / 9);
    colDensitySlider.class("slider-control");
    colDensitySlider.parent(sliderContainerR22);

    let freqLabel = p.createP("Frekvens");
    freqLabel.class("slider-label");
    freqLabel.parent(sliderContainerR11);

    let speedLabel = p.createP("Utbredningshastighet");
    speedLabel.class("slider-label");
    speedLabel.parent(sliderContainerR12);

    let ampLabel = p.createP("Amplitud");
    ampLabel.class("slider-label");
    ampLabel.parent(sliderContainerR13);

    let rowDensLabel = p.createP("Radtäthet");
    rowDensLabel.class("slider-label");
    rowDensLabel.parent(sliderContainerR21);

    let colDensLabel = p.createP("Kolumntäthet");
    colDensLabel.class("slider-label");
    colDensLabel.parent(sliderContainerR22);

    // Function make slider with label
    const makeSliderWithLabel = (labelText, start, row, col) => {
      const slider = p.createSlider(0, 1, start, 1/9);
      slider.class("slider-control");
      // row ==1 ? slider.parent("")
    };

    // Function make button and apply classes
    const makeButton = (label, handler) => {
      const btn = p.createButton(label);
      btn.class("button button-primary");
      btn.parent(buttonArea);
      btn.mousePressed(handler);
    };

    makeButton("Animering<br>av / på", toggle_anim);

    speedSlider.input(() => {
      v = speedSlider.value();
      v = 0.9 * v + 0.1; // Transform to viewports / s, start at 0.25
      console.log(v);
      // console.log(v);
      document.getElementById("speed-value-trav-long").innerText =
        p.nf(v, 1, 2) + " viewport/s";
    });

    freqSlider.input(() => {
      f = freqSlider.value();
      f = 1.5 * f + 0.5; // Transform to viewports / s, start at 0.5
      // console.log(f);
      document.getElementById("freq-value-trav-long").innerText = p.nf(f, 1, 2) + " Hz";
    });

    rowDensitySlider.input(() => {
      pixelYDensity = rowDensitySlider.value();
      pixelYDensity = p.int(45 * pixelYDensity + 5); // Transform to viewports / s, start at 0.5
    });

    colDensitySlider.input(() => {
      pixelXDensity = colDensitySlider.value();
      pixelXDensity = p.int(((45 * 16) / 9) * pixelXDensity + (5 * 16) / 9); // Transform to viewports / s, start at 0.5
    });

    ampSlider.input(() => {
      amp = ampSlider.value();
      amp = 27 * amp + 3; // Transform to viewports / s, start at 0.5
      // console.log(amp);
      document.getElementById("amp-value-trav-long").innerText =
        p.nf(amp / 30, 1, 2) * 100 + " %";
    });

    amp = 27 * amp0 + 3;
    v = 0.9 * v0 + 0.1;
    f = 1.5 * f0 + 0.5;
    pixelYDensity = p.int(45 * ROW_DENS + 5);
    pixelXDensity = p.int(((45 * 16) / 9) * COL_DENS + 5);

    // Create the waveInfo box
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
        <span class="info-value" id="freq-value-trav-long">${p.nf(f, 1, 2)} Hz</span>
      </div>
      <div class="info-row">
        <span class="info-label">Utbredningshastighet:</span>
        <span class="info-value" id="speed-value-trav-long">${p.nf(
          // nf converts value to string
          v, // The value
          1, // String width
          2 // Number of decimals
        )} viewport/s</span>
      </div>
      <div class="info-row">
        <span class="info-label">Amplitud:</span>
        <span class="info-value" id="amp-value-trav-long">${
          p.int((amp / 30) * 100) + " %"
        }</span>        
  
      </div>
  `);
  };

  p.draw = () => {
    p.background(BG_COLOR);

    let dy = 1 / (pixelYDensity - 1);
    let dx = 1 / (pixelXDensity - 1);
    lambda = v / f;
    k = (2 * pi) / lambda;
    omega = 2 * pi * f;

    for (let i = 0; i < pixelXDensity; i++) {
      let xi = i * dx;
      x[i] = Math.sin(k * xi - omega * t);
    }

    for (let i = 0; i < pixelYDensity; i++) {
      y[i] = i * dy;
    }
    render();

    if (anim) {
      t += p.deltaTime / 1000;
    }
  };

  render = () => {
    p.fill(255, 0, 0);

    renderX = x.map((xi, i) => {
      xi *= amp;
      xi += (SCREEN_WIDTH / (pixelXDensity - 1)) * i;
      xi *= (SCREEN_WIDTH - 2 * PADDING) / SCREEN_WIDTH;
      return xi + PADDING;
    });

    renderY = y.map((yi, j) => {
      yi += (SCREEN_HEIGHT / (pixelYDensity - 1)) * j;
      yi *= (SCREEN_HEIGHT - 2 * PADDING) / SCREEN_HEIGHT;
      return yi + PADDING;
    });

    for (let i = 0; i < pixelXDensity; i++) {
      for (let j = 0; j < pixelYDensity; j++) {
        p.circle(renderX[i], renderY[j], P_SIZE);
      }
    }
  };

  p.keyPressed = () => {
    if (p.key == "s") {
      p.saveGif("anim.gif", 2);
    }
  };

  function toggle_anim() {
    anim = !anim;
    console.log("Animation is", anim ? "ON" : "OFF");
  }
};

// Create an instance
new p5(longSketch);
