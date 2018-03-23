# TinyApp Project

TinyApp is a full stack web application built with Nodejs and Express. It allows users to create abbreviated urls with automatic redirection.

## Features

- Redirection from `/u/[abc123]` is publicly accessible
- Redirection urls will avoid use of I/l/1/0/O characters to avoid possible confusion.
- Users must log in to create new urls
- Urls are owned by the creating user and only the owner can edit a url
- Checks protocol on new or updated URLs, adds http:// if no protocol included.
- Creation or update date is stored and displayed for the owning user
- Number of redirects is tracked for each link and displayed for the owning user

## Final Product

!["List of User's URLs"](https://github.com/thelornenelson/tiny-app/blob/master/docs/url-listing.png)
!["URL Editing"](https://github.com/thelornenelson/tiny-app/blob/master/docs/url-edit.png)
!["Example Error - trying to view details page for invalid URL"](https://github.com/thelornenelson/tiny-app/blob/master/docs/example-error.png)



## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session
- dateFormat


## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

### Sample users

- Includes 2 example users with some url redirects already stored:
  - email: `user@example.com`, pw `purple-monkey-dinosaur`
  - email: `user2@example.com`, pw `dishwasher-funk`
