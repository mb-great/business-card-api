const cardService = require("./services");

exports.getBusinessCard = async (req, res, next) => {
  try {
    // Read JSON data from the request body
    const details = req.body;
    // Validate and use default values if necessary
    const cardDetails = {
      BusinessName: details.BusinessName || "",
      Category: details.Category || "",
      PhoneNo: details.PhoneNo || "",
      Email: details.Email || "",
      WebsiteURL: details.WebsiteURL || "",
      Address: details.Address || "",
      City: details.City || "",
      State: details.State || "",
      Pincode: details.Pincode || "",
      Country: details.Country || "",
    };

    // Generate the business card image
    const imageBuffer = await cardService.generateBusinessCard(cardDetails);

    // Send the image buffer as a response
    res.writeHead(200, { "Content-Type": "image/png" });
    res.end(imageBuffer, "binary");
  } catch (err) {
    next(err);
    if (err.statusCode) {
      res.status(err.statusCode).json({
        error: err.message,
        ...err.additionalInfo,
      });
    } else {
      res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
  }
};
