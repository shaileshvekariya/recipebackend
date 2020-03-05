const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,'public/userimages');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() +"-"+ file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log('multer');
        if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
            cb(null, true);
        } else {
            cb(new Error("File format should be PNG,JPG,JPEG"), false);
        }
    },
    limits:{fileSize:2000000}
});

module.exports = upload;