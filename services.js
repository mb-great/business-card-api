const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const qr = require("qr-image");

const width = 1050;
const height = 600;

async function loadImageFromFile(filePath) {
  try {
    const fullPath = path.resolve(__dirname, filePath); // Resolves the full path
    const file = fs.readFileSync(fullPath); // Read file synchronously
    return await loadImage(file); // Pass the buffer to loadImage
  } catch (error) {
    console.error("Error loading PNG image from file:", filePath);
    console.error("Error details:", error);
    throw error;
  }
}

function drawText(ctx, text, x, y, fontSize, color = "black", rotate = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotate);
  ctx.fillStyle = color;
  ctx.font = `${fontSize}px Arial`;
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

function generateQRCode(url) {
  return qr.imageSync(url, { type: "png" });
}

function addWatermarks(ctx, text, width, height) {
  ctx.globalAlpha = 0.1;
  const stepX = 200;
  const stepY = 100;
  const fontSize = 40;
  const angle = -Math.PI / 4;

  for (let x = 0; x < width; x += stepX) {
    for (let y = 0; y < height; y += stepY) {
      drawText(ctx, text, x, y, fontSize, "gray", angle);
    }
  }
  ctx.globalAlpha = 1;
}

exports.generateBusinessCard = async (details) => {
  try {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    // Load PNG images
    const phoneIconImg = await loadImage("./assets/phone.png");
    const globeIconImg = await loadImage("./assets/globe.png");
    const locationPinDropImg = await loadImage("./assets/location.png");

    // Set background color
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Margins
    const margin = 50;

    // Draw the logo
    if (details.LogoURL && details.LogoURL.trim() !== "") {
      const logoImage = await loadImage(details.LogoURL);
      if (logoImage) {
        ctx.drawImage(logoImage, width - 170, 50, 120, 60);
      }
    }

    const businessNameText = `${details.BusinessName}`.trim();
    drawText(ctx, businessNameText, margin, margin + 40, 70, "#333333");
    // Draw a separating line below the business name
    ctx.strokeStyle = "#333333";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin, margin + 60);
    ctx.lineTo(width - margin, margin + 60);
    ctx.stroke();

    // Draw the rest of the details with proper spacing
    let textY = margin + 150;
    const lineHeight = 40;

    // Draw PNG images (icons)
    ctx.drawImage(phoneIconImg, margin, height - 100, 50, 50);
    // ctx.drawImage(globeIconImg, width / 2 - 25, height - 100, 50, 50);
    // ctx.drawImage(locationPinDropImg, width - 100, height - 100, 50, 50);

    //details

    //Category
    if (details.Category && details.Category.trim() !== "") {
      drawText(ctx, `Category: ${details.Category}`, margin, textY, 30);
      textY += lineHeight;
    }
    // ctx.drawImage(PhoneIconSvgImg, width - 250, height - 230, 200, 200);
    // PhoneNo
    if (details.PhoneNo && details.PhoneNo.trim() !== "") {
      drawText(ctx, `Phone: ${details.PhoneNo}`, margin, textY, 30);
      textY += lineHeight;
    }
    // Email
    if (details.Email && details.Email.trim() !== "") {
      drawText(ctx, `Phone: ${details.Email}`, margin, textY, 30);
      textY += lineHeight;
    }
    // WebsiteURL
    if (details.WebsiteURL && details.WebsiteURL.trim() !== "") {
      drawText(ctx, `Phone: ${details.WebsiteURL}`, margin, textY, 30);
      textY += lineHeight;
    }

    // Location
    if (details.Address && details.Address.trim() !== "") {
      drawText(ctx, `Address: ${details.Address}`, margin, textY, 30);
      textY += lineHeight;
    }
    if (details.District && details.District.trim() !== "") {
      drawText(ctx, `District: ${details.District}`, margin, textY, 30);
      textY += lineHeight;
    }
    if (details.City && details.City.trim() !== "") {
      drawText(ctx, `City: ${details.City}`, margin, textY, 30);
      textY += lineHeight;
    }
    if (details.State && details.State.trim() !== "") {
      if (details.Pincode && details.Pincode.trim() !== "") {
        drawText(
          ctx,
          `State: ${details.State}-${details.Pincode}`,
          margin,
          textY,
          30
        );
      } else {
        drawText(ctx, `State: ${details.State}`, margin, textY, 30);
      }
    }
    textY += lineHeight;

    const qrCode = generateQRCode(details.WebsiteURL);
    const qrImage = await loadImage(qrCode);
    ctx.drawImage(qrImage, width - 250, height - 230, 200, 200);

    drawText(ctx, "Powered by Pintude", 50, height - 50, 30, "grey");
    addWatermarks(ctx, details.BusinessName, width, height);

    return canvas.toBuffer("image/png");
  } catch (error) {
    console.log(error);
  }
};
