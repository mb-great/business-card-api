const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const qr = require("qr-image");

const width = 1050;
const height = 600;

function shortenBusinessNameToFitCanvas(ctx, name, maxWidth) {
  // List of common business types and categories
  const businessTypes = [
    "Agriculture",
    "Automotive",
    "Banking",
    "Construction",
    "Consulting",
    "Catering",
    "Education",
    "Electronics",
    "Engineering",
    "Entertainment",
    "Event Planning",
    "Fashion",
    "Finance",
    "Food",
    "Furniture",
    "Gaming",
    "Healthcare",
    "Hospitality",
    "IT Services",
    "Legal",
    "Logistics",
    "Manufacturing",
    "Marketing",
    "Media",
    "Medical",
    "Mining",
    "Non-Profit",
    "Pharmaceuticals",
    "Property Management",
    "Publishing",
    "Real Estate",
    "Retail",
    "Security",
    "Software",
    "Telecommunications",
    "Tourism",
    "Transport",
    "Travel",
    "Utilities",
    "Wellness",
    "Advertising",
    "Agricultural Equipment",
    "Auto Repair",
    "Bakery",
    "Bar",
    "Beauty Salon",
    "Beverage Production",
    "Brokerage",
    "Car Dealership",
    "Childcare",
    "Cleaning Services",
    "Community Services",
    "Consulting Engineering",
    "Construction Materials",
    "Cosmetics",
    "Courier Services",
    "Creative Agencies",
    "Data Analytics",
    "Dental Clinic",
    "Design",
    "Diagnostic Centers",
    "Digital Marketing",
    "E-commerce",
    "Electrical Services",
    "Emergency Services",
    "Environmental Consulting",
    "Event Management",
    "Exhibitions",
    "Fitness",
    "Food Processing",
    "Furniture Manufacturing",
    "Gift Shop",
    "Graphic Design",
    "Health Insurance",
    "Home Decor",
    "Home Improvement",
    "Hotel",
    "Household Goods",
    "Industrial Equipment",
    "Interior Design",
    "Jewelry",
    "Law Firm",
    "Leisure",
    "Library",
    "Logistics Services",
    "Luxury Goods",
    "Machinery",
    "Management Consulting",
    "Market Research",
    "Medical Equipment",
    "Music Production",
    "Nursing",
    "Online Retail",
    "Optical",
    "Packaging",
    "Pest Control",
    "Pharmacy",
    "Photography",
    "Plumbing",
    "Printing",
    "Professional Development",
    "Real Estate Development",
    "Recycling",
    "Rental Services",
    "Repair Services",
    "Research",
    "Retail Management",
    "Salon",
    "Security Systems",
    "Software Development",
    "Spas",
    "Sports",
    "Telemedicine",
    "Textiles",
    "Traditional Medicine",
    "Travel Agency",
    "Vehicle Rental",
    "Waste Management",
    "Water Purification",
    "Wellness Centers",
    "Yoga",
    "Youth Services",
    "Accounting",
    "Agro-Tech",
    "Air Conditioning",
    "Art Supplies",
    "B2B Services",
    "B2C Services",
    "Barber Shop",
    "Business Consulting",
    "Cake Shop",
    "Child Development",
    "Construction Consulting",
    "Contract Manufacturing",
    "Cosmetic Surgery",
    "Credit Services",
    "Data Recovery",
    "Dog Training",
    "Dry Cleaning",
    "Elder Care",
    "Employment Agency",
    "Estate Planning",
    "Food Delivery",
    "Furnishings",
    "Gift Baskets",
    "Graphic Arts",
    "Health and Safety",
    "Home Security",
    "Housekeeping",
    "Industrial Design",
    "Insurance",
    "Interior Architecture",
    "International Trade",
    "IT Consulting",
    "Kitchenware",
    "Legal Services",
    "Massage Therapy",
    "Maternity Services",
    "Mobile Services",
    "Nutrition",
    "Outdoor Equipment",
    "Packaging Design",
    "Pet Services",
    "Public Relations",
    "Recruitment",
    "Renewable Energy",
    "Social Media",
    "Sports Goods",
    "Supply Chain",
    "Tech Startups",
    "Training Services",
    "Travel Insurance",
    "UX Design",
    "Veterinary Services",
    "Virtual Assistance",
    "Wedding Services",
    "Wine Production",
    "Youth Development"
  ];
  

  // Basic patterns and terms to preserve
  const importantPatterns = [
    /\b(ltd|limited|inc|corp|company|co|llc|plc|pvt|private)\b/i,
    /\b(and|sons|bros)\b/i
  ];

  // Apply common replacements
  const replacements = [
    { regex: /\band\b/gi, replacement: "&" },
    { regex: /\bsons\b/gi, replacement: "Sons" },
    { regex: /\bbrothers\b/gi, replacement: "Bros" },
    { regex: /\bltd\b/gi, replacement: "Ltd." },
    { regex: /\blimited\b/gi, replacement: "Ltd." }
  ];

  // Apply replacements
  replacements.forEach(({ regex, replacement }) => {
    name = name.replace(regex, replacement);
  });

  // Split name into words
  let words = name.split(" ");

  // Capitalize the first letter of each word
  function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }

  // Function to check if a word is a business type
  function isBusinessType(word) {
    return businessTypes.some(type => new RegExp(`\\b${type}\\b`, 'i').test(word));
  }

  // Function to preserve important patterns
  function isImportant(word) {
    return importantPatterns.some(pattern => pattern.test(word)) || isBusinessType(word);
  }

  // Generate the abbreviated version of the name
  function getAbbreviatedName(words) {
    return words
      .map((word, index) => {
        const lowerCaseWord = word.toLowerCase();

        // Preserve important keywords and last words
        if (isImportant(lowerCaseWord) || index === words.length - 1) {
          return capitalizeFirstLetter(word);
        }

        // Abbreviate other words
        return word.charAt(0).toUpperCase() + ".";
      })
      .join(" ");
  }

  // Shorten the name until it fits within the maxWidth
  let abbreviatedName = getAbbreviatedName(words);
  while (ctx.measureText(abbreviatedName).width > maxWidth && words.length > 1) {
    words = words.slice(0, -1);
    abbreviatedName = getAbbreviatedName(words) + "...";
  }

  return abbreviatedName;
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
function drawTextMaxWidth(ctx, text, x, y,fontSize, maxWidth, color) {
  ctx.fillStyle = color;
  ctx.font = `${fontSize}px Arial`;

  // Decrease the font size until the text fits within the maxWidth
  while (ctx.measureText(text).width > maxWidth && fontSize > 1) {
    fontSize--;
    ctx.font = `${fontSize}px Arial`;
  }

  // Draw the text
  ctx.fillText(text, x, y);
  fontSize = 40; // Adjust the initial font size as needed
  ctx.font = `${fontSize}px Arial`;
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

    // Set DPI
    canvas.dpi = 96; // Set this to your desired DPI

    // Load PNG images
    const categoryIconImg = await loadImage("./assets/category.png");
    const emailIconImg = await loadImage("./assets/email.png");
    const globeIconImg = await loadImage("./assets/globe.png");
    const locationPinDropImg = await loadImage("./assets/location.png");
    const phoneIconImg = await loadImage("./assets/phone.png");

    // Set background color
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.font = '10px "Arial"';

    // Margins
    const margin = 50;

    // Draw logo
    if (details.LogoURL && details.LogoURL.trim() !== "") {
      try {
        const logoImage = await loadImage(details.LogoURL);
        const maxWidth = 120;
        const maxHeight = 60;

        // Calculate aspect ratio
        const aspectRatio = logoImage.width / logoImage.height;
        let logoWidth = maxWidth;
        let logoHeight = maxHeight;

        if (logoImage.width > logoImage.height) {
          logoHeight = maxWidth / aspectRatio;
        } else {
          logoWidth = maxHeight * aspectRatio;
        }

        // Ensure the logo dimensions do not exceed the max values
        if (logoWidth > maxWidth) {
          logoWidth = maxWidth;
          logoHeight = maxWidth / aspectRatio;
        }
        if (logoHeight > maxHeight) {
          logoHeight = maxHeight;
          logoWidth = maxHeight * aspectRatio;
        }

        const logoX = width - logoWidth - 50;
        const logoY = 50;

        ctx.drawImage(logoImage, logoX, logoY - 3, logoWidth, logoHeight);
      } catch (error) {
        console.error("Error loading logo image:", error);
      }
    }


    let addressError = false;
    let categoryError = false;
    let countryError = false;
    let stateError = false;
    let cityError = false;
    let pinError = false;
    let phoneError = false;
    let businessError = false;

    let errorMessage = "Following parameters entered are wrong - ";

    // Validate the length of the input details
    if (details.Address.length > 100 ) {
      categoryError = true;
      errorMessage += "Category, ";
    }
    if (details.Category.length > 100 ) {
      categoryError = true;
      errorMessage += "Category, ";
    }
    if (details.Email.length > 200) {
      emailError = true;
      errorMessage += "Email, ";
    }
    if (details.Country.length > 55) {
      countryError = true;
      errorMessage += "Country, ";
    }
    if (details.State.length > 30) {
      stateError = true;
      errorMessage += "State, ";
    }
    if (details.City.length > 30 ) {
      cityError = true;
      errorMessage += "City, ";
    }
    if (details.Pincode.length > 13) {
      pinError = true;
      errorMessage += "Pincode, ";
    }
    if (details.BusinessName.length > 300) {
      businessError = true;
      errorMessage += "BusinessName, ";
    }
    if (details.PhoneNo.length > 20) {
      businessError = true;
      errorMessage += "PhoneNo, ";
    }

    // Trim the trailing comma and space
    if (errorMessage.endsWith(", ")) {
      errorMessage = errorMessage.slice(0, -2);
    }

    // Output the error message if any errors were found
    if (
      categoryError ||
      addressError ||
      countryError ||
      stateError ||
      cityError ||
      pinError ||
      phoneError ||
      businessError
    ) {
      console.log('Category error:', categoryError);
      console.log('Address error:', addressError);
      console.log('Country error:', countryError);
      console.log('State error:', stateError);
      console.log('City error:', cityError);
      console.log('Pin error:', pinError);
      console.log('Business error:', businessError);
      drawTextMaxWidth(
        ctx,
        errorMessage,
        margin,
        height-100,25,
        500,
        "red"
      );
    } else {
      console.log("All parameters are valid.");
    }

    // Draw the business name
    if (details.BusinessName && details.BusinessName.trim() !== "" && !businessError) {
      const businessNameText = `${details.BusinessName}`.trim();

      const maxWidth = 700; // Set this to your desired maximum width
      const shortenedName = shortenBusinessNameToFitCanvas(
        ctx,
        businessNameText,
        maxWidth
      );

      if (shortenedName === businessNameText) {
        drawText(ctx, shortenedName, margin, margin + 40, 70, "#333333");
      } else {
        drawTextMaxWidth(
          ctx,
          shortenedName,
          margin,
          margin + 40,40,
          700,
          "#333333"
        );
      }
    }

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
    if (details.Category && details.Category.trim() !== "") {
      ctx.drawImage(categoryIconImg, margin, textY - 29, 40, 40);
    }

    //Category
    if (details.Category && details.Category.trim() !== "" && !categoryError) {
      drawText(ctx, "Category:", margin + 60, textY, 30, "gray", "light"); // Light font weight
      const textWidth = ctx.measureText("Category:").width; // Measure the width of the text drawn
      drawTextMaxWidth(
        ctx,
        details.Category,
        margin + 235,
        textY,
        30,
        700,
        "black",
        "normal"
      ); // Bold font weight
      textY += lineHeight;
    }

    //phoneImg
    if (details.PhoneNo && details.PhoneNo.trim() !== "" && !phoneError) {
      ctx.drawImage(phoneIconImg, margin + 5, textY - 29, 35, 35);
    }

    // PhoneNo
    if (details.PhoneNo && details.PhoneNo.trim() !== "") {
      drawText(ctx, "Phone: ", margin + 60, textY, 30, "gray", "light"); // Light font weight
      const textWidth = ctx.measureText("Phone: ").width; // Measure the width of the text drawn
      drawText(
        ctx,
        details.PhoneNo,
        margin + 235,
        textY,
        30,
        "black",
        "normal"
      ); // Bold font weight
      textY += lineHeight;
    }

    //EmailImg
    if (details.Email && details.Email.trim() !== "") {
      ctx.drawImage(emailIconImg, margin + 5, textY - 29, 35, 35);
    }

    // Email
    if (details.Email && details.Email.trim() !== "") {
      drawText(ctx, "Email: ", margin + 60, textY, 30, "gray", "light");
      drawTextMaxWidth(ctx, details.Email, margin + 235, textY, 30,700, "black", "normal"); // Bold font weight
      textY += lineHeight;
    }

    //GlobeImg
    if (details.WebsiteURL && details.WebsiteURL.trim() !== "") {
      ctx.drawImage(globeIconImg, margin + 5, textY - 29, 35, 35);
    }

    // WebsiteURL
    if (details.WebsiteURL && details.WebsiteURL.trim() !== "") {
      drawText(ctx, "Website: ", margin + 60, textY, 30, "gray", "light"); // Light font weight
      drawText(
        ctx,
        details.WebsiteURL,
        margin + 235,
        textY,
        30,
        "black",
        "normal"
      ); // Bold font weight
      textY += lineHeight;
    }

    //locationPinImg
    if (details.Address && details.Address.trim() !== "") {
      ctx.drawImage(locationPinDropImg, margin + 10, textY - 29, 25, 35);
    }

    // Address
    if (details.Address && details.Address.trim() !== "") {
      drawText(ctx, "Address: ", margin + 60, textY, 30, "gray", "light"); // Light font weight
      drawTextMaxWidth(
        ctx,
        details.Address,
        margin + 235,
        textY,
        30,700,
        "black",
        "normal"
      ); // Bold font weight
      textY += lineHeight;
    }
    //City
    if (details.City && details.City.trim() !== "") {
      drawText(ctx, `${details.City}`, margin + 235, textY, 30);
      textY += lineHeight;
    }
    //State + pincode
    if (details.State && details.State.trim() !== "") {
      if (details.Pincode && details.Pincode.trim() !== "") {
        drawText(ctx, `${details.State} - ${details.Pincode}`, margin + 235, textY, 30);
      }
      else{
        drawText(ctx, `${details.State}`, margin + 235, textY, 30);
      }
    }
    textY += lineHeight;

    //Country
    if (details.Country && details.Country.trim() !== "") {
      drawText(ctx, `${details.Country}`, margin + 235, textY, 30);
      textY += lineHeight;
    }

    if (details.WebsiteURL && details.WebsiteURL.trim() !== "") {
      const qrCode = generateQRCode(details.WebsiteURL);
      const qrImage = await loadImage(qrCode);
      ctx.drawImage(qrImage, width - 250, height - 230, 200, 200);
    } else if (details.Email && details.Email.trim() !== "") {
      const qrCode = generateQRCode(`mailto:${details.Email}`);
      const qrImage = await loadImage(qrCode);
      ctx.drawImage(qrImage, width - 250, height - 230, 200, 200);
    }

    drawText(ctx, "Powered by Pintude", 50, height - 50, 30, "grey");
    addWatermarks(ctx, details.BusinessName, width, height);

    return canvas.toBuffer("image/png");
  } catch (error) {
    console.log(error);
  }
};
