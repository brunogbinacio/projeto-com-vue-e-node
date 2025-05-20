const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: "dpdbikthh",
    api_key: "833748692812662",
    api_secret: "U62BrTnj6yZtVzpjFLNjZI92XHw",
});

module.exports = async (file) => {
    try {
        const res = await cloudinary.uploader.upload(file);
        return res.secure_url;
    } catch (error) {
        return error;
    }
};
