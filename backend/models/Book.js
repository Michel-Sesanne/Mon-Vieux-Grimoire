const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({ // Le champ "Id" est automatiquement généré par Mongoose
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    {
      userId: { type: String, required: true },
      grade: { type: Number, required: true },
    }
  ],
  averageRating: { type: Number }, //"required: false" par défaut
});

module.exports = mongoose.model('Book', bookSchema);
// La méthode 'model' transforme ce modèle en un modèle utilisable