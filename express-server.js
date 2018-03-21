let express = require("express");
let app = express();
let PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

let urlDatabase = {
  "user1" : {  "b2xVn2": "http://www.lighthouselabs.ca",
     "9sm5xK": "http://www.google.com",
     "muFQNZ": "http://www.github.com",
     "ry6Nfx": "http://www.cbc.ca"},
  "Andrew" : { "D3pMhr": "http://www.craigslist.org" ,
    "AkSRNi": "http://http.cat",
    "6y25ws": "https://nodemon.io/"},
  "user3" : { "yKQrHo": "http://www.usedvictoria.com",
    "gbxHsa": "http://www.facebook.com",
    "RZbVdz": "http://www.youtube.com"}
};

app.set("view engine", "ejs");


// kinda useless
app.get("/", (req, res) => {
  res.end("Hello!");
});

// super basic API... client can just get the whole database.
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// main page for URL app
app.get("/urls", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

// form to create new short URL
app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
    random: generateRandomString()
  };
  res.render("urls_new", templateVars);
})

// show details for given short url, and show form to allow updating
app.get("/urls/:id", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id]
  };
  res.render("urls_show", templateVars);
});

// redirect based on valid short URL, or just redirect to main page otherwise
app.get("/u/:shortURL", (req, res) => {
  let redirect = "/urls"; //default redirect to main page
  if(urlDatabase[req.params.shortURL]){
    redirect = urlDatabase[req.params.shortURL];
  }
  res.redirect(redirect);
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

// login user username
app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

// create new database record
app.post("/urls", (req, res) => {
  let newKey = generateRandomString();
  urlDatabase[newKey] = req.body.longURL;
  res.redirect("/urls");
});

// update existing database record, if it exists.
app.post("/urls/:id", (req, res) => {
  //check to make sure id exists.
  if(urlDatabase[req.params.id]){
    urlDatabase[req.params.id] = req.body.longURL;
  }
  res.redirect("/urls");
});

// delete record, if it exists
app.post("/urls/:id/delete", (req, res) => {
  //check to make sure id exists.
  if(urlDatabase[req.params.id]){
    delete urlDatabase[req.params.id];
  }
  res.redirect("/urls");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

function generateRandomString(){
  let length = 6;
  let result = "";
  const possible =  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  // I've removed some characters that might cause confusion like O/0, I/l/1
  for (let i = 0; i < length; i++){
    result += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return result;
}
