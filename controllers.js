const {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const crypto = require("crypto");
const cardService = require("./services");

// Initialize the S3 client
const s3Client = new S3Client({ region: process.env.AWS_REGION });

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

    // Generate a hash of the image content
    const imageHash = crypto
      .createHash("sha256")
      .update(imageBuffer)
      .digest("hex");

    // Extract the first two words of the business name
    const businessNameWords = cardDetails.BusinessName.split(" ")
      .slice(0, 2)
      .join("_");

    // Construct the filename based on business name and category
    let fileName = `${businessNameWords}_${cardDetails.Category.replace(/\s+/g, "_") || "Uncategorized"}.png`;


    // Check for duplicate image
    const paramsList = {
      Bucket: process.env.S3_BUCKET_NAME,
      Prefix: fileName,
    };

    const listCommand = new ListObjectsV2Command(paramsList);
    const existingObjects = await s3Client.send(listCommand);

    if (existingObjects.Contents && existingObjects.Contents.length > 0) {
      // If the file exists, download it to check the hash
      const getObjectCommand = new GetObjectCommand({
        Bucket: paramsList.Bucket,
        Key: fileName,
      });
      const existingObject = await s3Client.send(getObjectCommand);

      const chunks = [];
      for await (const chunk of existingObject.Body) {
        chunks.push(chunk);
      }
      const existingImageBuffer = Buffer.concat(chunks);
      const existingImageHash = crypto
        .createHash("sha256")
        .update(existingImageBuffer)
        .digest("hex");

      if (imageHash === existingImageHash) {
        // If the hash matches, return the existing image URL
        const existingUrl = await getSignedUrl(s3Client, getObjectCommand, { expiresIn: 3600 }); // Expires in 1 hour
        return res.status(200).json({ imageUrl: existingUrl });
      }
    }

    // Upload the image to S3 without public access
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Body: imageBuffer,
      ContentType: "image/png",
    };

    const upload = new Upload({
      client: s3Client,
      params: uploadParams,
    });

    await upload.done();

    // Generate a pre-signed URL
    const imageUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: uploadParams.Bucket,
        Key: fileName,
      }),
      { expiresIn: 3600 }
    ); // Expires in 1 hour

    res.status(200).json({ imageUrl });
  } catch (err) {
    next(err);
    if (err.statusCode) {
      res.status(err.statusCode).json({
        error: err.message,
        ...err.additionalInfo,
      });
    } else {
      res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    }
  }
};
