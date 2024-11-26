API Overview
Public Routes: These routes do not require authentication.

GET /: Fetch the list of books.
GET /isbn/:isbn: Fetch book details based on ISBN.
GET /author/:author: Fetch books by a specific author.
GET /title/:title: Fetch books by title.
POST /register: Register a new user.
Authenticated Routes: These routes require authentication.

POST /customer/login: Login for registered users.
PUT /customer/auth/review/:isbn: Add or modify a book review.
DELETE /customer/auth/review/:isbn: Delete a book review.
