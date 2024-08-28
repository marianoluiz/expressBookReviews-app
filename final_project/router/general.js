const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  //check if it already exist
  if(username && password) {
    //successful registration
    if(isValid(username)) {
      users.push({"username": username, "password": password});
      res.status(200).json({message:"User registered successfully"});
    } else {
      //nahh
      return res.status(400).json({message:"User already exists"});
    }
  } else {
    //empty username and pass
    return res.status(400).json({message:"Unable to register user"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  res.send((books[isbn]));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let authorInput = req.params.author;
  let author_books = [];
  const bookKeys = Object.keys(books);
  bookKeys.forEach(key => {
    if(books[key].author === authorInput ) {
      author_books.push(books[key]);
    }
  })
  res.send((author_books));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let titleInput = req.params.title;
  let title_books = [];
  const bookKeys = Object.keys(books);
  bookKeys.forEach(key => {
    if(books[key].title === titleInput ) {
      title_books.push(books[key]);
    }
  })
  res.send((title_books));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
