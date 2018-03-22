let express = require("express");
let app = express();
let PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({ name: "session", secret: "so be sure to add something" }));

// obviously don't include passwords in comments like this in real life - these are
// examples for testing.
const users = {
  "geg7aa": {
    id: "geg7aa",
    email: "user@example.com",
    password: "$2a$10$ploTHotTOaWYZ4HFWJFjQOUNTjHTAJyt0NHsKzkUYkob5Lp3Otjkq" //purple-monkey-dinosaur
  },
 "vbei2j": {
    id: "vbei2j",
    email: "user2@example.com",
    password: "$2a$10$tOr2xR7yjaQ/3XL23.bdX.Q2M28YFoA2QXVDgW1RkL.Dr32qPhO2i" //dishwasher-funk
  }
};

const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userId: "geg7aa"},
  "9sm5xK": {longURL: "http://www.google.com", userId: "geg7aa"},
  "muFQNZ": {longURL: "http://www.github.com", userId: "geg7aa"},
  "ry6Nfx": {longURL: "http://www.cbc.ca", userId: "geg7aa"},
  "D3pMhr": {longURL: "http://www.craigslist.org", userId: "vbei2j"},
  "AkSRNi": {longURL: "http://http.cat", userId: "vbei2j"},
  "6y25ws": {longURL: "https://nodemon.io/", userId: "vbei2j"},
  "yKQrHo": {longURL: "http://www.usedvictoria.com", userId: "vbei2j"},
  "gbxHsa": {longURL: "http://www.facebook.com", userId: "vbei2j"},
  "RZbVdz": {longURL: "http://www.youtube.com", userId: "vbei2j"},
};


app.set("view engine", "ejs");

// redirect root to /urls
app.get("/", (req, res) => {
  res.redirect("/urls");
});

// super basic API... client can just get the whole database.
// should modify this so the user ids aren't included.
// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

// main page for URL app
app.get("/urls", (req, res) => {
  let userId = req.session.userId;
  let templateVars = {
    user: getUserById(userId),
    urls: userURLs(userId, urlDatabase)
  };
  res.render("urls_index", templateVars);
});

// form to create new short URL
app.get("/urls/new", (req, res) => {
  if(!req.session.userId){
    res.redirect("/login");
  } else {
    let templateVars = {
      user: getUserById(req.session.userId),
      random: generateRandomString()
    };
    res.render("urls_new", templateVars);
  }
})

// show details for given short url, and show form to allow updating
app.get("/urls/:id", (req, res) => {
  if(req.session.userId === urlDatabase[req.params.id].userId){
    let templateVars = {
      user: getUserById(req.session.userId),
      shortURL: req.params.id,
      longURL: urlDatabase[req.params.id].longURL
    };
    res.render("urls_show", templateVars);
  } else {
    res.status(403).send(`You're not authorized to edit ${req.params.id}`);
  }
});

// redirect based on valid short URL, or just redirect to main page otherwise
app.get("/u/:shortURL", (req, res) => {
  let redirect = "/urls"; //default redirect to main page
  if(urlDatabase[req.params.shortURL]){
    redirect = urlDatabase[req.params.shortURL].longURL;
  }
  res.redirect(redirect);
});

app.get("/register", (req, res) => {
  res.render("register", { user: null });
});

app.get("/login", (req, res) => {
  res.render("login", { user: null });
});

app.post("/register", (req, res) =>{
  if(userExists(req.body.email)){
    res.status(400).send('Bad Request (email already registered)');
  } else if(!req.body.email || !req.body.password){
    res.status(400).send('Bad Request (email or password empty)');
  } else {
    let newId = generateRandomString();
    users[newId] = {
      id: newId,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    };
    req.session.userId = newId;
    res.redirect("/urls");
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// login user if email and password match
app.post("/login", (req, res) => {
  let validUser = false;
  for(user in users){
    if(users[user].email === req.body.email){
      if(bcrypt.compareSync(req.body.password, users[user].password)){
        validUser = true;
        req.session.userId = user;
        res.redirect("/urls");
      }
    }
  }
  if(!validUser){
    res.status(403).send('Access Denied, invalid email or password');
  }
});

// create new database record
app.post("/urls", (req, res) => {
  let newKey = generateRandomString();
  urlDatabase[newKey] = { longURL: req.body.longURL, userId: req.session.userId};
  res.redirect("/urls");
});

// update existing database record, if it exists.
app.post("/urls/:id", (req, res) => {
  //check to make sure id exists.
  if(urlDatabase[req.params.id]){
    urlDatabase[req.params.id].longURL = req.body.longURL;
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

// returns new urls object, filtered by userId
function userURLs(userId, urlDatabase){
  let result = {};
  for(shortURL in urlDatabase){
    if(urlDatabase[shortURL].userId === userId){
      result[shortURL] = urlDatabase[shortURL].longURL;
    }
  }
  return result;
}

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

// returns true if email found for existing user, otherwise false
function userExists(email){
  for(user in users){
    if(users[user].email === email){
      return true;
    }
  }
  return false;

}

//returns refernce to user object if found, otherwise undefined.
function getUserById(userId){
  for(user in users){
    if(users[user].id === userId){
      return users[user];
    }
  }
}
