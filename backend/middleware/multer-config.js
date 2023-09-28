const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        const isValid = !!MIME_TYPES[file.mimetype];
        callback(isValid ? null : new Error(), isValid);
    }
}).single('image');

const resizeAndConvert = (buffer) => {
    return sharp(buffer)
        .resize({ width: 206, height: 260 })
        .webp()
        .toBuffer()
        .catch(error => {
            throw error;
        });
};

module.exports = (req, res, next) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Gestion spécifique des erreurs Multer
            return next(err);
        } else if (err) {
            return next(err);
        }

        // Vérifier si un fichier a été téléchargé (ce doit être le cas pour la création)
        if (req.file) {
            resizeAndConvert(req.file.buffer)
                .then((data) => {
                    const filename = Date.now() + '.webp';
                    fs.writeFileSync('images/' + filename, data);
                    req.file.filename = filename;
                    next();
                })
                .catch((error) => {
                    return next(error);
                });
        } else {
            // Aucun fichier n'a été téléchargé, continuer la modification sans changer l'ImageUrl
            next();
        }
    });
};

