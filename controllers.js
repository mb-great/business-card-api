const cardService = require('./services');

exports.getBusinessCard = async (req, res) => {
  try {
    // Read JSON data from the request body
    const details = req.body;

    // Validate and use default values if necessary
    const cardDetails = {
      BusinessName: details.BusinessName || 'Example Business',
      City: details.City || 'Sample City',
      District: details.District || 'Sample District',
      PhoneNo: details.PhoneNo || '123-456-7890',
      WebsiteURL: details.WebsiteURL || 'https://example.com',
      Category: details.Category || 'Retail',
      Location: details.Location || '123 Main St, Sample City, Sample District'
    };

    // Generate the business card image
    const imageBuffer = await cardService.generateBusinessCard(cardDetails);

    // Send the image buffer as a response
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(imageBuffer, 'binary');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};
