// jshint esversion:6

const router = require('express').Router();

const req = require('express/lib/request');
const Book = require('../models/Book.model.js');

// GET route to retrieve and display all the books
router.get('/books', (req, res, next) => {

    Book.find()
      .then(allTheBooksFromDB => {
        
        console.log('Retrieved books from DB:', allTheBooksFromDB);
        // if sending the allTheBooksFromDB data, the name must be the same in the hbs file receiving it.
        res.render('books/books-list.hbs', { books: allTheBooksFromDB });
      })
      .catch(error => {
        console.log('Error while getting the books from the DB: ', error);
   
        // Call the error-middleware to display the error page to the user
        next(error);
      });
});

router.get('/books/create', (req, res, next) => {
    res.render('books/book-create.hbs');
});

router.post('/books/create', (req, res, next) => {
    //console.log('New book info', req.body);
    const {title, author, description, rating} = req.body;

    //to create the newBook in the DB
    Book.create({ title, author, description, rating })
    //the create method returns the created doc
    /* .then(bookFromDB => {
        console.log(`New book created: ${bookFromDB.title}.`);
        res.render('books/book-details.hbs', { book: bookFromDB });
    }) */
    .then(()=> res.redirect('/books'))

    .catch(error => next(error));
});

// The order of routes matter and is important to write the "/books/:bookId" route AFTER the "/books/create" route. Otherwise, when receiving the GET request /books/create, the create part of the URL can be interpreted as a :bookId
router.get('/books/:id', (req, res) => {
    
    const bookId = req.params.id;
    //make query with mongoose methods using the params received
    Book.findById(bookId)
    //only after having the results we send it to the view and display it
    .then(theBook => res.render('books/book-details.hbs', { book: theBook }))
    .catch(error => {
      console.log('Error while retrieving book details: ', error);
 
      // Call the error-middleware to display the error page to the user
      next(error);
    });
});


module.exports = router;
