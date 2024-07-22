const { createCanvas, loadImage } = require('canvas');
const qr = require('qr-image');

const width = 1050;
const height = 600;

function drawText(ctx, text, x, y, fontSize, color = 'black', rotate = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotate);
  ctx.fillStyle = color;
  ctx.font = `${fontSize}px Arial`;
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

function generateQRCode(url) {
  return qr.imageSync(url, { type: 'png' });
}

function addWatermarks(ctx, text, width, height) {
  ctx.globalAlpha = 0.1;
  const stepX = 200;
  const stepY = 100;
  const fontSize = 30;
  const angle = -Math.PI / 4;

  for (let x = 0; x < width; x += stepX) {
    for (let y = 0; y < height; y += stepY) {
      drawText(ctx, text, x, y, fontSize, 'gray', angle);
    }
  }
  ctx.globalAlpha = 1;
}

exports.generateBusinessCard = async (details) => {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);

  drawText(ctx, `Business: ${details.BusinessName}`, 50, 100, 40);
  drawText(ctx, `City: ${details.City}`, 50, 160, 30);
  drawText(ctx, `District: ${details.District}`, 50, 210, 30);
  drawText(ctx, `Phone: ${details.PhoneNo}`, 50, 260, 30);
  drawText(ctx, `Website: ${details.WebsiteURL}`, 50, 310, 30);
  drawText(ctx, `Category: ${details.Category}`, 50, 360, 30);
  drawText(ctx, `Location: ${details.Location}`, 50, 410, 30);

  const qrCode = generateQRCode(details.WebsiteURL);
  const qrImage = await loadImage(qrCode);
  ctx.drawImage(qrImage, width - 250, height - 250, 200, 200);

  drawText(ctx, 'Powered by YourCompany', 50, height - 50, 30, 'grey');
  addWatermarks(ctx, 'Your Watermark', width, height);

  return canvas.toBuffer('image/png');
};
