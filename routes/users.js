const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/user');
const passport = require('passport');
const cors = require('./cors');
router.use(bodyParser.json());
const authenticate = require('../authenticate');

// router.post('/signup', (req, res, next) => {
//   User.findOne({username: req.body.username})
//   .then((user) => {
//     if(user != null) {
//       const err = new Error('User ' + req.body.username + ' already exists!');
//       err.status = 403;
//       next(err);
//     }
//     else {
//       return User.create({
//         username: req.body.username,
//         password: req.body.password});
//     }
//   })
//   .then((user) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'application/json');
//     res.json({status: 'Registration Successful!', user: user});
//   }, (err) => next(err))
//   .catch((err) => next(err));
// });

// router.post('/login', (req, res, next) => {

//   if(!req.session.user) {
//     const authHeader = req.headers.authorization;
    
//     if (!authHeader) {
//       const err = new Error('You are not authenticated!');
//       res.setHeader('WWW-Authenticate', 'Basic');
//       err.status = 401;
//       return next(err);
//     }
  
//     const auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
//     const username = auth[0];
//     const password = auth[1];
  
//     User.findOne({username: username})
//     .then((user) => {
//       if (user === null) {
//         const err = new Error('User ' + username + ' does not exist!');
//         err.status = 403;
//         return next(err);
//       }
//       else if (user.password !== password) {
//         const err = new Error('Your password is incorrect!');
//         err.status = 403;
//         return next(err);
//       }
//       else if (user.username === username && user.password === password) {
//         req.session.user = 'authenticated';
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'text/plain');
//         res.end('You are authenticated!')
//       }
//     })
//     .catch((err) => next(err));
//   }
//   else {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end('You are already authenticated!');
//   }
// })

router.post('/signup',cors.corsWithOptions, (req, res, next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      if (req.body.firstname)
        user.firstname = req.body.firstname;
      if (req.body.lastname)
        user.lastname = req.body.lastname;
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      });
    }
  });
});

router.post('/login',cors.corsWithOptions, /*passport.authenticate('local'),*/ (req, res) => {
  passport.authenticate('local',(err,user,info)=>{ 
    if(err) {
      return next(err)
    }
    if(!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false, status: 'Login Unsuccessful!'});
    }
    req.logIn(user,(err)=> {
      if(err){
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!'})
      }
    })
  })
  const token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'Log in successful!'});
});

router.get('/logout',cors.corsWithOptions, (req, res,next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    const err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

router.get('/',cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=> {
  if(req.user.admin) {
    User.find({})
    .then(users => {
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json')
      res.json(users)
    },(err)=> next(err))
    .catch(err=> next(err))
  }
})

//se passport tiver criado o usuario(o req.user n estiver vazio, ele gera um jwt e manda pro usuario)
router.get('/facebook/token',passport.authenticate('facebook-token'),(req,res)=> {
  if(req.user) {
    let token = authenticate.getToken({_id:req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
  }
})

router.get('/checkJWTtoken', cors.corsWithOptions, (req, res) => {
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if (err)
      return next(err);
    
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT invalid!', success: false, err: info});
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT valid!', success: true, user: user});

    }
  }) (req, res);
});
module.exports = router;
