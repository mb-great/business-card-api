const cardService = require('./services');

exports.getBusinessCard = async (req, res) => {
  try {
    const details = {
      BusinessName: req.query.BusinessName || 'Example Business',
      City: req.query.City || 'Sample City',
      District: req.query.District || 'Sample District',
      PhoneNo: req.query.PhoneNo || '123-456-7890',
      WebsiteURL: req.query.WebsiteURL || 'https://example.com',
      Category: req.query.Category || 'Retail',
      Location: req.query.Location || '123 Main St, Sample City, Sample District kdjn;kjgnkjsgknkgkn kfbkk fl dndnkdnk lorem dkdkdk kdkdkdkdkkdjn;kjgnkjsgknkgkn kfbkk fl dndnkdnk lorem dkdkdk kdkdkdkdk '
    };

    const imageBuffer = await cardService.generateBusinessCard(details);
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(imageBuffer, 'binary');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};
