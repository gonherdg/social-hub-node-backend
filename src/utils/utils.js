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

module.exports = { resize, cut, log };
