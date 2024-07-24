const cardService = require('./services');

exports.getBusinessCard = async (req, res) => {
  try {
    // Read JSON data from the request body
    const details = req.body;
    const exmImg= 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png'

    // Validate and use default values if necessary
    const cardDetails = {
      BusinessName: details.BusinessName || '',
      Category: details.Category || '',
      PhoneNo: details.PhoneNo || '',
      Email: details.Email || '',
      WebsiteURL: details.WebsiteURL || '',
      Address: details.Address || '',
      City: details.City || '',
      State: details.State || '',
      Pincode: details.Pincode || '',
      Country: details.Country || '',
      LogoURL:details.LogoURL || ''
    };
   
    // Generate the business card image
    const imageBuffer = await cardService.generateBusinessCard(cardDetails);

    // Send the image buffer as a response
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(imageBuffer, 'binary');
  } catch (error) {
    res.status(500).send(error);
  }
};
