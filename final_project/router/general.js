const express = require('express');
let books = require("./booksdb.js");
const public_users = express.Router();

// Get the book list available in the shop using async-await
public_users.get('/', async (req, res) => {
    try {
        // Simulate an asynchronous operation with a Promise
        const getBooks = () => new Promise((resolve, reject) => {
            resolve(books);
        });

        const bookList = await getBooks();
        res.status(200).json(bookList);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

// Get book details based on ISBN using async-await
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        // Simulate an asynchronous operation with a Promise
        const getBookByISBN = () => new Promise((resolve, reject) => {
            const book = books[isbn];
            if (book) {
                resolve(book);
            } else {
                reject(new Error("Book not found"));
            }
        });

        const book = await getBookByISBN();
        res.status(200).json(book);
    } catch (error) {
        res.status(404).json({ message: "Error fetching book details", error: error.message });
    }
});

// Get book details based on author using async-await
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author.toLowerCase();
    try {
        // Simulate an asynchronous operation with a Promise
        const getBooksByAuthor = () => new Promise((resolve, reject) => {
            const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author);
            if (filteredBooks.length > 0) {
                resolve(filteredBooks);
            } else {
                reject(new Error("No books found by this author"));
            }
        });

        const booksByAuthor = await getBooksByAuthor();
        res.status(200).json(booksByAuthor);
    } catch (error) {
        res.status(404).json({ message: "Error fetching books by author", error: error.message });
    }
});

// Get book details based on title using async-await
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title.toLowerCase();
    try {
        // Simulate an asynchronous operation with a Promise
        const getBooksByTitle = () => new Promise((resolve, reject) => {
            const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title);
            if (filteredBooks.length > 0) {
                resolve(filteredBooks);
            } else {
                reject(new Error("No books found with this title"));
            }
        });

        const booksByTitle = await getBooksByTitle();
        res.status(200).json(booksByTitle);
    } catch (error) {
        res.status(404).json({ message: "Error fetching books by title", error: error.message });
    }
});

module.exports.general = public_users;
