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
            throw error; // Renvoie l'erreur telle qu'elle est produite
        });
};

module.exports = (req, res, next) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Gestion spécifique des erreurs Multer
            return next(err);
        } else if (err) {
            // Autres erreurs, renvoie l'erreur telle qu'elle est produite
            return next(err);
        }

        if (!req.file) {
            // Aucun fichier fourni, renvoie une nouvelle Error
            return next(new Error());
        }

        resizeAndConvert(req.file.buffer)
            .then((data) => {
                const filename = Date.now() + '.webp';
                fs.writeFileSync('images/' + filename, data);
                req.file.filename = filename;
                next();
            })
            .catch((error) => {
                // Renvoie l'erreur telle qu'elle est produite
                return next(error);
            });
    });
};

