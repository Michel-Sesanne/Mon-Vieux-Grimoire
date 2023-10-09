const multer = require('multer');   // pour gérer les téléchargements de fichiers
const sharp = require('sharp');     // pour le traitement des images
const fs = require('fs');   // pour effectuer les opérations de lecture et d'écriture de fichiers

const MIME_TYPES = {    // associe les types MIME d'images acceptés à leurs extensions de fichier correspondantes
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.memoryStorage(); //les fichiers téléchargés seront stockés en mémoire tampon plutôt que d'être écrits sur le disque

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
                    fs.writeFileSync('images/' + filename, data);   // "writeFileSync" est utilisée pour écrire des données dans un fichier de manière synchrone (le programme s'arrêtera jusqu'à ce que l'opération d'écriture soit terminée)
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