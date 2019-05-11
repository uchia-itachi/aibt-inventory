const express=require("express");
const hbs = require('hbs');
var url = require('url');
const bodyParser=require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var app=express();

hbs.registerPartials(__dirname+'/views/partials');
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

var {mysql,con,verifylogin,savereciept} = require('./database/database.js');

app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        //expires: 6000000
    }
}));

app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
      res.clearCookie('user_sid');
    }
    next();
});

var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
      console.log(req.session.id);
      res.redirect('/home');
    }else {
        next();
    }
};

app.get('/', sessionChecker,(req, res) =>{
  res.render("login.html")
});

app.get('/home',(req,res) => {
  if(req.session.user && req.cookies.user_sid){
    var result1;var result2;
    con.query('select * from stocks',  function (error, results, fields){
      if(error){
        console.log(error.message);
      }
      result1 = results;
    });
    con.query('select * from logs',  function (error, results, fields){
      if(error){
        console.log(error.message);
      }
      result2 = JSON.parse(JSON.stringify(results));
      gohome();
    });

  }else{
    res.redirect('/');
  }
  function gohome(){
    res.render('homepage.html',{
      result1,
      result2
    });
  }
});

app.post('/login',verifylogin);
app.post('/savereciept',savereciept);
app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/');
    }
});


app.listen(3000, () => {
  console.log("Server running succesfully");
});
