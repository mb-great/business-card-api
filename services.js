const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const qr = require("qr-image");

const width = 1050;
const height = 600;

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
    const categoryIconImg = await loadImage("./assets/category.png");
    const emailIconImg = await loadImage("./assets/email.png");
    const globeIconImg = await loadImage("./assets/globe.png");
    const locationPinDropImg = await loadImage("./assets/location.png");
    const phoneIconImg = await loadImage("./assets/phone.png");

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

    //details

    //categoryIconImg
    ctx.drawImage(categoryIconImg, margin, textY - 29, 40, 40);

    //Category
    if (details.Category && details.Category.trim() !== "") {
      drawText(ctx, "Category:", margin + 60, textY, 30, "gray", "light"); // Light font weight
      const textWidth = ctx.measureText("Category:").width; // Measure the width of the text drawn
      drawText(
        ctx,
        details.Category,
        margin + 60 + 4 * textWidth,
        textY,
        30,
        "black",
        "normal"
      ); // Bold font weight
      textY += lineHeight;
    }

    //phoneImg
    ctx.drawImage(phoneIconImg, margin+5, textY - 29, 35, 35);

    // PhoneNo
    if (details.PhoneNo && details.PhoneNo.trim() !== "") {
      drawText(ctx, "Phone: ", margin + 60, textY, 30, "gray", "light"); // Light font weight
      const textWidth = ctx.measureText("Phone: ").width; // Measure the width of the text drawn
      drawText(
        ctx,
        details.PhoneNo,
        margin + 60 + 5 * textWidth,
        textY,
        30,
        "black",
        "normal"
      ); // Bold font weight
      textY += lineHeight;
    }

    //EmailImg
    ctx.drawImage(emailIconImg, margin+5, textY - 29, 35, 35);

    // Email
    if (details.Email && details.Email.trim() !== "") {
      drawText(ctx, "Email: ", margin + 60, textY, 30, "gray", "light"); // Light font weight
      const textWidth = ctx.measureText("Email: ").width; // Measure the width of the text drawn
      drawText(
        ctx,
        details.Email,
        margin + 60 + 5.7 * textWidth,
        textY,
        30,
        "black",
        "normal"
      ); // Bold font weight
      textY += lineHeight;
    }

    //GlobeImg
    ctx.drawImage(globeIconImg, margin + 5, textY - 29, 35, 35);

    // WebsiteURL
    if (details.WebsiteURL && details.WebsiteURL.trim() !== "") {
      drawText(ctx, "Website: ", margin + 60, textY, 30, "gray", "light"); // Light font weight
      const textWidth = ctx.measureText("Website: ").width; // Measure the width of the text drawn
      drawText(
        ctx,
        details.WebsiteURL,
        margin + 60 + 4.2 * textWidth,
        textY,
        30,
        "black",
        "normal"
      ); // Bold font weight
      textY += lineHeight;
    }

    //locationPinImg
    ctx.drawImage(locationPinDropImg, margin+10, textY - 29, 25, 35);
    // Address
    if (details.Address && details.Address.trim() !== "") {
      drawText(ctx, "Address: ", margin + 60, textY, 30, "gray", "light"); // Light font weight
      const textWidth = ctx.measureText("Address: ").width; // Measure the width of the text drawn
      drawText(
        ctx,
        details.Address,
        margin + 60 + 4.2 * textWidth,
        textY,
        30,
        "black",
        "normal"
      ); // Bold font weight
      textY += lineHeight;
    }
    //City
    if (details.City && details.City.trim() !== "") {drawText(
        ctx,
        `${details.City}`,
        margin + 235,
        textY,
        30
      );
      textY += lineHeight;
    }
   
    if (details.State && details.State.trim() !== "") {
      drawText(
        ctx,
        `${details.State} ${details.Pincode}`,
        margin + 235,
        textY,
        30
      );
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
