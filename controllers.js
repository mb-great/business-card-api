const cardService = require('./services');

exports.getBusinessCard = async (req, res) => {
  try {
    // Read JSON data from the request body
    const details = req.body;
    const exmImg= 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png'

    // Validate and use default values if necessary
    const cardDetails = {
      BusinessName: details.BusinessName || 'Google',
      Category: details.Category || 'Multinational Corporation and Technology company',
      PhoneNo: details.PhoneNo || '+1-650-253-0000',
      Email: details.Email || 'support@google.com',
      WebsiteURL: details.WebsiteURL || 'https://www.google.com',
      Address: details.Address || '1600 Amphitheatre Parkway',
      City: details.City || 'Mountain View',
      State: details.State || 'California',
      Pincode: details.Pincode || '94043',
      Country: details.Country || 'USA',
      LogoURL:details.LogoURL || 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg'
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
