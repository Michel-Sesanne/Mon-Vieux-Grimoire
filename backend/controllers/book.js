const Book = require('../models/Book');
const fs = require('fs');

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

exports.getBestRating = (req, res, next) => {
  Book.find()
      .sort({ averageRating: -1 })
      .limit(3)
      .then(books => res.status(200).json(books))
      .catch(error => res.status(400).json({ error }))
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id})
    .then(book => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: 'unauthorized request'})
      } else {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({_id: req.params.id})
            .then(() => { res.status(200).json({ message: 'Livre supprimé !'})})
            .catch(error => res.status(401).json({ error }));
        });
      }
    })
    .catch(error => res.status(500).json({ error }));
};

exports.rateBook = (req, res, next) => {  
  Book.findOne({ _id: req.params.id })
      .then(book => {    
          // Vérifier si l'utilisateur a déjà noté ce livre
          book.ratings.map(rate => {
              if (req.auth.userId === rate.userId) {
                  res.status(400).json({ message: 'Vous avez déjà noté ce livre.' })
              }
          })
          // Ajouter la nouvelle notation au tableau "ratings" du livre
          book.ratings.push({
              "userId": req.auth.userId,
              "grade": req.body.rating
          });
          // Recalculer la note moyenne en utilisant toutes les notations du tableau "ratings"
          const totalGrades = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
          book.averageRating = totalGrades / book.ratings.length;
          // Mettre à jour la note moyenne dans le document du livre
          Book.updateOne({ _id: req.params.id }, book)          
              .then(() => { res.status(201).json(book)})
              .catch((error) => { res.status(401).json({ error }) });
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    book.save()
     .then(() => { res.status(201).json({ message: 'Livre enregistré !'})})
     .catch(error => { res.status(400).json({ error })})
};

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete bookObject._userId;
    
    Book.findOne({_id: req.params.id})
      .then((book) => {
        if (book.userId != req.auth.userId) {
          res.status(403).json({ message: 'unauthorized request'});          
        } else {
          if (req.file) {
            // Supprimer l'ancienne image si une nouvelle image est fournie
            const filename = book.imageUrl.split('/images/')[1];
            fs.unlinkSync(`images/${filename}`);
          }
          Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
           .then(() => res.status(200).json({ message: 'Livre modifié !' }))
           .catch(error => res.status(401).json({ error }));
        }
      })
      .catch((error) => { res.status(400).json({ error })});
};
