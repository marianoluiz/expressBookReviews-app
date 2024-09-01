const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require('axios')

//register a user
//localhost:5000/register
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
  //localhost:5000/
  public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null, 4));
  });
  
    //task 10: used async await and axios
  public_users.get('/books',async function(req, res) {
    try {
      const response = await axios.get('http://localhost:5000/');
      const booksData = response.data;
      res.send(JSON.stringify(booksData, null, 4));
    } catch (error) {
      res.status(500).send("Error while fetching books");
    }
    }
  );
 

  // Get book details based on ISBN
  public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    res.send((books[isbn]));
  });

 //task 11
  public_users.get('/books/:isbn', async function (req, res) {
    try {
      const isbn = req.params.isbn;
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
      const personData = response.data;

      res.send(JSON.stringify(personData, null, 4));
    } catch (error) {
      res.status(500).send("Error while fetching books");
    }
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
  //task 12: promise
  public_users.get('/books/author/:author', function (req, res) {
    const author = req.params.author;
    new Promise((resolve, reject) => {
      axios.get(`http://localhost:5000/author/${author}`)
        .then((response) => {
        resolve(response.data);
      })
        .catch((error) => {
        reject(error);
      })
    })
      .then((data) => {
        res.send(JSON.stringify(data, null, 4)); // Send the resolved data
      })
      .catch((error) => {
        res.status(500).send("Error while fetching books"); // Handle the rejected error
      });
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
//task 13
public_users.get('/books/title/:title', function (req, res) {
  const title = req.params.title;
  
  new Promise((resolve,reject) => {
    axios.get(`http://localhost:5000/title/${title}`)
      .then((response) => {
      resolve(response.data);
    })
      .catch((error) => {
      reject(error);
    })
  })
  .then((data) => {
    res.send(JSON.stringify(data, null, 4));
  })
  .catch((error) => {
    res.status(500).send("Error while fetching books");
  });

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
