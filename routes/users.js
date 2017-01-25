var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {
    'title':'Register'
  });
});

router.get('/login', function(req, res, next) {
  res.render('login', {
    'title':'LogIn'
  });
});

router.post('/register', function(req, res, next){
  //get form value
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password;


//check for image field
if(req.files.profileImage){
  console.log("Uploading File...");

  //file info
  var profileImageOriginalName = req.files.profileImage.originalname;
  var profileImageName = req.files.profileImage.name;
  var profileImageMime = req.files.profileImage.mimetype;
  var profileImagePath = req.files.profileImage.path;
  var profileImageExt = req.files.profileImage.extension;
  var profileImageSize = req.files.profileImage.size;
}else{
  //default image
  var profileImageName = 'noimage.png';
}

//form validation
req.checkBody('name', 'Name field is required').notEmpty();
req.checkBody('email', 'Email field is required').notEmpty();
req.checkBody('email', 'Email not valid').notEmpty();
req.checkBody('username', 'Username field is required').notEmpty();
req.checkBody('password', 'Password field is required').notEmpty();
req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

//check errors
var errors = req.validationErrors();

if(errors){
  res.render('register',{ 
    errors: errors,
    name: name,
    email: email,
    username: username,
    password: password,
    password2: password2
  });
}else{
  var newUser = newuser({
    name: name,
    email: email,
    username: username,
    password: password,
    profileImage: profileImageName
  });

  //create users
  //User.CreateUser(newUser, function(err, user){
    //console.log(user);
  //});


  //sucess message
  req.flash('success', 'you are now registered and may login');
  res.location('/');
  res.redirect('/');
}

});

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  user.getUserById(id, function( err, user){
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done){
    User.getUserByUsername(username, function(err, user){
      if(err) throw err;
      if(!user){
        console.log('Unknown user');
        return done(null, false,{message: 'Unknown User'});
      }

      User.comparePassword(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        }else{
          console.log('Invalid Password');
          return done(null, false, {message: 'Invalid password'});
        }
      });

    });
  }
));

router.post('/login', passport.authenticate('local', {failureRedirect:'/users/login', failureFlash:'Invalid username or password'}), function(req, res){
  console.log('/Authentication Successfull');
  req.flash('success', 'you are logged in');
  res.redirect('/');
});

router.get('/logout', function(req,res){
  req.logout();
  req.flash('success', 'you have logged out');
  res.redirect('/users/login');
});

module.exports = router;
