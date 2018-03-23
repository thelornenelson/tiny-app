# TinyApp Project

TinyApp is a full stack web application built with Nodejs and Express. It allows users to create abbreviated urls with automatic redirection.

## Features

-Redirection from `/u/[xxxxxx]` is publicly accessible
-Users must log in to create new urls
-Urls are owned by the creating user and only the owner can edit a url
-Checks protocol on new or updated URLs, adds http:// if no protocol included.
-Creation or update date is stored and displayed for the owning user
-Number of redirects is tracked for each link and displayed for the owning user

## Final Product

!["Screenshot"](#)

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
