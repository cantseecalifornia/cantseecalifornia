const PRESETS = {
  "1920x1080": {
    width: 1920,
    height: 1080,
    columns: 8,
    rows: 5,
    prefix: "1920_1080"
  },
  "1600x1200": {
    width: 1600,
    height: 1200,
    columns: 7,
    rows: 5,
    prefix: "1600_1200"
  },
  "1280x1024": {
    width: 1280,
    height: 1024,
    columns: 5,
    rows: 4,
    prefix: "1280_1024"
  }
};

const fileInput = document.getElementById("file");
const dropZone = document.getElementById("drop");
const presetSelect = document.getElementById("preset");
const fitSelect = document.getElementById("fit");
const makeButton = document.getElementById("make");
const previewCanvas = document.getElementById("preview");
const previewContext = previewCanvas.getContext("2d");
const progress = document.getElementById("progress");
const progressBar = progress.querySelector("i");
const status = document.getElementById("status");
const dimensions = document.getElementById("dimensions");
const info = document.getElementById("info");

let sourceImage = null;

function getPreset() {
  return PRESETS[presetSelect.value];
}

function updatePresetUI() {
  const preset = getPreset();

  previewCanvas.width = preset.width;
  previewCanvas.height = preset.height;
  
  redrawPreview();
}

function drawImageToCanvas(context, image, width, height, mode) {
  context.clearRect(0, 0, width, height);
  context.fillStyle = "#000";
  context.fillRect(0, 0, width, height);

  const imageWidth = image.naturalWidth;
  const imageHeight = image.naturalHeight;

  const scale = mode === "cover"
    ? Math.max(width / imageWidth, height / imageHeight)
    : Math.min(width / imageWidth, height / imageHeight);

  const drawWidth = imageWidth * scale;
  const drawHeight = imageHeight * scale;
  const x = (width - drawWidth) / 2;
  const y = (height - drawHeight) / 2;

  context.drawImage(image, x, y, drawWidth, drawHeight);
}

function redrawPreview() {
  const preset = getPreset();

  if (!sourceImage) {
    previewContext.fillStyle = "#0b0d10";
    previewContext.fillRect(0, 0, preset.width, preset.height);
    return;
  }

  drawImageToCanvas(
    previewContext,
    sourceImage,
    preset.width,
    preset.height,
    fitSelect.value
  );
}

function loadImage(file) {
  if (!file || !file.type.startsWith("image/")) {
    status.textContent = "Please select a valid image file.";
    return;
  }

  const url = URL.createObjectURL(file);
  const image = new Image();

  image.onload = () => {
    sourceImage = image;
    dimensions.textContent = `${image.naturalWidth} × ${image.naturalHeight}px`;
    makeButton.disabled = false;
    status.textContent = "";
    redrawPreview();
    URL.revokeObjectURL(url);
  };

  image.onerror = () => {
    status.textContent = "The selected image could not be opened.";
    URL.revokeObjectURL(url);
  };

  image.src = url;
}

function createTga(canvas) {
  const width = canvas.width;
  const height = canvas.height;
  const pixels = canvas.getContext("2d").getImageData(0, 0, width, height).data;

  const header = new Uint8Array(18);

  header[2] = 2;
  header[12] = width & 255;
  header[13] = (width >> 8) & 255;
  header[14] = height & 255;
  header[15] = (height >> 8) & 255;
  header[16] = 24;
  header[17] = 0;

  const output = new Uint8Array(18 + width * height * 3);
  output.set(header);

  let offset = 18;

  // TGA uses bottom-left origin here, and BGR pixel order.
  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;

      output[offset++] = pixels[index + 2];
      output[offset++] = pixels[index + 1];
      output[offset++] = pixels[index];
    }
  }

  return new Blob([output], { type: "image/x-tga" });
}

function createTileCanvas(sourceCanvas, x, y) {
  const tile = document.createElement("canvas");
  tile.width = 256;
  tile.height = 256;

  const context = tile.getContext("2d");

  context.fillStyle = "#000";
  context.fillRect(0, 0, 256, 256);
  context.drawImage(
    sourceCanvas,
    x,
    y,
    256,
    256,
    0,
    0,
    256,
    256
  );

  return tile;
}

function createLayoutText(preset) {
  const lines = [`resolution ${preset.width} ${preset.height}`];

  for (let row = 0; row < preset.rows; row++) {
    for (let column = 0; column < preset.columns; column++) {
      lines.push(
        `resource/background/${preset.prefix}_${row}_${column}.tga scaled ${column * 256} ${row * 256}`
      );
    }
  }

  return `${lines.join("\n")}\n`;
}

async function buildZip() {
  if (!sourceImage) {
    return;
  }

  const preset = getPreset();
  const zip = new JSZip();

  makeButton.disabled = true;
  progress.style.display = "block";
  progressBar.style.width = "0%";

  status.textContent = ".";
  await new Promise(resolve => setTimeout(resolve, 20));

  const fullCanvas = document.createElement("canvas");
  fullCanvas.width = preset.width;
  fullCanvas.height = preset.height;

  const fullContext = fullCanvas.getContext("2d");

  drawImageToCanvas(
    fullContext,
    sourceImage,
    preset.width,
    preset.height,
    fitSelect.value
  );

  const totalTiles = preset.columns * preset.rows;
  let completedTiles = 0;

  for (let row = 0; row < preset.rows; row++) {
    for (let column = 0; column < preset.columns; column++) {
      const tile = createTileCanvas(
        fullCanvas,
        column * 256,
        row * 256
      );

      const tga = createTga(tile);

      zip.file(
        `cstrike/resource/background/${preset.prefix}_${row}_${column}.tga`,
        tga
      );

      completedTiles++;

      const percent = Math.round(
        completedTiles / totalTiles * 100
      );

      progressBar.style.width = `${percent}%`;
      status.textContent =
        `..`;

      if (completedTiles % 2 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
  }

  const layout = createLayoutText(preset);

  zip.file(
    "cstrike/resource/BackgroundLayout.txt",
    layout
  );

  zip.file(
    "cstrike/resource/BackgroundLoadingLayout.txt",
    layout
  );

  status.textContent = "...";

  const zipBlob = await zip.generateAsync(
    {
      type: "blob",
      compression: "STORE"
    },
    metadata => {
      progressBar.style.width =
        `${Math.max(1, Math.round(metadata.percent))}%`;
    }
  );

  const downloadUrl = URL.createObjectURL(zipBlob);
  const link = document.createElement("a");

  link.href = downloadUrl;
  link.download =
    `${preset.prefix}_bg.zip`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => {
    URL.revokeObjectURL(downloadUrl);
  }, 1000);

  progressBar.style.width = "100%";
  status.textContent =
    `ok`;

  makeButton.disabled = false;
}

dropZone.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", event => {
  loadImage(event.target.files[0]);
});

["dragenter", "dragover"].forEach(eventName => {
  dropZone.addEventListener(eventName, event => {
    event.preventDefault();
    dropZone.classList.add("drag");
  });
});

["dragleave", "drop"].forEach(eventName => {
  dropZone.addEventListener(eventName, event => {
    event.preventDefault();
    dropZone.classList.remove("drag");
  });
});

dropZone.addEventListener("drop", event => {
  loadImage(event.dataTransfer.files[0]);
});

presetSelect.addEventListener("change", updatePresetUI);
fitSelect.addEventListener("change", redrawPreview);
makeButton.addEventListener("click", buildZip);

updatePresetUI();
