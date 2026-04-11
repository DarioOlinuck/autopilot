export function removeGreenBackground(img: HTMLImageElement): HTMLCanvasElement {
  const offscreen = document.createElement('canvas');
  offscreen.width = img.naturalWidth;
  offscreen.height = img.naturalHeight;
  const offCtx = offscreen.getContext('2d')!;
  offCtx.drawImage(img, 0, 0);
  const imageData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (g > 100 && g > r * 1.4 && g > b * 1.4) {
      data[i + 3] = 0;
    }
  }
  offCtx.putImageData(imageData, 0, 0);
  return offscreen;
}
