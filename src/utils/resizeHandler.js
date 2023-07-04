//import { s3Handler } from "./s3Handler";
const sharp = require("sharp");
const AWS = require("aws-sdk");

AWS.config.region = "us-east-1";
const s3 = new AWS.S3();

class ResizerHandler {
    constructor() {}

    async _process(event) {
        const { size, image } = event.pathParameters;
        return await this.resize(size, image);
    }

    async resize(image, width, height) {
        let newImage = image;
        const uri = image.split(";base64,").pop();
        let imgBuffer = Buffer.from(uri, "base64");
        await sharp(imgBuffer)
            .resize(width, height)
            .toFormat("png")
            .toBuffer()
            .then((resizedImage) => {
                newImage = resizedImage;
            })
            .catch((err) => {
                console.error(err);
            });
        const base64Image = `data:image/png;base64,${newImage.toString(
            "base64"
        )}`;
        return base64Image;
    }

    async upload(image, thumbnailName, bucket) {
        var uploadParams = { Bucket: bucket, Body: "", Key: "" };

        let newImage;
        const uri = image.split(";base64,").pop();
        let imgBuffer = Buffer.from(uri, "base64");

        await sharp(imgBuffer)
            .toFormat("png")
            .toBuffer()
            .then((resImage) => {
                newImage = resImage;
                console.log("newImage: ", newImage);
            })
            .catch((err) => {
                console.error(err);
            });

        uploadParams.Body = newImage;
        uploadParams.Key = `thumbnails/${thumbnailName}.png`;

        // call S3 to retrieve upload file to specified bucket
        s3.upload(uploadParams, function (err, data) {
            if (err) {
                console.log("Error", err);
            }
            if (data) {
                console.log("Upload Success", data.Location);
                return "Upload Success!";
            }
        });
    }

    async download(thumbnailName, bucket) {
        const key = `thumbnails/${thumbnailName}.png`;
        return await (async () => {
            try {
                const file = await s3
                    .getObject({ Bucket: bucket, Key: key })
                    .promise();
                const base64Image = `data:image/png;base64,${file.Body.toString(
                    "base64"
                )}`;
                //console.log("base64Image:", base64Image);
                return base64Image;
            } catch (err) {
                //console.log(err);
                console.log("Can't find key: ", key);
                return "File doesn't exist.";
            }
        })();
    }
}

module.exports = new ResizerHandler();
