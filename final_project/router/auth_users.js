const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=> {
//write code to check is the username is valid
  let usersWithSameName = users.filter((user) => {
    return user.username === username;
  });
    
  if(usersWithSameName.length > 0) {
    return false;
  } else {
    return true;
  }
}

const authenticatedUser = (username,password)=>{ 
  //check if it matches something in db
  let validUsers = users.filter(user => {
    return (user.username === username && user.password === password);
  });

  if(validUsers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
//localhost:5000/customer/login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
}

  //if it matches something in db
  if(authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 120 })

    req.session.authorization = {
      accessToken, username
    };

    res.status(200).json({message:"User logged in successfully"});
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
//localhost:5000/customer/auth/review/:isbn

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const user = req.user.username;

  if (books[isbn]) {

    if(user in books[isbn].reviews) {
      books[isbn].reviews[user] = review;
      return res.status(200).json({message: "Review modified successfully"});
    } else {
      books[isbn].reviews[user] = review; // directly assign when obj, push when array
      return res.status(200).json({message: "Review added / modified successfully"});
    }

  } else {
    return res.status(404).json({message: "Book not found"});
  }
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;