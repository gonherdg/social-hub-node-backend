const sharp = require("sharp");

const cut = (str, maxLength) => {
    var trimmedString =
        str.length > maxLength ? str.substring(0, maxLength - 3) + "..." : str;
    return trimmedString;
};

const log = (message) => {
    console.log(cut(message, 200));
};

const resize = async (inputBuffer) => {
    const res = sharp(inputBuffer).resize(320, 240);
    console.log("TODO OK");
    return res;
};

async function resizeOLD(image) {
    // Function name is same as of file name
    // Reading Image
    //Jimp.read(image);
    console.log("original image: ", image);
    const newImage = await Jimp.read(image);
    //const newImage = await Jimp.read("/home/jimp/tutorials_point_img.jpg");
    return newImage.resize(100, 100, function (err) {
        if (err) {
            console.err("ERRORRRR: ", err.message);
            throw err;
        }
        console.log("UTILS: resized ok");
    });

    //.write("/home/jimp/resize.jpeg");
}

module.exports = { resize, cut, log };
